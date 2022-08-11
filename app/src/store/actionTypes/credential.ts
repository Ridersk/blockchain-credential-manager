import {
  EditCredentialParams,
  NewCredentialParams
} from "scripts/wallet-manager/controllers/credentials";

export enum CredentialActionType {
  CREATE = "@credential/CREATE",
  EDIT = "@credential/EDIT",
  GET = "@credential/GET",
  GET_LIST = "@credential/GET_LIST",
  DELETE = "@credential/DELETED"
}

interface CreateCredential {
  type: CredentialActionType.CREATE;
  data: NewCredentialParams;
}

interface EditCredential {
  type: CredentialActionType.EDIT;
  data: EditCredentialParams;
}

interface GetCredential {
  type: CredentialActionType.GET;
  data: string;
}

interface GetCredentials {
  type: CredentialActionType.GET_LIST;
  data: void;
}

interface DeleteCredential {
  type: CredentialActionType.DELETE;
  data: string;
}

export type CredentialAction =
  | CreateCredential
  | EditCredential
  | GetCredential
  | GetCredentials
  | DeleteCredential;
