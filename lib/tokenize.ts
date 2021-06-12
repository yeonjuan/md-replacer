import type * as types from "./types";
import tokens = require("./tokens");

class Tokenizer {
  private static REPLACE_START_REGEX =
    /^<!--[^\S\r\n]*start:([\s^\S\r\n]*?)-->/;
  private static REPLACE_END_REGEX = /^<!--[^\S\r\n]*end:([\s^\S\r\n]*?)-->/;
  private cursorIndex: number = 0;
  private tokens: types.AnyToken[] = [];
  private input: string = "";
  public tokenize(input: string): types.AnyToken[] {
    this.input = input;

    while (!this.isEOF()) {
      let matched = null;
      const remain = this.remain();
      let token: types.AnyToken | undefined;

      if ((matched = remain.match(Tokenizer.REPLACE_START_REGEX))) {
        token = this.tokenizeReplaceStart(matched);
      } else if ((matched = remain.match(Tokenizer.REPLACE_END_REGEX))) {
        token = this.tokenizeReplaceEnd(matched);
      }

      const curChar = this.currentChar();

      if (!token && curChar.length) {
        const last = this.lastToken();
        const pos = this.eatText(curChar);
        if (last && last.type === "other") {
          last.raw += curChar;
          last.pos.end = pos.end;
        } else {
          token = new tokens.OtherToken(pos, curChar);
        }
      }

      if (token) {
        this.pushToken(token);
      }
    }

    return this.tokens;
  }

  private tokenizeReplaceStart(
    matched: NonNullable<ReturnType<String["match"]>>
  ) {
    const [replaceStart, name] = matched;
    const pos = this.eatText(replaceStart);
    return new tokens.ReplaceStartToken(name.trim(), pos, replaceStart);
  }

  private tokenizeReplaceEnd(
    matched: NonNullable<ReturnType<String["match"]>>
  ) {
    const [replaceEnd, name] = matched;
    const pos = this.eatText(replaceEnd);
    return new tokens.ReplaceEndToken(name.trim(), pos, replaceEnd);
  }

  private pushToken(token: types.AnyToken) {
    this.tokens.push(token);
  }

  private lastToken() {
    return this.tokens[this.tokens.length - 1];
  }

  private cursor(): number {
    return this.cursorIndex;
  }

  private isEOF() {
    return this.input.length <= this.cursor();
  }

  private eatText(text: string): types.Position {
    const start = this.cursor();
    this.cursorIndex += text.length;
    const end = this.cursor();
    return { start, end };
  }

  private currentChar() {
    return this.input[this.cursorIndex];
  }

  private nextChar() {
    return this.input[this.cursor() + 1];
  }

  private remain(): string {
    return this.input.slice(this.cursor());
  }
}

function tokenize(input: string): types.AnyToken[] {
  return new Tokenizer().tokenize(input);
}

export = tokenize;
