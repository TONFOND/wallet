import TonWeb from 'tonweb';
import BN from 'bn.js';
import { Cell } from 'tonweb/dist/types/boc/cell';
import { Base64, fromUrlSafe_RFC4648 } from '$utils/base64';
import { BitStringReader } from '$utils/bitStringReader';
import * as mnemonic from './mnemonic';

export class Ton {
  static toNano(value: number | string | BN) {
    if (typeof value === 'number') {
      value = value.toString();
    }
    return TonWeb.utils.toNano(value);
  }
  static fromNano(value: number | string | BN) {
    if (typeof value === 'number') {
      value = value.toString();
    }
    return TonWeb.utils.fromNano(value);
  }
  static mnemonic = mnemonic;
  static base64ToCell(base64?: string): Cell | undefined {
    if (base64) {
      const bytes = Base64.decodeToBytes(fromUrlSafe_RFC4648(base64));
      return TonWeb.boc.Cell.oneFromBoc(bytes);
    }
  }
  static parseComment(cell: Cell): string | null {
    if (Buffer.isBuffer(cell)) {
      const arr = new Uint8Array(
        cell.buffer,
        cell.byteOffset,
        cell.length / Uint8Array.BYTES_PER_ELEMENT,
      );
      return new TextDecoder().decode(arr);
    }
    const bitStringReader = new BitStringReader(cell.bits);
    if (bitStringReader.remaining < 32) {
      return null;
    }

    // Comment
    if (bitStringReader.readUintNumber(32) === 0) {
      let res = bitStringReader
        .readBuffer(Math.floor(bitStringReader.remaining / 8))
        .toString();
      if (res.length > 0) {
        return res;
      }
    }

    return null;
  }
}
