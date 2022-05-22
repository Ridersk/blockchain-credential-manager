import { Dispatch } from "redux";
import { CustomizationActionType, CustomizationAction } from "../actionTypes/customization";

export const setMenu = (opened: boolean) => {
  return async (dispatch: Dispatch<CustomizationAction>) => {
    dispatch({
      type: CustomizationActionType.SET_MENU,
      opened
    });
  };
};

export const menuOpen = (id: string) => {
  return async (dispatch: Dispatch<CustomizationAction>) => {
    dispatch({
      type: CustomizationActionType.MENU_OPEN,
      id
    });
  };
};

export const setFontFamily = (fontFamily: string) => {
  return async (dispatch: Dispatch<CustomizationAction>) => {
    dispatch({
      type: CustomizationActionType.SET_FONT_FAMILY,
      fontFamily
    });
  };
};

export const setBorderRadius = (borderRadius: number) => {
  return async (dispatch: Dispatch<CustomizationAction>) => {
    dispatch({
      type: CustomizationActionType.SET_BORDER_RADIUS,
      borderRadius
    });
  };
};
