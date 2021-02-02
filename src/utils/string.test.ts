const {
  sanitizeString,
  replaceWhiteSpaceString,
  isStringEmpty,
} = require("./string");

test("sanitizes empty strings", () => {
  expect(sanitizeString("")).toEqual(undefined);
  expect(sanitizeString(" ")).toEqual(undefined);
  expect(sanitizeString("hello world")).toEqual("hello & world");
});

// test("replace white spaces iwth a & seperated with 2 blanks", () => {
//   expect(replaceWhiteSpaceString("hello world").toEqual("hello&world"));
// });
// test("check if the user entered an empty string", () => {
//   expect(isStringEmpty(" ")).toBeTrue();
// });
