# Basic Usage

This guide covers the basic usage of the Read-It Stack plugin.

## Creating a Book Stack

To create a book stack, add a code block with the `read-it-stack` language identifier:

````markdown
```read-it-stack
```
````

This will display all books in your vault that have valid frontmatter.

## Filtering by Folder

Display books from a specific folder:

````markdown
```read-it-stack
folder: Books
```
````

You can also use subfolders:

````markdown
```read-it-stack
folder: Books/Fiction
```
````

## Filtering by Tag

Display books with a specific tag:

````markdown
```read-it-stack
tag: fiction
```
````

Or with the hash symbol:

````markdown
```read-it-stack
tag: #fiction
```
````

## Required Frontmatter

At minimum, each book note should have `pages` in its frontmatter:

```yaml
---
pages: 320
---
```

The plugin will use the filename as the title if no `title` field is provided.

## Recommended Frontmatter

For the best experience, include these fields:

```yaml
---
title: "Book Title"
author: "Author Name"
pages: 320
status: reading
---
```

## Next Steps

- [Filtering Options](filtering-options.md) - Learn about status filters and sorting
- [Custom Styling](custom-styling.md) - Customize colors and add spine images
- [Advanced Queries](advanced-queries.md) - Complex filtering examples
