import mdReplacer = require("../lib");
import fs = require("fs");
import path = require("path");

const readme = fs.readFileSync("./README.md", "utf-8");
const packageJSON = JSON.parse(fs.readFileSync("./package.json", "utf-8"));

const output = mdReplacer()
  .content(readme)
  .replace("name", () => "# " + packageJSON.name)
  .replace(
    "install",
    () => `\`\`\`bash
$ npm install -D ${packageJSON.name}
\`\`\``
  )
  .replace("license", () => `- ${packageJSON.license}`)
  .build();

fs.writeFileSync("./README.md", output, { encoding: "utf-8" });
