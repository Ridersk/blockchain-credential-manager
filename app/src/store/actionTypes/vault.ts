export enum VaultAccountActionType {
  GET_DETAILS = "@vault/GET_DETAILS",
  GET_ACTIVITIES = "@vault/GET_ACTIVITIES",
  REQUEST_AIRDROP = "@vault/REQUEST_AIRDROP"
}

interface GetDetails {
  type: VaultAccountActionType.GET_DETAILS;
  data: void;
}

interface GetActivities {
  type: VaultAccountActionType.GET_ACTIVITIES;
  data: void;
}

interface RequestAirdrop {
  type: VaultAccountActionType.REQUEST_AIRDROP;
  data: void;
}

export type VaultAccountAction = GetDetails | GetActivities | RequestAirdrop;
