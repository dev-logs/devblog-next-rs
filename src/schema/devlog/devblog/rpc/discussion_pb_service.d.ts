// package: devlog.devblog
// file: devlog/devblog/rpc/discussion.proto

import * as devlog_devblog_rpc_discussion_pb from "../../../devlog/devblog/rpc/discussion_pb";
import {grpc} from "@improbable-eng/grpc-web";

type DevblogDiscussionServicenew_discussion = {
  readonly methodName: string;
  readonly service: typeof DevblogDiscussionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof devlog_devblog_rpc_discussion_pb.NewDiscussionRequest;
  readonly responseType: typeof devlog_devblog_rpc_discussion_pb.NewDiscussionResponse;
};

type DevblogDiscussionServiceget_discussions = {
  readonly methodName: string;
  readonly service: typeof DevblogDiscussionService;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof devlog_devblog_rpc_discussion_pb.GetDiscussionsRequest;
  readonly responseType: typeof devlog_devblog_rpc_discussion_pb.GetDiscussionsResponse;
};

export class DevblogDiscussionService {
  static readonly serviceName: string;
  static readonly new_discussion: DevblogDiscussionServicenew_discussion;
  static readonly get_discussions: DevblogDiscussionServiceget_discussions;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class DevblogDiscussionServiceClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  new_discussion(
    requestMessage: devlog_devblog_rpc_discussion_pb.NewDiscussionRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: devlog_devblog_rpc_discussion_pb.NewDiscussionResponse|null) => void
  ): UnaryResponse;
  new_discussion(
    requestMessage: devlog_devblog_rpc_discussion_pb.NewDiscussionRequest,
    callback: (error: ServiceError|null, responseMessage: devlog_devblog_rpc_discussion_pb.NewDiscussionResponse|null) => void
  ): UnaryResponse;
  get_discussions(
    requestMessage: devlog_devblog_rpc_discussion_pb.GetDiscussionsRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: devlog_devblog_rpc_discussion_pb.GetDiscussionsResponse|null) => void
  ): UnaryResponse;
  get_discussions(
    requestMessage: devlog_devblog_rpc_discussion_pb.GetDiscussionsRequest,
    callback: (error: ServiceError|null, responseMessage: devlog_devblog_rpc_discussion_pb.GetDiscussionsResponse|null) => void
  ): UnaryResponse;
}

