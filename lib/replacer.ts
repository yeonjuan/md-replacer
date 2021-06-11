import createIndent = require("./create-indent");
import parse = require("./parser");
import nodes = require("./nodes");
import createContext = require("./context");
import type * as types from "./types";
import nodeUtils = require("./node-utils");

interface ReplacerContext {
  indent: (input: string) => string;
}

type ReplaceFunc = (ctx: ReplacerContext) => string;

class Replacer {
  private replacerMap: Record<string, ReplaceFunc> = {};
  private context: types.Context;
  constructor(private ast: types.RootNode) {
    this.context = createContext(ast);
  }

  public replace(name: string, replaceFunc: ReplaceFunc): this {
    this.replacerMap[name] = replaceFunc;
    return this;
  }

  public build() {
    this.traverse(this.ast, (node) => {
      if (node.type === "replace-part") {
        const replacer = this.replacerMap[node.name];
        if (typeof replacer === "function") {
          this.context.setNode(node);
          const rets: string[] = [];
          let endIndent = "";
          const hasNewLine = node.children.some(
            (child) => child.text.indexOf("\n") !== -1
          );
          if (hasNewLine) {
            if (node.children.length) {
              endIndent = nodeUtils.getLastLineIndent(
                node.children[node.children.length - 1]
              );
            }
            rets.push("\n");
          }
          rets.push(
            replacer({
              indent: this.context.indent.bind(this.context),
            })
          );
          if (hasNewLine) {
            rets.push("\n");
            rets.push(endIndent);
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
