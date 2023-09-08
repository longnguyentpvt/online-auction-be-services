// eslint-disable-next-line max-len
const EmailRegex = new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export const validateEmail = (text: string): boolean => {
  return text ? EmailRegex.test(text) : false;
};

export const validateLength = (value: string, length: {
  min?: number,
  max: number
}): boolean => {
  const len = value?.length ?? 0;
  return len <= length.max && (length?.min ?? 1) <= len;
};
