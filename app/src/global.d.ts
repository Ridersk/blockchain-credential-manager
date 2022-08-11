declare module "*.scss";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.svg";
declare module "*.gif";

declare module "browser-passworder" {
  let encrypt: (password: string, dataObj: object) => Promise<string>;
  let decrypt: (password: string, text: string) => Promise<any>;

  export { encrypt };
  export { decrypt };
}
