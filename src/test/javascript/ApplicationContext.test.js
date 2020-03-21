import ApplicationContext from "../../main/javascript/ApplicationContext.js";




describe("class ApplicationContext", () => {
  beforeEach(() => {
    expect.hasAssertions();
  });

  describe("after instatiating", () => {
    const ac = new ApplicationContext();

    test("property domFactory should be null", () => {
      expect(ac.domFactory).toBeNull();
    });

    test("property errorFactory should be null", () => {
      expect(ac.errorFactory).toBeNull();
    });

    test("property htmlElementFinder should be null", () => {
      expect(ac.htmlElementFinder).toBeNull();
    });

    test("property objectUtils should be null", () => {
      expect(ac.objectUtils).toBeNull();
    });

    test("property stringUtils should be null", () => {
      expect(ac.stringUtils).toBeNull();
    });
  });

  describe("after setting values for the properties, the same values should be returned by the same props", () => {
    const [A, B, C, D, E] = ["A", "B", "C", "D", "E"];

    const ac = new ApplicationContext();
    ac.domFactory = A;
    ac.errorFactory = B;
    ac.htmlElementFinder = C;
    ac.objectUtils = D;
    ac.stringUtils = E;

    test("domFactory", () => {
      expect(ac.domFactory).toBe(A);
    });

    test("errorFactory", () => {
      expect(ac.errorFactory).toBe(B);
    });

    test("htmlElementFinder", () => {
      expect(ac.htmlElementFinder).toBe(C);
    });

    test("objectUtils", () => {
      expect(ac.objectUtils).toBe(D);
    });

    test("stringUtils", () => {
      expect(ac.stringUtils).toBe(E);
    });
  });
});
