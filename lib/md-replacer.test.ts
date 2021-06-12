import replacer = require("./md-replacer");

describe("md-replacer", () => {
  it("Inline", () => {
    const INPUT = "<!-- start: foo -->aaa <!-- end: foo -->";
    const result = replacer()
      .content(INPUT)
      .replace("foo", () => "foo")
      .build();
    expect(result).toMatchSnapshot();
  });

  it("Multiline", () => {
    const INPUT = `
<!-- start: foo -->
aaa
<!-- end: foo -->`;
    const result = replacer()
      .content(INPUT)
      .replace("foo", () => "foo")
      .build();
    expect(result).toMatchSnapshot();
  });

  it("Mixed", () => {
    const INPUT = `
before
<!-- start: foo -->
aaa
<!-- end: foo -->between<!-- start: bar -->aaa<!-- end: bar -->after`;
    const result = replacer()
      .content(INPUT)
      .replace("foo", () => "foo")
      .replace("bar", () => "bar")
      .build();
    expect(result).toMatchSnapshot();
  });

  it("replace", () => {
    const INPUT = `
before
  <!-- start: foo -->
  aaa
  <!-- end: foo -->
ebd`;
    const result = replacer()
      .content(INPUT)
      .replace("foo", ({ indent }) => indent("foo"))
      .build();
    expect(result).toMatchSnapshot();
  });
});
