import type { AnyToken, OtherToken, ReplaceToken } from "./types";

class Tokenizer {
  private static REPLACE_START_REGEX = /<!--\s*replace-start:([\s\S]*?)-->/;
  private static REPLACE_END_REGEX = /<!--\s*replace-end:([\s\S]*?)-->/;
  private index: number = 0;
  private tokens: AnyToken[] = [];
  private input: string = "";

  public tokenize(input: string): AnyToken[] {
    this.input = input;
    let remain: string = "";
    while ((remain = this.remain()).length) {
      let matched = null;
      let token: AnyToken | undefined;
      let end: number | undefined;
      if ((matched = remain.match(Tokenizer.REPLACE_START_REGEX))) {
        const [replaceStart, name] = matched;
        if (matched.index === 0) {
          token = this.finishReplaceToken(
            "replace-start",
            replaceStart,
            name.trim()
          );
        } else {
          end = matched.index;
        }
      } else if ((matched = remain.match(Tokenizer.REPLACE_END_REGEX))) {
        const [replaceEnd, name] = matched;
        if (matched.index === 0) {
          token = this.finishReplaceToken(
            "replace-end",
            replaceEnd,
            name.trim()
          );
        } else {
          end = matched.index;
        }
      }
      if (!token) {
        token = this.finishOtherToken(this.remain().slice(0, end));
      }
      this.pushToken(token);
    }
    return this.tokens;
  }

  private pushToken(token: AnyToken) {
    this.tokens.push(token);
  }

  private finishOtherToken(raw: string): OtherToken {
    const start = this.cursor();
    this.eatText(raw);
    const end = this.cursor();
    const token: OtherToken = {
      type: "other",
      raw,
      pos: {
        start,
        end,
      },
    };
    return token;
  }

  private finishReplaceToken(
    type: ReplaceToken["type"],
    raw: string,
    name: string
  ): ReplaceToken {
    const start = this.cursor();
    this.eatText(raw);
    const end = this.cursor();
    const token: ReplaceToken = {
      type,
      raw,
      name,
      pos: {
        start: start,
        end: end,
      },
    };
    return token;
  }

  private cursor(): number {
    return this.index;
  }

  private eatText(text: string): void {
    this.index += text.length;
    this.input = this.input.slice(text.length);
  }

  private remain(): string {
    return this.input;
  }
}

function tokenize(input: string): AnyToken[] {
  return new Tokenizer().tokenize(input);
}
export = tokenize;
