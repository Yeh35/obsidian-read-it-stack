# Advanced Queries

This guide shows advanced usage patterns and complex queries for Read-It Stack.

## Dashboard Layouts

### Complete Reading Dashboard

Create a comprehensive reading dashboard with multiple stacks:

````markdown
# My Reading Dashboard

## Currently Reading
```read-it-stack
status: reading
sortBy: title
```

## Recently Finished
```read-it-stack
status: done
sortBy: dateFinished
sortOrder: desc
limit: 5
```

## To Be Read
```read-it-stack
status: to-read
sortBy: pages
sortOrder: asc
```
````

### Genre-Based Dashboard

````markdown
# My Library

## Fiction
```read-it-stack
folder: Books/Fiction
sortBy: rating
sortOrder: desc
```

## Technical
```read-it-stack
folder: Books/Technical
sortBy: title
```

## Non-Fiction
```read-it-stack
folder: Books/Non-Fiction
sortBy: dateFinished
sortOrder: desc
```
````

## Series Tracking

Track books in a series using tags:

````markdown
# Harry Potter Series

```read-it-stack
tag: harry-potter
sortBy: pages
sortOrder: asc
```
````

Each book in the series has the tag:

```yaml
---
title: "Harry Potter and the Sorcerer's Stone"
tags:
  - harry-potter
  - fiction
---
```

## Year-Based Views

### Books Read This Year

Use folder organization or tags to track yearly reading:

````markdown
```read-it-stack
folder: Books/2024
status: done
sortBy: dateFinished
```
````

## Longest/Shortest Books

### Longest Books (Reading Challenge)

````markdown
```read-it-stack
status: done
sortBy: pages
sortOrder: desc
limit: 5
```
````

### Quick Reads (Short Books)

````markdown
```read-it-stack
sortBy: pages
sortOrder: asc
limit: 5
```
````

## Author Collections

Track all books by a specific author using tags:

````markdown
# J.R.R. Tolkien Collection

```read-it-stack
tag: tolkien
sortBy: pages
```
````

## Top Rated Books

````markdown
# Best Books I've Read

```read-it-stack
status: done
sortBy: rating
sortOrder: desc
limit: 10
```
````

## Custom Frontmatter Fields

You can use any custom frontmatter field in titleFormat:

```yaml
---
title: "My Book"
pages: 300
publisher: "Penguin Books"
isbn: "978-0-123456-78-9"
---
```

Then reference in your query:

````markdown
```read-it-stack
titleFormat: {{title}} ({{publisher}})
```
````

## Multiple Views of Same Collection

You can create multiple views of the same books:

````markdown
# Technical Books

## By Title
```read-it-stack
folder: Books/Technical
sortBy: title
```

## By Page Count
```read-it-stack
folder: Books/Technical
sortBy: pages
sortOrder: desc
```

## By Rating
```read-it-stack
folder: Books/Technical
sortBy: rating
sortOrder: desc
```
````

## Tips & Best Practices

1. **Consistent Tagging**: Use consistent tags across all books
2. **Folder Organization**: Organize by genre or category
3. **Complete Frontmatter**: Fill in all relevant fields
4. **Date Format**: Use YYYY-MM-DD for dates
5. **Status Updates**: Keep status fields current

## Troubleshooting

### Books Not Appearing

- Check that `pages` field exists in frontmatter
- Verify folder path is correct
- Check status value matches supported values

### Wrong Sort Order

- Use `sortOrder: desc` for newest/highest first
- Use `sortOrder: asc` for oldest/lowest first

### Title Not Showing

- Add `title` field to frontmatter
- Check titleFormat template syntax
