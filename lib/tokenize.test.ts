import tokenize = require("./tokenize");

describe("tokenize", () => {
  it("tokenize - no replacer", () => {
    const markdown = `
content
`;
    expect(tokenize(markdown)).toMatchSnapshot();
  });

  it("tokenize - one replacer", () => {
    const markdown = `
content 1
<!-- start: foo -->
content 2
<!-- end: foo -->
`;
    expect(tokenize(markdown)).toMatchSnapshot();
  });

  it("tokenize - two replacer", () => {
    const markdown = `
content 1
<!-- start: foo -->
content 2
<!-- end: foo -->
content 3
<!-- start: bar -->
content 4
<!-- end: bar -->
content 5
`;
    expect(tokenize(markdown)).toMatchSnapshot();
  });

  it("tokenize - two replace - same line", () => {
    const markdown = `
before
<!-- start: foo -->
foo
<!-- end: foo -->between<!-- start: bar -->bar<!-- end: bar -->after`;
    expect(tokenize(markdown)).toMatchSnapshot();
  });
});
