import replacer = require("./md-replacer");

describe("md-replacer", () => {
  it("Inline", () => {
    const INPUT = "<!-- replace-start: foo -->aaa <!-- replace-end: foo -->";
    const OUTPUT = "<!-- replace-start: foo -->foo<!-- replace-end: foo -->";

    const result = replacer()
      .content(INPUT)
      .replace("foo", () => "foo")
      .build();

    expect(result).toBe(OUTPUT);
  });

  it("Multiline", () => {
    const INPUT = `
<!-- replace-start: foo -->
aaa
<!-- replace-end: foo -->`;

    const OUTPUT = `
<!-- replace-start: foo -->
foo
<!-- replace-end: foo -->`;

    const result = replacer()
      .content(INPUT)
      .replace("foo", () => "foo")
      .build();

    expect(result).toBe(OUTPUT);
  });

  it("Mixed", () => {
    const INPUT = `
before
<!-- replace-start: foo -->
aaa
<!-- replace-end: foo -->between<!-- replace-start: bar -->aaa<!-- replace-end: bar -->after`;

    const OUTPUT = `
before
<!-- replace-start: foo -->
foo
<!-- replace-end: foo -->between<!-- replace-start: bar -->bar<!-- replace-end: bar -->after`;

    const result = replacer()
      .content(INPUT)
      .replace("foo", () => "foo")
      .replace("bar", () => "bar")
      .build();

    expect(result).toBe(OUTPUT);
  });

  it("Indent:space", () => {
    const INPUT = `
    <!-- replace-start: foo -->
    <!-- replace-end: foo -->`;

    const OUTPUT = `
    <!-- replace-start: foo -->
    foo
    <!-- replace-end: foo -->`;

    const result = replacer()
      .content(INPUT)
      .replace("foo", ({ indent }) => indent("foo"))
      .build();

    expect(result).toBe(OUTPUT);
  });
});
