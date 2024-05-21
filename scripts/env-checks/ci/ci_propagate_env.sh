#!/bin/bash

# ANSI Color Codes
RED='\033[0;31m'     # Red for errors
GREEN='\033[0;32m'   # Green for success messages
CYAN='\033[0;36m'    # Cyan for informational messages
NC='\033[0m'         # No Color, to reset to the default terminal color scheme

# Path to the root .env and .envkey files
root_env_file=".env"
root_envkey_file=".envkey"

# Path to the packages directory
packages_dir="packages"

# Path to the specific 'web' directory (adjust path as needed)
web_dir="apps/web"

# Check if .env file exists
if [ ! -f "$root_env_file" ]; then
    echo -e "${RED}Root .env file not found.${NC}"
    exit 1
fi

# Check if .envkey file exists
if [ ! -f "$root_envkey_file" ]; then
    echo -e "${RED}Root .envkey file not found.${NC}"
    exit 1
fi

# Optionally copy to the 'web' directory if it exists
if [ -d "$web_dir" ]; then
    cp "$root_env_file" "$web_dir/.env"
    cp "$root_envkey_file" "$web_dir/.envkey"
    echo -e "${CYAN}Copied .env and .envkey files to ${GREEN}$web_dir${NC}"
fi

# Iterate over subdirectories in the packages directory and copy both .env and .envkey files to their roots
for package in "$packages_dir"/*; do
    if [ -d "$package" ]; then
        cp "$root_env_file" "$package/.env"
        cp "$root_envkey_file" "$package/.envkey"
        # Combining the messages into a single line per package
        echo -e "${CYAN}Copied .env and .envkey files to ${GREEN}${package#${packages_dir}/}${NC}"
    fi
done

echo -e "${GREEN}Successfully copied .env and .envkey files to applicable directories.${NC}"
