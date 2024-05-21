#!/bin/bash

# Configuration
OWNER="last-rev-llc" # Replace this with your GitHub username or organization
REPO="lastrev-starter-v2" # Replace this with your GitHub repo
GITHUB_TOKEN="your_github_token_here" # Replace this with your GitHub token

# GitHub API URL to list workflow runs
API_URL="https://api.github.com/repos/$OWNER/$REPO/actions/runs"

# Loop through all workflow runs and delete them
while true; do
    # Fetch workflow runs
    RUNS=$(curl -s -H "Authorization: token $GITHUB_TOKEN" "$API_URL" | jq -r '.workflow_runs[] | .id')

    # Check if RUNS is empty
    if [ -z "$RUNS" ]; then
        echo "No more workflow runs to delete or access denied."
        break
    fi

    for RUN_ID in $RUNS; do
        # Deleting each workflow run
        echo "Deleting workflow run: $RUN_ID"
        DELETE_RESPONSE=$(curl -s -X DELETE -H "Authorization: token $GITHUB_TOKEN" "https://api.github.com/repos/$OWNER/$REPO/actions/runs/$RUN_ID")

        if [ -z "$DELETE_RESPONSE" ]; then
            echo "Deleted workflow run: $RUN_ID successfully."
        else
            echo "Failed to delete workflow run: $RUN_ID"
        fi
    done

    # Small delay to avoid rate limiting
    sleep 5
done
