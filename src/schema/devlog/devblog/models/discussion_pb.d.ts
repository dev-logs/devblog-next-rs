// package: devlog.devblog
// file: devlog/devblog/models/discussion.proto

import * as jspb from "google-protobuf";

export class Discussion extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Discussion.AsObject;
  static toObject(includeInstance: boolean, msg: Discussion): Discussion.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Discussion, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Discussion;
  static deserializeBinaryFromReader(message: Discussion, reader: jspb.BinaryReader): Discussion;
}

export namespace Discussion {
  export type AsObject = {
    id: string,
  }
}

