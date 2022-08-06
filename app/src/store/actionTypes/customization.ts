// action - customization reducer
export const SET_MENU = "@customization/SET_MENU";
export const MENU_TOGGLE = "@customization/MENU_TOGGLE";
export const MENU_OPEN = "@customization/MENU_OPEN";
export const SET_FONT_FAMILY = "@customization/SET_FONT_FAMILY";
export const SET_BORDER_RADIUS = "@customization/SET_BORDER_RADIUS";

export enum CustomizationActionType {
  SET_MENU = "@customization/SET_MENU",
  MENU_TOGGLE = "@customization/MENU_TOGGLE",
  MENU_OPEN = "@customization/MENU_OPEN",
  SET_FONT_FAMILY = "@customization/SET_FONT_FAMILY",
  SET_BORDER_RADIUS = "@customization/SET_BORDER_RADIUS"
}

// interface ICustomizationAction {
//   id: string;
//   fontFamily: string;
//   borderRadius: number;
//   opened: boolean;
// }

interface setMenu {
  type: CustomizationActionType.SET_MENU;
  opened: boolean;
}

interface menuToggle {
  type: CustomizationActionType.MENU_OPEN;
  id: string;
}

interface setFontFamily {
  type: CustomizationActionType.SET_FONT_FAMILY;
  fontFamily: string;
}

interface setBorderRadius {
  type: CustomizationActionType.SET_BORDER_RADIUS;
  borderRadius: number;
}

export type CustomizationAction = setMenu | menuToggle | setFontFamily | setBorderRadius;
