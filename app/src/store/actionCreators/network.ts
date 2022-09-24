import { createAsyncThunk } from "@reduxjs/toolkit";
import { background } from "services/background-connection/background-msg";
import { NetworkActionType, NetworkData } from "store/actionTypes/network";

export const updateNetworkAction = (network: NetworkData) => ({
  type: NetworkActionType.UPDATE,
  network
});

export const updateNetworkFromBackgroundAction = createAsyncThunk<void, void>(
  NetworkActionType.FORCE_UPDATE,
  async (_, thunkAPI) => {
    const response = await background.getCurrentNetwork();
    const network: NetworkData = response?.result;

    thunkAPI.dispatch(updateNetworkAction(network));
  }
);

export const changeNetworkAction = createAsyncThunk<void, NetworkData>(
  NetworkActionType.CHANGE,
  async (network: NetworkData, thunkAPI) => {
    await background.changeNetwork(network.id);
    thunkAPI.dispatch(updateNetworkAction(network));
  }
);
