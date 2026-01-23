#!/usr/bin/env bash
set -e

# ====== Resolve directories robustly ======
SCRIPT_PATH="$(readlink -f "$0")"
SCRIPT_DIR="$(dirname "$SCRIPT_PATH")"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

# Your .env is inside cmd/api/
ENV_FILE="$PROJECT_ROOT/.env"
MIGRATIONS_PATH="$PROJECT_ROOT/migrations"

# ====== Load environment ======
if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "❌ .env file not found at $ENV_FILE"
  exit 1
fi

# ====== Validate required vars ======
: "${DB_HOST:?DB_HOST not set in .env}"
: "${DB_PORT:?DB_PORT not set in .env}"
: "${DB_USER:?DB_USER not set in .env}"
: "${DB_PASSWORD:?DB_PASSWORD not set in .env}"
: "${DB_NAME:?DB_NAME not set in .env}"

# Optional: environment protection
: "${APP_ENV:=development}"

# ====== Encode password safely ======
ENCODED_PASSWORD=$(python3 -c "import urllib.parse; print(urllib.parse.quote('''$DB_PASSWORD'''))")

# ====== Compose Postgres DSN ======
DATABASE_URL="postgres://${DB_USER}:${ENCODED_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?sslmode=disable"

# ====== Check command ======
COMMAND="$1"
if [ -z "$COMMAND" ]; then
  echo "Usage: $0 {up|down|force <version>|version}"
  exit 1
fi

# ====== Protect destructive commands ======
if [[ "$COMMAND" == "down" || "$COMMAND" == "force" ]]; then
  if [[ "$APP_ENV" == "production" ]]; then
    echo "❌ DOWN or FORCE migrations are blocked in production!"
    exit 1
  fi

  echo "⚠️  WARNING: You are about to run a potentially destructive migration ($COMMAND)."
  echo "This may DROP tables or DELETE data."
  echo ""
  read -p "Type DROP to continue: " CONFIRM

  if [[ "$CONFIRM" != "DROP" ]]; then
    echo "❌ Migration cancelled."
    exit 1
  fi
fi

# ====== Run migration ======
migrate -path "$MIGRATIONS_PATH" -database "$DATABASE_URL" "$@"
