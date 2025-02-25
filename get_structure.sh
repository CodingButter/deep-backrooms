#!/bin/bash

# Output file
OUTPUT_FILE="project_structure.json"

# Function to process each file
process_file() {
  local file="$1"
  local relative_path="${file#./}"
  local file_extension="${file##*.}"
  local file_name="${file##*/}"
  local file_language=""

  # Determine file language based on extension
  case "$file_extension" in
    "css") file_language="CSS" ;;
    "ts") file_language="TypeScript" ;;
    "tsx") file_language="TypeScript React" ;;
    "js"|"mjs") file_language="JavaScript" ;;
    "json") file_language="JSON" ;;
    "html") file_language="HTML" ;;
    "md") file_language="Markdown" ;;
    * ) file_language="" ;;
  esac

  # Exclude images, binary files, and YAML files
  if [[ "$file_extension" =~ ^(png|jpg|jpeg|gif|bmp|webp|ico|svg|yaml|yml)$ ]]; then
    echo "{\"name\": \"$file_name\", \"type\": \"file\", \"extension\": \"$file_extension\"}" >> "$OUTPUT_FILE"
  else
    # Compress and encode file content
    file_content=$(gzip -c "$file" | base64 -w 0)
    echo "{\"name\": \"$file_name\", \"type\": \"file\", \"extension\": \"$file_extension\", \"language\": \"$file_language\", \"content\": \"$file_content\"}" >> "$OUTPUT_FILE"
  fi
}

# Function to process each directory recursively
process_directory() {
  local directory="$1"
  local first_child=true

  # Exclude hidden directories and node_modules
  if [[ "$directory" == *"/node_modules"* || "$directory" == *"/.*" ]]; then
    return
  fi

  echo "{\"name\": \"${directory##*/}\", \"type\": \"directory\", \"children\": [" >> "$OUTPUT_FILE"
  
  for item in "$directory"/*; do
    if [ -d "$item" ] && [[ "$(basename "$item")" != .* ]] && [[ "$item" != *"node_modules"* ]]; then
      [ "$first_child" = false ] && echo "," >> "$OUTPUT_FILE"
      first_child=false
      process_directory "$item"
    elif [ -f "$item" ] && [[ "$(basename "$item")" != .* ]] && [[ "$item" != *.yaml ]] && [[ "$item" != *.yml ]]; then
      [ "$first_child" = false ] && echo "," >> "$OUTPUT_FILE"
      first_child=false
      process_file "$item"
    fi
  done
  
  echo "]}" >> "$OUTPUT_FILE"
}

# Start processing from the current directory
echo "{\"projectRoot\": " > "$OUTPUT_FILE"
process_directory "."
echo "}" >> "$OUTPUT_FILE"

echo "Project structure has been saved to $OUTPUT_FILE"
