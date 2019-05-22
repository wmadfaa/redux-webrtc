export const sleep = async (timeout, throwError = false) =>
  new Promise((res, rej) =>
    setTimeout(() => (throwError ? rej() : res()), timeout)
  );

// export const fetchConfig = async (
//   configUrl,
//   userData,
//   maxTries = 30,
//   delay = 1000,
//   timeout = 10000
// ) => {

// };
