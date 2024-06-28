import {grpc} from '@improbable-eng/grpc-web'

export default class gRPCClientBase {
    getMetadata() {
       return new grpc.Metadata()
    }
}
