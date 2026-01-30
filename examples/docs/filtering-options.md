# Filtering & Sorting Options

This guide covers all filtering and sorting options available in Read-It Stack.

## Status Filtering

Filter books by their reading status:

### Currently Reading

````markdown
```read-it-stack
status: reading
```
````

### Completed Books

````markdown
```read-it-stack
status: done
```
````

### Want to Read

````markdown
```read-it-stack
status: to-read
```
````

### Abandoned Books

````markdown
```read-it-stack
status: abandoned
```
````

### Multiple Statuses

````markdown
```read-it-stack
status: reading, done
```
````

## Supported Status Aliases

The plugin recognizes these status values:

| Status | Aliases |
|--------|---------|
| `reading` | "reading", "in progress", "in-progress" |
| `done` | "done", "finished", "complete", "completed", "read" |
| `to-read` | "to-read", "to read", "want to read", "tbr" |
| `abandoned` | "abandoned", "dnf" |

## Sorting Options

### Sort by Title (Alphabetical)

````markdown
```read-it-stack
sortBy: title
```
````

### Sort by Page Count

````markdown
```read-it-stack
sortBy: pages
sortOrder: desc
```
````

### Sort by Completion Date

````markdown
```read-it-stack
status: done
sortBy: dateFinished
sortOrder: desc
```
````

### Sort by Rating

````markdown
```read-it-stack
sortBy: rating
sortOrder: desc
```
````

## Sort Order

- `asc` - Ascending (A-Z, smallest first, oldest first)
- `desc` - Descending (Z-A, largest first, newest first)

Default is `asc`.

## Limiting Results

Show only the top N books:

````markdown
```read-it-stack
status: done
sortBy: dateFinished
sortOrder: desc
limit: 5
```
````

## Combining Options

You can combine multiple options:

````markdown
```read-it-stack
folder: Books/Fiction
status: done
sortBy: rating
sortOrder: desc
limit: 10
```
````

## Next Steps

- [Custom Styling](custom-styling.md) - Customize colors and add spine images
- [Advanced Queries](advanced-queries.md) - Complex filtering examples
