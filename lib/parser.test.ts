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
<!-- replace-start: foo -->
content 2
<!-- replace-end: foo -->
`;
    expect(parse(markdown)).toMatchSnapshot();
  });

  it("parse - two replacer", () => {
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
    expect(parse(markdown)).toMatchSnapshot();
  });

  it("parse - two replace - same line", () => {
    const markdown = `
before
<!-- replace-start: foo -->
foo
<!-- replace-end: foo -->between<!-- replace-start: bar -->bar<!-- replace-end: bar -->after`;
    expect(parse(markdown)).toMatchSnapshot();
  });
});
