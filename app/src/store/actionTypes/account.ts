export enum AccountActionType {
  GET_DETAILS = "@account/GET_DETAILS",
  GET_ACTIVITIES = "@account/GET_ACTIVITIES",
  REQUEST_AIRDROP = "@account/REQUEST_AIRDROP"
}

interface GetDetails {
  type: AccountActionType.GET_DETAILS;
  data: void;
}

interface GetActivities {
  type: AccountActionType.GET_ACTIVITIES;
  data: void;
}

interface RequestAirdrop {
  type: AccountActionType.REQUEST_AIRDROP;
  data: void;
}

export type AccountAction = GetDetails | GetActivities | RequestAirdrop;
