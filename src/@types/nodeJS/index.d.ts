/* eslint-disable no-var */
declare global {
  var adminToken: string;
  var emptyObj: any;

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'production' | 'development' | 'test';
    }
  }
}

export {};
