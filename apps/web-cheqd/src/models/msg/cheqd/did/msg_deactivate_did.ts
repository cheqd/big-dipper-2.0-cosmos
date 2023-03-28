import { SignInfo } from '../commons';
import { Categories } from '@/models/types';

type MsgDeactivateDidDocPayload = {
  id: string;
  versionId: string;
};

export class MsgDeactivateDidDoc {
  public category: Categories;

  public type: string;

  public json: any;

  public payload?: MsgDeactivateDidDocPayload;

  public signatures: SignInfo[];

  constructor(
    type: string,
    json: any,
    payload: MsgDeactivateDidDocPayload,
    signatures: SignInfo[]
  ) {
    this.category = 'cheqd';
    this.type = type;
    this.json = json;
    this.payload = payload;
    this.signatures = signatures;
  }

  static fromJson(object: any): MsgDeactivateDidDoc {
    const message = {} as MsgDeactivateDidDoc;
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

export default MsgDeactivateDidDoc;
