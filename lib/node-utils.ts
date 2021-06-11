import type * as types from "./types";

function getLastLineIndent(node: types.TextNode) {
  const lines = node.text.split("\n");
  const lastLine = lines[lines.length - 1];
  if (lastLine.trim().length === 0) {
    return lastLine;
  }
  return "";
}

function getNodeBefore(
  node: types.ReplacePartNode,
  parent: types.RootNode | types.ReplacePartNode
) {
  for (let i = 1; i < parent.children.length; i++) {
    const before = parent.children[i - 1];
    const current = parent.children[i];
    if (current === node) {
      return before;
    }
  }
  return null;
}

function getIndent(
  node: types.ReplacePartNode,
  parent: types.RootNode | types.ReplacePartNode
): [startIndent: string, endIndent: string] {
  const beforeNode = getNodeBefore(node, parent);
  let indentPair: [string, string] = ["", ""];
  if (beforeNode && beforeNode.type === "text") {
    indentPair[0] = getLastLineIndent(beforeNode);
  }
  if (node) {
    const lastNode = node.children[node.children.length - 1];
    if (lastNode && lastNode.type === "text") {
      indentPair[0] = getLastLineIndent(lastNode);
    }
  }

  return indentPair;
}

export = {
  getIndent,
  getLastLineIndent,
};
