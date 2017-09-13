# eltrans

ELement TRANSformer - bulk modify HTML files with jQuery-like syntax

*WARNING: This tool is very work-in-progress, do not use on anything you haven't backed up!*

## Usage

```
  Usage: eltrans [options] <root> <find> [replacer...]

  Options:

    -h, --help  output usage information

```

## Examples

eg.
```bash

# add the class ".big-fig" to all <ul> elements in HTML files below the current directory
eltrans . 'ul' '$el.addClass("big-fig");'


# remove all style tags in HTML below the "src" directory
eltrans ./src 'style' '$el.remove()'

```

## Features

- [x] modify HTML by selectors
- [ ] Options needing commandline args
  - [ ] JS replacer patterns
  - [ ] dry run
  - [ ] quiet

