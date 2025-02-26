#!/bin/bash

# Function to update the file path comment in TypeScript files
update_filepath_comment() {
    local file="$1"
    local relative_path
    relative_path=$(realpath --relative-to="$(pwd)" "$file")

    # Skip empty files
    if [ ! -s "$file" ]; then
        return
    fi

    # Create a temporary file
    temp_file=$(mktemp)

    {
        # Always add the correct file path comment first
        echo "// $relative_path"

        # Read the original file line by line,
        # skipping any leading lines that look like file path comments.
        local skip=true
        while IFS= read -r line; do
            if $skip; then
                if [[ "$line" =~ ^//\ .*/.*$ ]]; then
                    continue
                else
                    skip=false
                fi
            fi
            echo "$line"
        done < "$file"
    } > "$temp_file"

    # Replace the original file with the new one
    mv "$temp_file" "$file"
    echo "Updated file path comment in $file"
}

# Find and process all .ts and .tsx files
find . -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
    # Exclude node_modules and .next directories
    if [[ "$file" != *"/node_modules/"* && "$file" != *"/.next/"* ]]; then
        update_filepath_comment "$file"
    fi
done

echo "File path comments updated for TypeScript files."
