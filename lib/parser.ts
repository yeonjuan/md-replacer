import tokenize = require("./tokenize");
import { AnyToken, OtherToken, TextNode } from "./types";

class Parser {
  private inReplacePart = false;

  parse(input: string) {
    const tokens = tokenize(input);
    tokens.forEach(token => {

      switch(token.type) {
        case 'replace-start':
          this.inReplacePart = true;
          break;
        case 'replace-end':
          if (this.inReplacePart) {
            
          }
          break;
        case 'other':
          break;
      }
    });
  }

  toTextNode (token: AnyToken): TextNode {
    return {
      type: 'text',
      text: token.raw,
      pos: token.pos, 
    }
  }
}
