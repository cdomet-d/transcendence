#!/bin/bash

# Get all remote branches and remove the ones that were deleted from the remote
git fetch --all --prune

# If some remote branches were deleted, delete their local counterparts
if git branch -vv | grep ': gone]'; then
    git branch -vv | grep ': gone]' | awk '{print $1}' | xargs git branch -D
fi

# Save the branch on which the script is run
current_branch=$(git rev-parse --abbrev-ref HEAD)

# git branch -r: lists remote branches
# grep -v '\->' excludes -> (which is the "main branch")
# sed: removes ANSI colors to leave only plaintext
# reads from the standard input and stores one line in variable "remote"
git branch -r | grep -v '\->' | sed "s,\x1B\[[0-9;]*[a-zA-Z],,g" | while read -r remote; do
    local_branch="${remote#origin/}"

# If $local_branch is not in the local branches, set up tracking local branch
# from remote
	echo "working on $local_branch"
    if ! git branch | grep -q "$local_branch"; then
        git branch --track "$local_branch" "$remote"
        echo "Created tracking branch: $local_branch"
    else
        echo "Tracking branch already exists: $local_branch"
    fi

# Checks the difference in the number of commits between the local branch and
# the remote one; if the remote has more commits, switches to that branch and
# pulls it
    if [ "$(git rev-list --count "$local_branch".."origin/$local_branch")" -gt 0 ]; then
        if git switch "$local_branch"; then
            git pull origin "$local_branch"
        else
			echo "Couldn't switch branch: commit your changes"
            break
        fi
    fi
done

# Returns to the current branch if any switches were made
if [ "$(git rev-parse --abbrev-ref HEAD)" != "$current_branch" ]; then
    git switch "$current_branch"
fi