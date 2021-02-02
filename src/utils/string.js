// declare global {
//   interface String {
//     isWhiteSpace: () => boolean;
//   }
// }

function isStringEmpty(string) {
  function isBlank(str) {
    return !str || /^\s*$/.test(str);
  }
  function isEmpty(str) {
    return !str || 0 === str.length;
  }
  // String.prototype.isWhiteSpace = function () {
  //   return this.length === 0 || !this.trim();
  // };
  if (isBlank(string) || isEmpty(string)) {
    return true;
  }
};

function replaceWhiteSpaceString(string){
  var newString = string.replace(/[ ,]+/g, " & ");
  return newString;
};

module.exports.sanitizeString = (string) => {
  if (isStringEmpty(string)) {
    return undefined;
  } else {
    return replaceWhiteSpaceString(string);
  }
};

//export { sanitizeString, replaceWhiteSpaceString, isStringEmpty };
