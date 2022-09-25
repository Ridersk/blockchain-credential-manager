export enum NetworkActionType {
  UPDATE = "@network/UPDATE",
  FORCE_UPDATE = "@network/FORCE_UPDATE",
  CHANGE = "@network/CHANGE"
}

export type NetworkData = {
  id: string;
  label: string;
  url: string;
};

interface UpdateNetwork {
  type: NetworkActionType.UPDATE;
  network: NetworkData;
}

interface ForceUpdateNetwork {
  type: NetworkActionType.FORCE_UPDATE;
}

interface ChangeNetwork {
  type: NetworkActionType.UPDATE;
  network: NetworkData;
}

export type NetworkAction = UpdateNetwork | ForceUpdateNetwork | ChangeNetwork;
