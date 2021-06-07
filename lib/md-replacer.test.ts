import replacer = require("./md-replacer");

describe("md-replacer", () => {
  it("Inline", () => {
    const inline = "<!-- replace-start: foo -->aaa <!-- replace-end: foo -->";
    const result = replacer()
      .content(inline)
      .replace("foo", () => "foo")
      .build();
    expect(result).toBe(
      "<!-- replace-start: foo -->foo<!-- replace-end: foo -->"
    );
  });

  it("Multiline", () => {
    const inline = `
<!-- replace-start: foo -->
aaa
<!-- replace-end: foo -->`;
    const result = replacer()
      .content(inline)
      .replace("foo", () => "foo")
      .build();
    expect(result).toBe(`
<!-- replace-start: foo -->
foo
<!-- replace-end: foo -->`);
  });

  it("Mixed", () => {
    const inline = `
before
<!-- replace-start: foo -->
aaa
<!-- replace-end: foo -->between<!-- replace-start: bar -->aaa<!-- replace-end: bar -->after`;
    const result = replacer()
      .content(inline)
      .replace("foo", () => "foo")
      .replace("bar", () => "bar")
      .build();
    expect(result).toBe(`
before
<!-- replace-start: foo -->
foo
<!-- replace-end: foo -->between<!-- replace-start: bar -->bar<!-- replace-end: bar -->after`);
  });
});
