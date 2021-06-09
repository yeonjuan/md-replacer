type IndentType = "space" | "tab";

type IndentFunc = (content: string, options?: IndentOptions) => string;

type IndentOptions = {
  level: number;
  spaceOrTab: IndentType;
};

const INDENT_CHAR: Record<IndentType, string> = {
  tab: "\t",
  space: " ",
};

const DEFAULT_OPTIONS: IndentOptions = {
  level: 0,
  spaceOrTab: "space",
};

function repeat(char: string, n: number) {
  const chars = [];
  while (0 < n--) chars.push(char);
  return chars.join("");
}

function createIndent(indentStr: string): IndentFunc {
  return function indent(
    content: string,
    options: IndentOptions = DEFAULT_OPTIONS
  ) {
    const lines = content.split("\n");
    const newIndent = repeat(INDENT_CHAR[options.spaceOrTab], options.level);
    for (let i = 0; i < lines.length; i++) {
      lines[i] = `${indentStr}${newIndent}${lines[i]}`;
    }
    return lines.join("\n");
  };
}

export = createIndent;
