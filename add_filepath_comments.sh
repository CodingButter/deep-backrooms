#!/bin/bash

# Function to add file path comment to TypeScript files
add_filepath_comment() {
    local file="$1"
    local relative_path=$(realpath --relative-to="$(pwd)" "$file")
    
    # Check if file is empty
    if [ ! -s "$file" ]; then
        return
    fi
    
    # Check if first line is already the file path comment
    first_line=$(head -n 1 "$file")
    if [[ "$first_line" == "// $relative_path" ]]; then
        return
    fi
    
    # Create a temporary file
    temp_file=$(mktemp)
    
    # Add comment to the first line
    echo "// $relative_path" | cat - "$file" > "$temp_file"
    
    # Replace original file
    mv "$temp_file" "$file"
    
    echo "Added path comment to $file"
}

# Find and process all .ts and .tsx files
find . -type f \( -name "*.ts" -o -name "*.tsx" \) | while read -r file; do
    # Exclude node_modules and .next directories
    if [[ "$file" != *"/node_modules/"* && "$file" != *"/.next/"* ]]; then
        add_filepath_comment "$file"
    fi
done

echo "Filepath comments added to TypeScript files."