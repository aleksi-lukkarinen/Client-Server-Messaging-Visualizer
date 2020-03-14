import StringUtils from "../src/StringUtils.js";




describe("Class StringUtils", () => {
  const su = new StringUtils();

  const combinations = [
    //  end,      start
    [   "AAA",    "start"],
    [   "A",      "start"],
    [   "AAA",    " "],
    [   "AAA",    ""],
  ];
    
  describe.each(combinations)(
        ".ensureThatEndsWith(..., \"%s\")",
        (end, start) => {

    test(`should append "${end}" to "${start}" to get "${start+end}"`, () => {
      expect(su.ensureThatEndsWith(start, end)).toBe(start + end);
    });

    test(`should not append "${end}" to "${start+end}" to get "${start+end+end}"`, () => {
      expect(su.ensureThatEndsWith(start + end, end)).toBe(start + end);
    });
  });

  test(`.ensureThatEndsWith("AAA") should return "AAAundefined"`, () => {
    expect(su.ensureThatEndsWith("AAA")).toBe("AAAundefined");
  });

});
