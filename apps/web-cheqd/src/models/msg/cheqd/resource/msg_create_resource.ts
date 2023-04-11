import { SignInfo } from '../commons';
import { Categories } from '@/models/types';

export class MsgCreateResource {
  public category: Categories;
  public type: string;
  public json: any;
  public payload?: MsgCreateResourcePayload;
  public signatures: SignInfo[];

  constructor(type: string, json: any, signatures: SignInfo[], payload?: MsgCreateResourcePayload) {
    this.category = 'cheqd';
    this.type = type;
    this.json = json;
    this.payload = payload;
    this.signatures = signatures;
  }

  static fromJson(object: any): MsgCreateResource {
    const message = {} as MsgCreateResource;
    message.category = 'cheqd';
    message.signatures = [];
    message.json = object;
    message.type = object['@type'];
    if (object.payload !== undefined && object.payload !== null) {
      message.payload = object.payload;
    } else {
      message.payload = undefined;
    }
    if (object.signatures !== undefined && object.signatures !== null) {
      // eslint-disable-next-line no-restricted-syntax
      for (const e of object.signatures) {
        message.signatures.push(e);
      }
    }
    return message;
  }
}

/* eslint-disable */
type MsgCreateResourcePayload = {
  collection_id: string;
  id: string;
  name: string;
  resource_Type: string;
  data: Uint8Array;
};

export default MsgCreateResource;
