---
title: Glossary
aliases:
  - Glossary
  - Terms
publish: true
tags:
  - glossary
  - index
---

# Glossary

Technical terms dictionary. Terms are automatically highlighted in documentation.

## How to add terms

In Obsidian, create a file in the `glossary/` folder with the following frontmatter:

```yaml
---
glossary: true
title: Term Name
definition: "Short definition for tooltip"
aliases:
  - alias1
  - alias2
tags:
  - glossary
---
```

Terms with `glossary: true` will be automatically recognized in documentation text and highlighted with a green dotted underline.
