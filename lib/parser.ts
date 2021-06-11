import tokenize = require("./tokenize");
import createStack = require("./stack");
import nodes = require("./nodes");
import type * as types from "./types";

class Parser {
  private stack = createStack<types.AnyToken>();
  private root?: types.RootNode;

  private static toTextNode(token: types.AnyToken): types.TextNode {
    return new nodes.TextNode(token.pos, token.raw);
  }

  public parse(input: string): types.RootNode {
    const tokens = tokenize(input);
    this.root = new nodes.RootNode({ start: 0, end: input.length });
    tokens.forEach((token) => {
      switch (token.type) {
        case "replace-start":
          this.onReplaceStart(token);
          break;
        case "replace-end":
          this.onReplaceEnd(token);
          break;
        case "other":
          this.onOther(token);
          break;
        default:
          throw new Error("Unexpected token type");
      }
    });
    const tokensInStack = this.popTokensUntil(() =>
      this.stack.isEmpty()
    ).reverse();
    tokensInStack.forEach((tk) => {
      this.root && this.root.children.push(Parser.toTextNode(tk));
    });
    return this.root;
  }

  private onReplaceStart(token: types.ReplaceStartToken) {
    const tokens = this.popTokensUntil(() => this.stack.isEmpty()).reverse();
    if (this.root) {
      this.root.children.push(...tokens.map(Parser.toTextNode));
    }
    this.stack.push(token);
  }

  private onReplaceEnd(token: types.ReplaceEndToken) {
    const isReplaceStart = (
      top: types.AnyToken
    ): top is types.ReplaceStartToken =>
      top.type === "replace-start" && top.name === token.name;
    const tokens = this.popTokensUntil(isReplaceStart).reverse();
    const top = this.stack.top();
    const children: types.AnyNode[] = [];
    if (isReplaceStart(top)) {
      this.stack.pop();
      const replacePart = new nodes.ReplacePartNode(top, token, top.name);
      replacePart.children.push(...tokens.map(Parser.toTextNode));
      children.push(replacePart);
    } else {
      this.stack.pop();
      tokens.push(token);
      children.push(...tokens.map(Parser.toTextNode));
    }
    this.root && this.root.children.push(...children);
  }

  private onOther(token: types.OtherToken) {
    this.stack.push(token);
  }

  private popTokensUntil(
    predicator: (token: types.AnyToken) => boolean
  ): types.AnyToken[] {
    let top: types.AnyToken;
    const children: types.AnyToken[] = [];
    while (
      !this.stack.isEmpty() &&
      (top = this.stack.top()) &&
      !predicator(top)
    ) {
      children.push(top);
      this.stack.pop();
    }
    return children;
  }
}

function parse(input: string): types.RootNode {
  const parser = new Parser();
  return parser.parse(input);
}

export = parse;
