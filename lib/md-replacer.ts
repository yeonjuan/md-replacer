import fs = require("fs");
import replacer = require("./replacer");

type Replacer = ReturnType<typeof replacer>;

class MDReplacer {
  private constructor() {}

  public static create() {
    return new MDReplacer();
  }

  content(text: string): Replacer {
    return replacer(text);
  }
}

export = MDReplacer.create;
