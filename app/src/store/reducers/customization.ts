// project imports
import config from "config";

// action - state management
// import * as actionTypes from "../actionTypes/customization";
import { CustomizationAction, CustomizationActionType } from "../actionTypes/customization";

export interface CustomizationState {
  isOpen: Array<string>;
  fontFamily: string;
  borderRadius: number;
  opened: boolean;
}

export const initialState = {
  isOpen: [], // for active default menu
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state: CustomizationState = initialState, action: CustomizationAction): CustomizationState => {
  let id;
  switch (action.type) {
    case CustomizationActionType.MENU_OPEN:
      id = action.id;
      return {
        ...state,
        isOpen: [id]
      };
    case CustomizationActionType.SET_MENU:
      return {
        ...state,
        opened: action.opened
      };
    case CustomizationActionType.SET_FONT_FAMILY:
      return {
        ...state,
        fontFamily: action.fontFamily
      };
    case CustomizationActionType.SET_BORDER_RADIUS:
      return {
        ...state,
        borderRadius: action.borderRadius
      };
    default:
      return state;
  }
};

export default customizationReducer;
