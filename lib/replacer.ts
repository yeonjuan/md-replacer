import Pipe = require("./pipe");
import createIndent = require("./create-indent");
import parse = require("./parser");
import nodes = require("./nodes");
import type * as types from "./types";

interface Context {
  indent: ReturnType<typeof createIndent>;
}

type ReplaceFunc = (ctx?: Context) => string;

class Replacer {
  private replacerMap: Record<string, ReplaceFunc> = {};
  constructor(private ast: types.RootNode) {}

  public replace(name: string, replaceFunc: ReplaceFunc): this {
    this.replacerMap[name] = replaceFunc;
    return this;
  }

  public build() {
    this.traverse(this.ast, (node) => {
      if (node.type === "replace-part") {
        const replacer = this.replacerMap[node.name];
        if (typeof replacer === "function") {
          const rets: string[] = [];
          const hasNewLine = node.children.some(
            (child) => child.text.indexOf("\n") !== -1
          );
          if (hasNewLine) {
            rets.push("\n");
          }
          rets.push(replacer());
          if (hasNewLine) {
            rets.push("\n");
          }
          node.children = [
            new nodes.TextNode(
              {
                start: node.start.pos.end,
                end: node.end.pos.start - 1,
              },
              rets.join("")
            ),
          ];
        }
      }
    });
    return this.ast.stringify();
  }

  private traverse(
    node: types.AnyNode | types.RootNode,
    visitor: (node: types.AnyNode | types.RootNode) => void
  ) {
    visitor(node);
    if (node.type === "root" || node.type === "replace-part") {
      node.children.forEach((child) => this.traverse(child, visitor));
    }
  }
}

export = function create(text: string): Replacer {
  const ast = parse(text);
  return new Replacer(ast);
};
