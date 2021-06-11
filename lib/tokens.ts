import type * as types from "./types";

class BaseToken implements types.Token {
  public type = "unknown";
  constructor(public pos: types.Position, public raw: string) {}
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

export = {
  BaseToken,
  ReplaceStartToken,
  ReplaceEndToken,
  OtherToken,
};
