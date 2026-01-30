# Custom Styling

This guide covers how to customize the appearance of your book spines.

## Custom Colors

### Using Named Colors

Add a `color` field to your book's frontmatter:

```yaml
---
title: "My Book"
pages: 300
color: gold
---
```

Supported named colors:
- `red`, `blue`, `green`, `yellow`, `orange`
- `purple`, `pink`, `brown`, `gray`, `grey`
- `black`, `white`, `gold`, `navy`, `teal`, `maroon`

### Using Hex Colors

You can also use hex color codes:

```yaml
---
title: "My Book"
pages: 300
color: "#4CAF50"
---
```

Or without the hash:

```yaml
color: "4CAF50"
```

## Custom Spine Images

### Using Vault Images

Reference images in your vault:

```yaml
---
title: "My Book"
pages: 300
spine: "[[assets/spines/my-book.png]]"
---
```

### Using External URLs

```yaml
---
title: "My Book"
pages: 300
spine: "https://example.com/spine-image.png"
---
```

### Using Markdown Image Syntax

```yaml
---
title: "My Book"
pages: 300
spine: "![](assets/spines/my-book.png)"
---
```

### Image Recommendations

- **Aspect Ratio**: Tall and narrow (like a real book spine)
- **Recommended Size**: 100-200px wide, 300-600px tall
- **Format**: PNG or JPG

## Custom Title Format

Use the `titleFormat` option to customize how titles appear:

### Default (Title Only)

````markdown
```read-it-stack
titleFormat: {{title}}
```
````

### Title with Author

````markdown
```read-it-stack
titleFormat: {{title}} - {{author}}
```
````

### Title with Page Count

````markdown
```read-it-stack
titleFormat: {{title}} ({{pages}}p)
```
````

### Available Template Variables

| Variable | Description |
|----------|-------------|
| `{{title}}` | Book title |
| `{{author}}` | Author name |
| `{{pages}}` | Page count |
| `{{rating}}` | Rating (1-5) |
| `{{status}}` | Reading status |
| `{{filename}}` | Note filename |
| `{{dateFinished}}` | Completion date |
| `{{tags}}` | Tags |

You can also use any custom frontmatter field: `{{my_custom_field}}`

## Plugin Settings

Additional styling can be configured in the plugin settings:

- **Spine Width**: 100-400px
- **Border Radius**: 0-20px
- **Font Family**: Various options including system fonts
- **Font Size**: 8-18px
- **Show Page Count**: Toggle page count display

## Next Steps

- [Advanced Queries](advanced-queries.md) - Complex filtering examples
