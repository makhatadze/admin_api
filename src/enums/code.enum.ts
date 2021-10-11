/** Define the code that returns the error */
export enum CodeEnum {
  /** No token passed */
  NO_TOKEN = 10042,
  /** token error */
  TOKEN_ERROR = 10043,
}

/** Wrong code text description */
export const CodeMessage = {
  10042: 'You are not logged in, please log in first',
  10043: 'The passed token is wrong',
};
