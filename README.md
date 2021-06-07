# md-replacer

```js
const replacer = require("md-replacer");

const markdown = `
## Version
<!-- replace-start: version --><!-- replace-end: version -->
`;

replacer()
  .content(markdown)
  .replace("version", () => packageJSON.version)
  .build();
// ## Version
// <!-- replace-start: version -->1.0.0<!-- replace-end: version -->
//
```

```js
const replacer = require("md-replacer");

replacer()
  .content()
  .replace("version", () => {})
  .replace("license", () => {})
  .build();
```
