/* eslint-disable no-restricted-syntax */
/* eslint-disable max-classes-per-file */

import { Service, SignInfo, VerificationMethod } from './commons';

export class MsgCreateDid {
  public type: string;
  public json: any;
 public payload?: MsgCreateDidPayload;
  public signatures: SignInfo[];

  constructor(
    type: string,
    json: any,
    payload: MsgCreateDidPayload,
    signatures: SignInfo[],
  ) {
    this.type = type;
    this.json = json;
    this.payload = payload;
    this.signatures = signatures;
  }

  static fromJson(object: any): MsgCreateDid {
    const message = { } as MsgCreateDid;
    message.signatures = [];
    message.json = object;
    message.type = object['@type'];

    if (object.payload !== undefined && object.payload !== null) {
      message.payload = MsgCreateDidPayload.fromJson(object.payload);
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

class MsgCreateDidPayload {
public context: string[];
public id: string;
public controller: string[];
public verificationMethod: VerificationMethod[];
public authentication: string[];
public assertionMethod: string[];
public capabilityInvocation: string[];
public capabilityDelegation: string[];
public keyAgreement: string[];
public alsoKnownAs: string[];
public service: Service[];

constructor(
  context: string[],
  id: string,
  controller: string[],
  verificationMethod: VerificationMethod[],
  authentication: string[],
  assertionMethod: string[],
  capabilityInvocation: string[],
  capabilityDelegation: string[],
  keyAgreement: string[],
  alsoKnownAs: string[],
  service: Service[],
) {
  this.context = context;
  this.id = id;
  this.controller = controller;
  this.verificationMethod = verificationMethod;
  this.authentication = authentication;
  this.assertionMethod = assertionMethod;
  this.capabilityInvocation = capabilityInvocation;
  this.capabilityDelegation = capabilityDelegation;
  this.keyAgreement = keyAgreement;
  this.alsoKnownAs = alsoKnownAs;
  this.service = service;
}

static fromJson(object: any): MsgCreateDidPayload {
  const message = { } as MsgCreateDidPayload;
  message.context = [];
  message.controller = [];
  message.verificationMethod = [];
  message.authentication = [];
  message.assertionMethod = [];
  message.capabilityInvocation = [];
  message.capabilityDelegation = [];
  message.keyAgreement = [];
  message.alsoKnownAs = [];
  message.service = [];
  if (object.context !== undefined && object.context !== null) {
    for (const e of object.context) {
      message.context.push(String(e));
    }
  }
  if (object.id !== undefined && object.id !== null) {
    message.id = String(object.id);
  } else {
    message.id = '';
  }
  if (object.controller !== undefined && object.controller !== null) {
    for (const e of object.controller) {
      message.controller.push(String(e));
    }
  }
  if (
    object.verificationMethod !== undefined
      && object.verificationMethod !== null
  ) {
    for (const e of object.verificationMethod) {
      message.verificationMethod.push(VerificationMethod.fromJson(e));
    }
  }
  if (object.authentication !== undefined && object.authentication !== null) {
    for (const e of object.authentication) {
      message.authentication.push(String(e));
    }
  }
  if (
    object.assertionMethod !== undefined
      && object.assertionMethod !== null
  ) {
    for (const e of object.assertionMethod) {
      message.assertionMethod.push(String(e));
    }
  }
  if (
    object.capabilityInvocation !== undefined
      && object.capabilityInvocation !== null
  ) {
    for (const e of object.capabilityInvocation) {
      message.capabilityInvocation.push(String(e));
    }
  }
  if (
    object.capabilityDelegation !== undefined
      && object.capabilityDelegation !== null
  ) {
    for (const e of object.capabilityDelegation) {
      message.capabilityDelegation.push(String(e));
    }
  }
  if (object.keyAgreement !== undefined && object.keyAgreement !== null) {
    for (const e of object.keyAgreement) {
      message.keyAgreement.push(String(e));
    }
  }
  if (object.alsoKnownAs !== undefined && object.alsoKnownAs !== null) {
    for (const e of object.alsoKnownAs) {
      message.alsoKnownAs.push(String(e));
    }
  }
  if (object.service !== undefined && object.service !== null) {
    for (const e of object.service) {
      message.service.push(Service.fromJson(e));
    }
  }
  return message;
}
}


