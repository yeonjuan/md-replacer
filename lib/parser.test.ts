import parse = require("./parser");

describe("parser", () => {
  it("parse - no replacer", () => {
    const markdown = `
content
`;
    expect(parse(markdown)).toMatchSnapshot();
  });

  it("parse - one replacer", () => {
    const markdown = `
content 1
<!-- start: foo -->
content 2
<!-- end: foo -->
`;
    expect(parse(markdown)).toMatchSnapshot();
  });

  it("parse - two replacer", () => {
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
    expect(parse(markdown)).toMatchSnapshot();
  });

  it("parse - two replace - same line", () => {
    const markdown = `
before
<!-- start: foo -->
foo
<!-- end: foo -->between<!-- start: bar -->bar<!-- end: bar -->after`;
    expect(parse(markdown)).toMatchSnapshot();
  });
});
