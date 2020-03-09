



export function ensureThatEndsWithPeriod(s) {
  return !s.endsWith(".") ? s + "." : s;
}

export function isNonEmptyString(s) {
  return $.type(s) === "string" && $.trim(s).length > 0;
}
