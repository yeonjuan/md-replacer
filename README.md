<!-- start:name -->

# md-replacer

<!-- end:name -->

## Installation

<!-- start: install -->

```bash
$ npm install -D md-replacer
```

<!-- end: install -->

## Usage

- README.md

```markdown
<!-- start: name -->

<!-- start: name -->
```

- example.js

```js
const replacer = require("md-replacer");

const packageJSON = read("./package.json");
const README = read("./README.md");

const output = replacer()
  .content(README)
  .replace("name", () => `# ${name}`)
  .build();

write("./README.md", output);
```

- README.md

```markdown
<!-- start: name -->

# PROJECT

<!-- start: name -->
```

## License

<!-- start: license -->

- MIT
<!-- end: license -->
