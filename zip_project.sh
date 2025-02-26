#!/bin/bash
set -e

# This script creates a project.zip file that contains all files 
# not ignored by .gitignore.

if [ -d .git ]; then
    echo "Detected Git repository. Using Git to list non-ignored files..."
    # List all tracked files plus untracked files that are not ignored.
    file_list=$( (git ls-files -c && git ls-files -o --exclude-standard) | sort | uniq )
    
    # Create the zip archive, reading file names from standard input.
    echo "$file_list" | zip project.zip -@
else
    echo "No Git repository detected. Using rsync to exclude files from .gitignore..."
    
    # Create a temporary directory.
    temp_dir=$(mktemp -d)
    
    # Use rsync to copy everything except the patterns in .gitignore
    rsync -av --exclude-from=.gitignore ./ "$temp_dir/"
    
    # Change to the temp directory and zip its contents.
    (
        cd "$temp_dir"
        zip -r project.zip .
    )
    
    # Move the zip archive back to the original directory and clean up.
    mv "$temp_dir/project.zip" .
    rm -rf "$temp_dir"
fi

echo "Created project.zip"
