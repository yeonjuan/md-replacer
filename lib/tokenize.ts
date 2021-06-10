import type * as types from "./types";

class BaseToken implements types.Token {
  public type = 'unknown';
  constructor(
    public pos: types.Position,
    public raw: string
  ) {}
}

class ReplaceStartToken extends BaseToken implements types.ReplaceStartToken {
  public type = "replace-start" as const;
  constructor(public name: string, pos: types.Position, raw: string) {
    super(pos, raw);
  }
}

class ReplaceEndToken extends BaseToken implements types.ReplaceEndToken {
  public type = "replace-end" as const;
  constructor(public name: string, pos: types.Position, raw: string) {
    super(pos, raw);
  }
}

class OtherToken extends BaseToken implements types.OtherToken {
  public type = "other" as const;
  constructor(pos: types.Position, raw: string) {
    super(pos, raw);
  }
}

class Tokenizer {
  private static REPLACE_START_REGEX = /<!--\s*replace-start:([\s\S]*?)-->/;
  private static REPLACE_END_REGEX = /<!--\s*replace-end:([\s\S]*?)-->/;
  private index: number = 0;
  private tokens: types.AnyToken[] = [];
  private input: string = "";

  public tokenize(input: string): types.AnyToken[] {
    this.input = input;
    let remain: string = "";
    while ((remain = this.remain()).length) {
      let matched = null;
      let token: types.AnyToken | undefined;
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

  private pushToken(token: types.AnyToken) {
    this.tokens.push(token);
  }

  private finishOtherToken(raw: string): types.OtherToken {
    const start = this.cursor();
    this.eatText(raw);
    const end = this.cursor();
    return new OtherToken({ start, end }, raw);
  }

  private finishReplaceToken(
    type: types.ReplaceToken["type"],
    raw: string,
    name: string
  ): types.ReplaceToken {
    const start = this.cursor();
    this.eatText(raw);
    const end = this.cursor();
    const pos = { start, end };
    if (type === "replace-start") {
      return new ReplaceStartToken(name, pos, raw);
    }
    return new ReplaceEndToken(name, pos, raw);
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

function tokenize(input: string): types.AnyToken[] {
  return new Tokenizer().tokenize(input);
}
export = tokenize;
