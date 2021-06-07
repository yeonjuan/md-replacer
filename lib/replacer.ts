import Pipe = require("./pipe");

type ReplaceFunc = () => string;

class Replacer {
  static REGEX =
    /<!--\s*replace-start:([\s\S]*?)-->([\s\S]*?)<!--\s*replace-end:([\s\S]*?)-->/g;
  private pipe = new Pipe<(input: string) => string>();
  constructor(private text: string) {}

  public replace(name: string, replaceFunc: ReplaceFunc): this {
    this.pipe.push((input) =>
      this.replaceCommentPart(input, name, replaceFunc)
    );
    return this;
  }

  public build(): string {
    const pipeline = this.pipe.pipeline();
    return pipeline(this.text);
  }

  private replaceCommentPart(
    text: string,
    name: string,
    replaceFunc: ReplaceFunc
  ): string {
    let replaced = text;
    const allMatched = text.matchAll(Replacer.REGEX);
    for (let [matched, startName, innerContent, endName] of allMatched) {
      let matchedName = null;
      const startTrimmed = startName.trim();
      const endTrimmed = endName.trim();
      if (startTrimmed === endTrimmed && startTrimmed === name) {
        matchedName = name;
      }
      if (matchedName) {
        const isInline = innerContent.indexOf("\n") === -1;
        const newLineOrEmpty = isInline ? "" : "\n";
        replaced = replaced.replace(
          matched,
          matched.replace(
            innerContent,
            `${newLineOrEmpty}${replaceFunc()}${newLineOrEmpty}`
          )
        );
      }
    }
    return replaced;
  }
}

export = function create(text: string): Replacer {
  return new Replacer(text);
};
