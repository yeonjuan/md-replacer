import Pipe = require("./pipe");
import createIndent = require("./create-indent");

interface Context {
  indent: ReturnType<typeof createIndent>;
}

type ReplaceFunc = (ctx: Context) => string;

class Replacer {
  static START_INDENT_REGEX = /([ \t]*)<!--\s*replace-start:[\s\S]*?-->.*/;
  static END_INDENT_REGEX = /([ \t]*)<!--\s*replace-end:[\s\S]*?-->.*/;
  static INNER_CONTENT_REGEX =
    /[ \t]*?<!--\s*replace-start:([\s\S]*?)-->([\s\S]*?)<!--\s*replace-end:([\s\S]*?)-->/g;

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

  private createContext(startCommentLine: string): Context {
    const indentStr = startCommentLine.replace(
      Replacer.START_INDENT_REGEX,
      "$1"
    );
    return {
      indent: createIndent(indentStr),
    };
  }

  private replaceCommentPart(
    text: string,
    name: string,
    replaceFunc: ReplaceFunc
  ): string {
    let replaced = text;
    const allMatched = text.matchAll(Replacer.INNER_CONTENT_REGEX);
    for (let [matched, startName, innerContent, endName] of allMatched) {
      let matchedName = null;
      const startTrimmed = startName.trim();
      const endTrimmed = endName.trim();
      if (startTrimmed === endTrimmed && startTrimmed === name) {
        matchedName = name;
      }
      if (matchedName) {
        const context = this.createContext(matched);
        const endIndentStr = matched.replace(Replacer.END_INDENT_REGEX, "$1");
        const isInline = innerContent.indexOf("\n") === -1;
        const newLineOrEmpty = isInline ? "" : "\n";
        replaced = replaced.replace(
          matched,
          matched.replace(
            innerContent,
            `${newLineOrEmpty}${replaceFunc(context)}${newLineOrEmpty}`
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
// 아이디어
// 파싱을 먼저 한다
/**
 * {
 *   name: string
 *   startComment: {
 *     start: number,
 *     end: number,
 *   },
 *   endComment {
 *     start: number,
 *     end: number
 *   },
 *   lines: string[]
 * }
 */
