import replacer = require("./md-replacer");

describe("md-replacer", () => {
  it("Inline", () => {
    const INPUT = "<!-- replace-start: foo -->aaa <!-- replace-end: foo -->";
    const result = replacer()
      .content(INPUT)
      .replace("foo", () => "foo")
      .build();
    expect(result).toMatchSnapshot();
  });

  it("Multiline", () => {
    const INPUT = `
<!-- replace-start: foo -->
aaa
<!-- replace-end: foo -->`;
    const result = replacer()
      .content(INPUT)
      .replace("foo", () => "foo")
      .build();
    expect(result).toMatchSnapshot();
  });

  it("Mixed", () => {
    const INPUT = `
before
<!-- replace-start: foo -->
aaa
<!-- replace-end: foo -->between<!-- replace-start: bar -->aaa<!-- replace-end: bar -->after`;
    const result = replacer()
      .content(INPUT)
      .replace("foo", () => "foo")
      .replace("bar", () => "bar")
      .build();
    expect(result).toMatchSnapshot();
  });
});
