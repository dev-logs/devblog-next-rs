// package: devlog
// file: devlog/models/paging.proto

import * as jspb from "google-protobuf";

export class Paging extends jspb.Message {
  getPage(): number;
  setPage(value: number): void;

  getRowsPerPage(): number;
  setRowsPerPage(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Paging.AsObject;
  static toObject(includeInstance: boolean, msg: Paging): Paging.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Paging, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Paging;
  static deserializeBinaryFromReader(message: Paging, reader: jspb.BinaryReader): Paging;
}

export namespace Paging {
  export type AsObject = {
    page: number,
    rowsPerPage: number,
  }
}

