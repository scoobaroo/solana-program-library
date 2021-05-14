import * as borsh from 'borsh';
import { PublicKey } from '@solana/web3.js';

// Class wrapping a plain object
export abstract class Assignable {
  constructor(properties: any) {
    Object.assign(this, properties);
  }

  encode(): Buffer {
    return Buffer.from(borsh.serialize(SCHEMA, this));
  }

  static decode(data: Buffer): any {
    return borsh.deserialize(SCHEMA, this, data);
  }
}

// Class representing a Rust-compatible enum, since enums are only strings or
// numbers in pure JS
export abstract class Enum extends Assignable {
  enum: string;
  constructor(properties: any) {
    super(properties);
    if (Object.keys(properties).length !== 1) {
      throw new Error('Enum can only take single value');
    }
    Object.keys(properties).map((key) => {
      this.enum = key;
    });
  }
}

export const SCHEMA: Map<Function, any> = new Map();
