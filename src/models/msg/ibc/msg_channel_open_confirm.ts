import { Categories } from '../types';

class MsgChannelOpenConfirm {
    public category: Categories;
    public type: string;
    public signer: string;
    public channelId: string;
    public portId: string;
    public json: any;

    constructor(payload: any) {
      this.category = 'ibc';
      this.type = payload.type;
      this.signer = payload.signer;
      this.channelId = payload.channelId;
      this.portId = payload.portId;
      this.json = payload.json;
    }

    static fromJSON(json: any) {
      return new MsgChannelOpenConfirm({
        json,
        type: json['@type'],
        signer: json.signer,
        channelId: json.channel_id,
        portId: json.port_id,
      });
    }
}

export default MsgChannelOpenConfirm;
