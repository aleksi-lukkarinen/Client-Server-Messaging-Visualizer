import StringUtils from "../src/StringUtils.js";




describe("Class StringUtils", () => {
  const su = new StringUtils();

  const ensureThatEndsWithCombinations = [
    //  end,      start
    [   "AAA",    "start"],
    [   "A",      "start"],
    [   "AAA",    " "],
    [   "AAA",    ""],
  ];
    
  describe.each(ensureThatEndsWithCombinations)(
        ".ensureThatEndsWith(..., ...)",
        (end, start) => {

    test(`should append "${end}" to "${start}" to get "${start+end}"`, () => {
      expect(su.ensureThatEndsWith(start, end)).toEqual(start + end);
    });

    test(`should not append "${end}" to "${start+end}" to get "${start+end+end}"`, () => {
      expect(su.ensureThatEndsWith(start + end, end)).toEqual(start + end);
    });
  });

  test(`.ensureThatEndsWith("start") should return "startundefined"`, () => {
    expect(su.ensureThatEndsWith("start")).toEqual("startundefined");
  });

  test(`.ensureThatEndsWithPeriod("start") should return "start."`, () => {
    expect(su.ensureThatEndsWithPeriod("start")).toEqual("start.");
  });

  test(`.ensureThatEndsWithSpace("start") should return "start "`, () => {
    expect(su.ensureThatEndsWithSpace("start")).toEqual("start ");
  });


  const isPrimitiveStringValues = [
    //  argument,   expected
    [   "A",        true],
    [   " ",        true],
    [   "",         true],
    [   3,          false],
    [   true,       false],
    [   {},         false],
    [   [1, 2],     false],
    [   undefined,  false],
    [   null,       false],
  ];
    
  describe.each(isPrimitiveStringValues)(
        ".isPrimitiveString(...)",
        (arg, expected) => {

    const prettyArg = typeof arg === "string" ? "\"" + arg + "\"" : arg;

    test(`should return ${expected} for ${prettyArg}`, () => {
      expect(su.isPrimitiveString(arg)).toEqual(expected);
    });
  });
  
  
  describe.each([
    //  argument,   expected
    [   "A",        true],
    [   " ",        false],
    [   " \t ",     false],
    [   " \v ",     false],
    [   " \n ",     false],
    [   " \f ",     false],
    [   " \r ",     false],
    [   "",         false],
    [   3,          false],
  ])(".isNonEmptyString(...)", (arg, expected) => {
    const prettyArg = typeof arg === "string" ? "\"" + arg + "\"" : arg;

    test(`should return ${expected} for ${prettyArg}`, () => {
      expect(su.isNonEmptyString(arg)).toEqual(expected);
    });
  });

});
