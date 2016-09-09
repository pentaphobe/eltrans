# eltrans

ELement TRANSformer - bulk modify HTML files with jQuery-like syntax

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
eltrans . 'ul' '$el.addClass("big-fig");

# remove all style tags in HTML below the "src" directory
eltrans ./src 'style' '$el.remove()'

```

