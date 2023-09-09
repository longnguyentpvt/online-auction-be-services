import md5 from "md5";

export const md5Hash = (txt: string): string => {
  return !!txt ? md5(txt) : "";
};

