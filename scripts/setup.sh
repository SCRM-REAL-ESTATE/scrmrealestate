#!/bin/bash
# One-time setup for publishing media: dependencies, ffmpeg, keys, drop folder.
# Safe to re-run — everything already done is skipped.
#
#   npm run setup
#
set -u

BOLD=$'\033[1m'; DIM=$'\033[2m'; GREEN=$'\033[32m'; YELLOW=$'\033[33m'; RED=$'\033[31m'; OFF=$'\033[0m'
step() { printf "\n%s%s%s\n" "$BOLD" "$1" "$OFF"; }
ok()   { printf "  %s✓%s %s\n" "$GREEN" "$OFF" "$1"; }
warn() { printf "  %s!%s %s\n" "$YELLOW" "$OFF" "$1"; }
fail() { printf "  %s✗%s %s\n" "$RED" "$OFF" "$1"; }

# Run from the project root no matter where this was invoked from.
cd "$(dirname "$0")/.." || exit 1

interactive() { [ -t 0 ]; }

# The project that hosts this site's media. Public value — the secret half is
# the service role key, which is only ever typed in below and kept locally.
DEFAULT_SUPABASE_URL="https://gzlwrvhwtepoomrwwpng.supabase.co"

printf "\n%sSCRM Media — setup%s\n" "$BOLD" "$OFF"
printf "%s  Getting this machine ready to publish photos and videos.%s\n" "$DIM" "$OFF"

# ── 1. Node ────────────────────────────────────────────────────────────────
step "1. Node"
if command -v node >/dev/null 2>&1; then
  ok "node $(node -v)"
else
  fail "Node isn't installed."
  echo "     Install the LTS build from https://nodejs.org, then run this again."
  exit 1
fi

# ── 2. Dependencies ────────────────────────────────────────────────────────
step "2. Project dependencies"
if [ -d node_modules ]; then
  ok "already installed"
else
  echo "  installing (this takes a minute the first time) …"
  if npm install --no-audit --no-fund >/dev/null 2>&1; then
    ok "installed"
  else
    fail "npm install failed — run it on its own to see why."
    exit 1
  fi
fi

# ── 3. ffmpeg ──────────────────────────────────────────────────────────────
step "3. ffmpeg (compresses video and photos before upload)"
if command -v ffmpeg >/dev/null 2>&1; then
  ok "found"
elif command -v brew >/dev/null 2>&1; then
  if interactive; then
    printf "  ffmpeg isn't installed. Install it with Homebrew now? [y/N] "
    reply=""; read -r reply || true
    case "$reply" in
      [yY]*)
        echo "  installing — this one takes a few minutes …"
        if brew install ffmpeg; then ok "installed"; else fail "brew install ffmpeg failed"; fi
        ;;
      *) warn "skipped — raw camera files can't be compressed until it's installed" ;;
    esac
  else
    warn "not installed. Run: brew install ffmpeg"
  fi
else
  warn "not installed, and Homebrew wasn't found."
  echo "     Install Homebrew from https://brew.sh, then: brew install ffmpeg"
fi

# ── 4. Supabase keys ───────────────────────────────────────────────────────
step "4. Supabase keys"
have_key=false
if [ -f .env.local ] && grep -q "^SUPABASE_SERVICE_ROLE_KEY=." .env.local 2>/dev/null; then
  have_key=true
fi

# A saved key can be stale — revoked, rotated, or from another project — and
# there's no way to tell from here. Always offer to replace it rather than
# silently reusing one that will fail at upload time.
replace_key=false
if [ "$have_key" = true ] && interactive; then
  ok ".env.local already has a key ($(grep "^SUPABASE_SERVICE_ROLE_KEY=" .env.local | cut -d= -f2- | cut -c1-16)…)"
  printf "  Replace it? [y/N] "
  ans=""; read -r ans || true
  case "$ans" in [yY]*) replace_key=true ;; esac
fi

if [ "$have_key" = true ] && [ "$replace_key" = false ]; then
  ok "keeping the saved key"
elif interactive; then
  echo "  Supabase → scrm-real-estate-web → Settings → API Keys."
  echo "  You want the SECRET key (sb_secret_…), not the publishable one."
  printf "  Project URL [%s]: " "$DEFAULT_SUPABASE_URL"
  supabase_url=""; read -r supabase_url || true
  [ -z "$supabase_url" ] && supabase_url="$DEFAULT_SUPABASE_URL"
  printf "  Secret key (sb_secret_… or legacy service_role eyJ…): "
  service_key=""; read -r service_key || true

  # Publishable keys can read but never write — catch the mix-up here rather
  # than as a permissions error halfway through an upload.
  case "$service_key" in
    sb_publishable_*|sb_publishable*)
      fail "That's the publishable key — it can't upload."
      echo "     Copy the one under \"Secret keys\" instead and re-run: npm run setup"
      service_key=""
      ;;
  esac

  if [ -n "$supabase_url" ] && [ -n "$service_key" ]; then
    [ -f .env.local ] || { [ -f .env.example ] && cp .env.example .env.local; }
    touch .env.local
    # Drop any existing values, then append the new ones.
    grep -v -e "^SUPABASE_URL=" -e "^SUPABASE_SERVICE_ROLE_KEY=" .env.local > .env.local.tmp 2>/dev/null || true
    mv .env.local.tmp .env.local
    {
      echo "SUPABASE_URL=$supabase_url"
      echo "SUPABASE_SERVICE_ROLE_KEY=$service_key"
    } >> .env.local
    ok "saved to .env.local (gitignored — it never leaves this machine)"
  else
    warn "skipped — add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local before uploading"
  fi
else
  warn "no .env.local yet — add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before uploading"
fi

# ── 5. Drop folder ─────────────────────────────────────────────────────────
step "5. Drop folder"
if [ -d media-src ]; then
  ok "media-src/ already exists"
else
  node scripts/sync-media.mjs >/dev/null 2>&1
  [ -d media-src ] && ok "created media-src/" || fail "could not create media-src/"
fi

if [ -d media-src ] && command -v open >/dev/null 2>&1; then
  open media-src 2>/dev/null && ok "opened it in Finder"
fi

# ── Done ───────────────────────────────────────────────────────────────────
printf "\n%sReady.%s\n\n" "$BOLD" "$OFF"
echo "  1. Drag your work into the folders inside media-src/:"
echo "       property/  vertical/  landscape/  carousels/  detail/  testimonials/  agency/"
echo "  2. Run:  npm run media"
echo "  3. Commit the changed src/data/media.json and push."
printf "\n%s  Everything is compressed and uploaded for you. Re-run this setup any time.%s\n\n" "$DIM" "$OFF"
