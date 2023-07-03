#!/bin/bash

# Function to url encode a string
url_encode() {
    local string="$1"
    local length="${#string}"
    local encoded=""

    for ((i = 0; i < length; i++)); do
        local c="${string:i:1}"
        case $c in
            [a-zA-Z0-9.~_-])
                encoded+="$c"
                ;;
            *)
                encoded+=$(printf '%%%02X' "'$c")
                ;;
        esac
    done

    echo "$encoded"
}

# Function to execute AWS CLI commands and check for errors
aws_cli() {
  output=$(eval "$*" 2>&1)
  exit_status=$?
  if [[ $exit_status -ne 0 ]]; then
    echo "An error occurred while executing the AWS CLI command: $*"
    echo "Error message: $output"
    return 1
  else
    echo "$output"
  fi
}

# Check if the AWS CLI is installed
if ! command -v aws &>/dev/null; then
  echo "aws is not installed. Please install it before running this script."
  exit 1
fi

# Check if the jq utility is installed
if ! command -v jq &>/dev/null; then
  echo "jq is not installed. Please install it before running this script."
  exit 1
fi

# Fetch and process secrets and parameters
if ! database_secret_json=$(aws_cli "aws secretsmanager get-secret-value --secret-id \"SstPocCdk-DatabaseSecret\" --profile \"sstpoc\" --query SecretString --output text"); then
  echo "Error: Unable to retrieve Database Secret"; exit 1; fi
database_username=$(echo "$database_secret_json" | jq -r '.username')
database_password=$(url_encode "$(echo "$database_secret_json" | jq -r '.password')")

if ! get_params_result="$(aws_cli "aws ssm get-parameters --names \"SstPocCdk-RdsEndpoint\" \"SstPocCdk-RdsPort\" --with-decryption --profile \"sstpoc\"")"; then
  echo "Error: Unable to retrieve parameters"; exit 1; fi
rds_endpoint=$(echo "$get_params_result" | jq -r '.Parameters[] | select(.Name | contains("RdsEndpoint")) | .Value')
rds_port=$(echo "$get_params_result" | jq -r '.Parameters[] | select(.Name | contains("RdsPort")) | .Value')

# Generate .env files
local_file=".env.local"
local_tmp_file=".env.local.tmp"
prod_file=".env.production"
prod_tmp_file=".env.production.tmp"

# If .env file exists, create a temporary copy to process and a backup
if [ -f "$local_file" ]; then
  cp "$local_file" "$local_tmp_file"
  cp "$local_file" ".env.local.bak.$(date +%Y%m%d%H%M%S)"
fi
if [ -f "$prod_file" ]; then
  cp "$prod_file" "$prod_tmp_file"
  cp "$prod_file" ".env.production.bak.$(date +%Y%m%d%H%M%S)"
fi

# Update or add the value pairs in the temporary .env files
for key in "DATABASE_URL"; do
  local_value=""
  case "$key" in
    DATABASE_URL) local_value="postgresql://${database_username}:${database_password}@localhost:5432/sstpoc" ;;
  esac
  local_value="${local_value//$'\n'/}"

  if [ -f "$local_tmp_file" ] && grep -q "^$key=" "$local_tmp_file"; then
    # macOS and GNU compatible in-place substitution
    sed -i.bak "s|^$key=.*|$key=$local_value|" "$local_tmp_file" && rm -f "$local_tmp_file.bak"
  else
    # Ensure a newline exists at the end of the file before appending new local_value pairs
    [[ -f "$local_tmp_file" && $(tail -c1 "$local_tmp_file") != $'\n' ]] && echo "" >>"$local_tmp_file"
    printf "%s=%s" "$key" "$local_value" >> "$local_tmp_file"
  fi

  prod_value=""
  case "$key" in
    DATABASE_URL) prod_value="postgresql://${database_username}:${database_password}@${rds_endpoint}:${rds_port}/sstpoc" ;;
  esac
  prod_value="${prod_value//$'\n'/}"

  if [ -f "$prod_tmp_file" ] && grep -q "^$key=" "$prod_tmp_file"; then
    # macOS and GNU compatible in-place substitution
    sed -i.bak "s|^$key=.*|$key=$prod_value|" "$prod_tmp_file" && rm -f "$prod_tmp_file.bak"
  else
    # Ensure a newline exists at the end of the file before appending new prod_value pairs
    [[ -f "$prod_tmp_file" && $(tail -c1 "$prod_tmp_file") != $'\n' ]] && echo "" >>"$prod_tmp_file"
    printf "%s=%s" "$key" "$prod_value" >> "$prod_tmp_file"
  fi
done

# Replace the original .env files with the updated temporary files
mv "$local_tmp_file" "$local_file"
mv "$prod_tmp_file" "$prod_file"
