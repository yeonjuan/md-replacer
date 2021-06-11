import type * as types from "./types";
import nodeUtils = require("./node-utils");

class Context implements types.Context {
  private node: types.ReplacePartNode | null = null;

  public static create(root: types.RootNode): Context {
    return new Context(root);
  }
  constructor(private root: types.RootNode) {}

  public setNode(node: types.ReplacePartNode) {
    this.node = node;
  }

  public indent(input: string): string {
    if (!this.node) {
      throw new Error("Unexpected null node");
    }
    const indentPair = nodeUtils.getIndent(this.node, this.root);
    const lines = input.split("\n").map((line) => `${indentPair[0]}${line}`);
    return lines.join("\n");
  }
}

export = Context.create;
