export interface BlockType {
  height: number;
  txs: number;
  timestamp: string;
  proposer: string;
  consumer: string;
  hash: string;
}

export interface BlocksState {
  loading: boolean;
  items: BlockType[];
}

export type ItemType = BlockType;
