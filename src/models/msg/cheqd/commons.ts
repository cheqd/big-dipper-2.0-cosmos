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
