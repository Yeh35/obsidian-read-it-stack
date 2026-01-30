# Read-It Stack Sample Vault

This is a sample Obsidian vault for testing and demonstrating the **Read-It Stack** plugin.

## How to Use

1. Open this folder as a vault in Obsidian
2. Install the Read-It Stack plugin (or copy the built plugin files to `.obsidian/plugins/read-it-stack/`)
3. Enable the plugin in Settings > Community Plugins
4. Open `Reading Dashboard.md` to see the plugin in action

## Folder Structure

```
sample-vault/
├── Books/
│   ├── Fiction/          # 6 fiction books (Harry Potter, LOTR, etc.)
│   └── Technical/        # 6 technical books (Clean Code, etc.)
├── assets/
│   └── spines/           # Custom spine images (optional)
├── Reading Dashboard.md  # Showcase note with multiple stacks
└── README.md            # This file
```

## Sample Books

### Fiction (6 books)
| Title | Status | Pages |
|-------|--------|-------|
| Harry Potter and the Sorcerer's Stone | done | 309 |
| Harry Potter and the Chamber of Secrets | done | 341 |
| Harry Potter and the Prisoner of Azkaban | reading | 435 |
| The Lord of the Rings: The Fellowship | done | 423 |
| The Little Prince | done | 96 |
| The Hobbit | to-read | 310 |

### Technical (6 books)
| Title | Status | Pages |
|-------|--------|-------|
| Clean Code | done | 464 |
| Design Patterns | reading | 395 |
| The Pragmatic Programmer | done | 352 |
| Refactoring | to-read | 448 |
| Code Complete | done | 960 |
| JavaScript: The Good Parts | done | 176 |

## Frontmatter Fields Used

Each book note contains frontmatter with these fields:

```yaml
---
title: "Book Title"
author: "Author Name"
pages: 320
status: done          # reading | done | to-read | abandoned
color: "#4CAF50"      # Custom spine color (optional)
rating: 5             # 1-5 rating (optional)
date_finished: 2024-01-15  # Completion date (optional)
tags:
  - book
  - fiction
---
```

## Adding Custom Spine Images

To add custom spine images:

1. Place image files in `assets/spines/`
2. Add to book frontmatter:
   ```yaml
   spine: "[[assets/spines/my-book.png]]"
   ```

## Questions?

See the main plugin documentation for more details.
