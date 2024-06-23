// package: devlog.devblog
// file: devlog/devblog/rpc/discussion.proto

var devlog_devblog_rpc_discussion_pb = require("../../../devlog/devblog/rpc/discussion_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var DevblogDiscussionService = (function () {
  function DevblogDiscussionService() {}
  DevblogDiscussionService.serviceName = "devlog.devblog.DevblogDiscussionService";
  return DevblogDiscussionService;
}());

DevblogDiscussionService.new_discussion = {
  methodName: "new_discussion",
  service: DevblogDiscussionService,
  requestStream: false,
  responseStream: false,
  requestType: devlog_devblog_rpc_discussion_pb.NewDiscussionRequest,
  responseType: devlog_devblog_rpc_discussion_pb.NewDiscussionResponse
};

DevblogDiscussionService.get_discussions = {
  methodName: "get_discussions",
  service: DevblogDiscussionService,
  requestStream: false,
  responseStream: false,
  requestType: devlog_devblog_rpc_discussion_pb.GetDiscussionsRequest,
  responseType: devlog_devblog_rpc_discussion_pb.GetDiscussionsResponse
};

exports.DevblogDiscussionService = DevblogDiscussionService;

function DevblogDiscussionServiceClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

DevblogDiscussionServiceClient.prototype.new_discussion = function new_discussion(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(DevblogDiscussionService.new_discussion, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

DevblogDiscussionServiceClient.prototype.get_discussions = function get_discussions(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(DevblogDiscussionService.get_discussions, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.DevblogDiscussionServiceClient = DevblogDiscussionServiceClient;

