import type * as types from "./types";

const TOKEN_TYPES = {
  UNKNOWN: "unknown",
  REPLACE_START: "replace-start",
  REPLACE_END: "replace-end",
  OTHER: "other",
} as const;

class BaseToken implements types.Token {
  constructor(public pos: types.Position, public raw: string) {}
}

class ReplaceStartToken extends BaseToken implements types.ReplaceStartToken {
  public type = TOKEN_TYPES.REPLACE_START;
  constructor(public name: string, pos: types.Position, raw: string) {
    super(pos, raw);
  }
}

class ReplaceEndToken extends BaseToken implements types.ReplaceEndToken {
  public type = TOKEN_TYPES.REPLACE_END;
  constructor(public name: string, pos: types.Position, raw: string) {
    super(pos, raw);
  }
}

class OtherToken extends BaseToken implements types.OtherToken {
  public type = TOKEN_TYPES.OTHER;
  constructor(pos: types.Position, raw: string) {
    super(pos, raw);
  }
}

export = {
  BaseToken,
  ReplaceStartToken,
  ReplaceEndToken,
  OtherToken,
  TOKEN_TYPES,
};
