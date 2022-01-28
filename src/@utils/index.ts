export const generateCharacters = (length: number) => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz/~!@#$%^&*()_+`1234567890-=';

  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return result;
};

export const generateAlphaString = (length: number) => {
  const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

  let result = '';
  for (let i = 0; i < length; i++) {
    result += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
  }

  return result;
};

export const generateNumberString = (length: number, max?: number) => {
  const numbers = '1234567890'.slice(0, max);

  let result = '';
  for (let i = 0; i < length; i++) {
    result += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return +result;
};

export const getOneofArrayItem = (arr: any[]) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

export const isTypeOf = <T>(obj: T) => obj;
