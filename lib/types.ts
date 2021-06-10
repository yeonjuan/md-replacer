export interface Position {
  start: number;
  end: number;
}

export interface Token {
  type: string;
  pos: Position;
  raw: string;
}

export interface ReplaceStartToken extends Token {
  type: "replace-start";
  name: string;
}

export interface ReplaceEndToken extends Token {
  type: "replace-end";
  name: string;
}

export type ReplaceToken = ReplaceStartToken | ReplaceEndToken;

export interface OtherToken extends Token {
  type: "other";
}

export type AnyToken = OtherToken | ReplaceStartToken | ReplaceEndToken;

export interface BaseNode {
  type: string;
  pos: Position;
}

export interface TextNode extends BaseNode {
  type: "text";
  text: string;
}

export interface ReplacePartNode extends BaseNode {
  type: "replace-part";
  start: ReplaceStartToken;
  end: ReplaceEndToken;
  children: TextNode[];
}

export interface RootNode extends BaseNode {
  type: "root";
  children: (TextNode | ReplacePartNode)[];
}

export type AnyNode = TextNode | ReplacePartNode | RootNode;
