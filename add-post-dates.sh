#!/bin/bash
# Add creation dates to post frontmatter from git history

for file in pages/posts/*.njk; do
  # Get the date from git (format: YYYY-MM-DD)
  git_date=$(git log --follow --diff-filter=A --format='%ai' -- "$file" | tail -1)

  if [ -z "$git_date" ]; then
    echo "Warning: Could not find git date for $file"
    continue
  fi

  # Extract just the date part (YYYY-MM-DD)
  date_only=$(echo "$git_date" | cut -d' ' -f1)

  # Check if date field already exists
  if grep -q "^date:" "$file"; then
    # Update existing date field
    sed -i "s/^date:.*/date: $date_only/" "$file"
    echo "Updated date in $(basename "$file"): $date_only"
  else
    sed -i "/^tags:/a date: $date_only" "$file"
    echo "Added date to $(basename "$file"): $date_only"
  fi
done

echo ""
echo "Done! All post dates have been added/updated."
