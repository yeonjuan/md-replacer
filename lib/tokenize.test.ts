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
<!-- replace-start: foo -->
content 2
<!-- replace-end: foo -->
`;
    expect(tokenize(markdown)).toMatchSnapshot();
  });

  it("tokenize - two replacer", () => {
    const markdown = `
content 1
<!-- replace-start: foo -->
content 2
<!-- replace-end: foo -->
content 3
<!-- replace-start: bar -->
content 4
<!-- replace-end: bar -->
content 5
`;
    expect(tokenize(markdown)).toMatchSnapshot();
  });
});
