/* eslint-disable max-classes-per-file */
export class SignInfo {
    public verificationMethodId: string;
    public signature: string;

    constructor(verificationMethodId: string,
      signature: string) {
      this.verificationMethodId = verificationMethodId;
      this.signature = signature;
    }

    static fromJson(object: any): SignInfo {
      const message = { } as SignInfo;
      if (
        object.verificationMethodId !== undefined
        && object.verificationMethodId !== null
      ) {
        message.verificationMethodId = String(object.verificationMethodId);
      } else {
        message.verificationMethodId = '';
      }
      if (object.signature !== undefined && object.signature !== null) {
        message.signature = String(object.signature);
      } else {
        message.signature = '';
      }
      return message;
    }
}


export class Service {
  public id: string;
  public type: string;
  public serviceEndpoint: string;

  constructor(id: string,
    type: string,
    serviceEndpoint: string) {
    this.id = id;
    this.type = type;
    this.serviceEndpoint = serviceEndpoint;
  }

  static fromJson(object: any): Service {
    const message = { } as Service;
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = '';
    }
    if (
      object.serviceEndpoint !== undefined
      && object.serviceEndpoint !== null
    ) {
      message.serviceEndpoint = String(object.serviceEndpoint);
    } else {
      message.serviceEndpoint = '';
    }
    return message;
  }
}
export class VerificationMethod {
public id: string;
public type: string;
public controller: string;
  /** optional */
  public publicKeyJwk: KeyValuePair[];
  /** optional */
  public publicKeyMultibase: string;

  constructor(id: string,
    type: string,
    controller: string,
    publicKeyJwk: KeyValuePair[],
    publicKeyMultibase: string) {
    this.type = type;
    this.controller = controller;
    this.publicKeyJwk = publicKeyJwk;
    this.publicKeyMultibase = publicKeyMultibase;
  }
  static fromJson(object: any): VerificationMethod {
    const message = { } as VerificationMethod;
    message.publicKeyJwk = [];
    if (object.id !== undefined && object.id !== null) {
      message.id = String(object.id);
    } else {
      message.id = '';
    }
    if (object.type !== undefined && object.type !== null) {
      message.type = String(object.type);
    } else {
      message.type = '';
    }
    if (object.controller !== undefined && object.controller !== null) {
      message.controller = String(object.controller);
    } else {
      message.controller = '';
    }
    if (object.publicKeyJwk !== undefined && object.publicKeyJwk !== null) {
      for (const e of object.publicKeyJwk) {
        message.publicKeyJwk.push(KeyValuePair.fromJson(e));
      }
    }
    if (
      object.publicKeyMultibase !== undefined
      && object.publicKeyMultibase !== null
    ) {
      message.publicKeyMultibase = String(object.publicKeyMultibase);
    } else {
      message.publicKeyMultibase = '';
    }
    return message;
  }
}

class KeyValuePair {
  public key: string;
  public value: string;

  constructor(key: string, value: string) {
    this.key = key;
    this.value = value;
  }

  static fromJson(object: any): KeyValuePair {
    const message = { } as KeyValuePair;
    if (object.key !== undefined && object.key !== null) {
      message.key = String(object.key);
    } else {
      message.key = '';
    }
    if (object.value !== undefined && object.value !== null) {
      message.value = String(object.value);
    } else {
      message.value = '';
    }
    return message;
  }
}