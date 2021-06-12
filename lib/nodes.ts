import type * as types from "./types";

const NODE_TYPES = {
  UNKNOWN: "unknown",
  ROOT: "root",
  TEXT: "text",
  REPLACE_PART: "replace-part",
} as const;

abstract class BaseNode implements types.BaseNode {
  public type = "";
  constructor(public pos: types.Position) {}

  abstract stringify(parent?: types.AnyNode | types.RootNode): string;
}

class RootNode extends BaseNode implements types.RootNode {
  public readonly type = NODE_TYPES.ROOT;
  public readonly children: types.RootNode["children"] = [];
  constructor(pos: types.Position) {
    super(pos);
  }

  stringify() {
    const strings: string[] = [];
    this.children.forEach((child) => {
      strings.push(child.stringify(this));
    });
    return strings.join("");
  }
}

class TextNode extends BaseNode implements types.TextNode {
  public readonly type = NODE_TYPES.TEXT;
  constructor(pos: types.Position, public text: string) {
    super(pos);
  }

  stringify(parent: types.AnyNode | types.RootNode) {
    return this.text;
  }
}

class ReplacePartNode extends BaseNode implements types.ReplacePartNode {
  public readonly type = NODE_TYPES.REPLACE_PART;
  public readonly children: types.ReplacePartNode["children"] = [];
  constructor(
    public start: types.ReplaceStartToken,
    public end: types.ReplaceEndToken,
    public name: string
  ) {
    super({
      start: start.pos.start,
      end: end.pos.end,
    });
  }

  stringify() {
    const strings: string[] = [];
    strings.push(this.start.raw);
    this.children.forEach((child) => {
      strings.push(child.stringify(this));
    });
    strings.push(this.end.raw);
    return strings.join("");
  }
}

export = {
  BaseNode,
  RootNode,
  TextNode,
  ReplacePartNode,
  NODE_TYPES,
};
