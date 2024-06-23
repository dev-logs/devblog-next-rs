// package: devlog.devblog
// file: devlog/devblog/rpc/discussion.proto

import * as jspb from "google-protobuf";
import * as devlog_devblog_models_discussion_pb from "../../../devlog/devblog/models/discussion_pb";
import * as devlog_models_paging_pb from "../../../devlog/models/paging_pb";

export class GetDiscussionsRequest extends jspb.Message {
  hasPaging(): boolean;
  clearPaging(): void;
  getPaging(): devlog_models_paging_pb.Paging | undefined;
  setPaging(value?: devlog_models_paging_pb.Paging): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDiscussionsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetDiscussionsRequest): GetDiscussionsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetDiscussionsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDiscussionsRequest;
  static deserializeBinaryFromReader(message: GetDiscussionsRequest, reader: jspb.BinaryReader): GetDiscussionsRequest;
}

export namespace GetDiscussionsRequest {
  export type AsObject = {
    paging?: devlog_models_paging_pb.Paging.AsObject,
  }
}

export class GetDiscussionsResponse extends jspb.Message {
  hasPaging(): boolean;
  clearPaging(): void;
  getPaging(): devlog_models_paging_pb.Paging | undefined;
  setPaging(value?: devlog_models_paging_pb.Paging): void;

  clearDiscussionsList(): void;
  getDiscussionsList(): Array<devlog_devblog_models_discussion_pb.Discussion>;
  setDiscussionsList(value: Array<devlog_devblog_models_discussion_pb.Discussion>): void;
  addDiscussions(value?: devlog_devblog_models_discussion_pb.Discussion, index?: number): devlog_devblog_models_discussion_pb.Discussion;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetDiscussionsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetDiscussionsResponse): GetDiscussionsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetDiscussionsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetDiscussionsResponse;
  static deserializeBinaryFromReader(message: GetDiscussionsResponse, reader: jspb.BinaryReader): GetDiscussionsResponse;
}

export namespace GetDiscussionsResponse {
  export type AsObject = {
    paging?: devlog_models_paging_pb.Paging.AsObject,
    discussionsList: Array<devlog_devblog_models_discussion_pb.Discussion.AsObject>,
  }
}

export class NewDiscussionRequest extends jspb.Message {
  hasNewdiscussion(): boolean;
  clearNewdiscussion(): void;
  getNewdiscussion(): devlog_devblog_models_discussion_pb.Discussion | undefined;
  setNewdiscussion(value?: devlog_devblog_models_discussion_pb.Discussion): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NewDiscussionRequest.AsObject;
  static toObject(includeInstance: boolean, msg: NewDiscussionRequest): NewDiscussionRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NewDiscussionRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NewDiscussionRequest;
  static deserializeBinaryFromReader(message: NewDiscussionRequest, reader: jspb.BinaryReader): NewDiscussionRequest;
}

export namespace NewDiscussionRequest {
  export type AsObject = {
    newdiscussion?: devlog_devblog_models_discussion_pb.Discussion.AsObject,
  }
}

export class NewDiscussionResponse extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NewDiscussionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: NewDiscussionResponse): NewDiscussionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NewDiscussionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NewDiscussionResponse;
  static deserializeBinaryFromReader(message: NewDiscussionResponse, reader: jspb.BinaryReader): NewDiscussionResponse;
}

export namespace NewDiscussionResponse {
  export type AsObject = {
  }
}

