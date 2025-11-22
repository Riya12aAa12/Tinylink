const CODE_CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const MIN_CODE_LENGTH = 6;
export const MAX_CODE_LENGTH = 8;

export function generateCode(length = MIN_CODE_LENGTH) {
  let result = "";
  const charsLength = CODE_CHARSET.length;
  for (let i = 0; i < length; i += 1) {
    result += CODE_CHARSET[Math.floor(Math.random() * charsLength)];
  }
  return result;
}

export function isValidCode(code: string) {
  const regex = new RegExp(`^[A-Za-z0-9]{${MIN_CODE_LENGTH},${MAX_CODE_LENGTH}}$`);
  return regex.test(code);
}

