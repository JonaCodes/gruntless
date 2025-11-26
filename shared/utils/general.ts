export const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const splitCamelCase = (str: string) => str.split(/(?=[A-Z])/);
