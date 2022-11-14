/* eslint-disable no-restricted-syntax */
/* eslint-disable no-plusplus */
/* eslint-disable max-classes-per-file */

import { SignInfo } from '../commons';

export class MsgCreateResource {
    public type: string;
    public json: any;
    public payload?: MsgCreateResourcePayload;
    public signatures: SignInfo[];

    constructor(
      type: string,
      json: any,
      signatures: SignInfo[],
      payload?: MsgCreateResourcePayload,
    ) {
      this.type = type;
      this.json = json;
      this.payload = payload;
      this.signatures = signatures;
    }

    static fromJson(object: any) : MsgCreateResource {
      const message = { } as MsgCreateResource;
      message.signatures = [];
      message.json = object;
      message.type = object['@type'];
      if (object.payload !== undefined && object.payload !== null) {
        message.payload = MsgCreateResourcePayload.fromJson(object.payload);
      } else {
        message.payload = undefined;
      }
      if (object.signatures !== undefined && object.signatures !== null) {
        for (const e of object.signatures) {
          message.signatures.push(SignInfo.fromJson(e));
        }
      }
      return message;
    }
}

class MsgCreateResourcePayload {
    public collectionId: string;
    public id: string;
    public name: string;
    public resourceType: string;
    public data: Uint8Array;

    constructor(
      collectionId: string,
      id: string,
      name: string,
      resourceType: string,
      data: Uint8Array,
    ) {
      this.collectionId = collectionId;
      this.id = id;
      this.name = name;
      this.resourceType = resourceType;
      this.data = data;
    }

    static fromJson(object: any): MsgCreateResourcePayload {
      const message = { } as MsgCreateResourcePayload;
      message.data = new Uint8Array();
      if (object.collectionId !== undefined && object.collectionId !== null) {
        message.collectionId = String(object.collectionId);
      } else {
        message.collectionId = '';
      }
      if (object.id !== undefined && object.id !== null) {
        message.id = String(object.id);
      } else {
        message.id = '';
      }
      if (object.name !== undefined && object.name !== null) {
        message.name = String(object.name);
      } else {
        message.name = '';
      }
      if (object.resourceType !== undefined && object.resourceType !== null) {
        message.resourceType = String(object.resourceType);
      } else {
        message.resourceType = '';
      }
      if (object.data !== undefined && object.data !== null) {
        message.data = bytesFromBase64(object.data);
      }
      return message;
    }
}

function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}
