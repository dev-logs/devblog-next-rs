import {grpc} from '@improbable-eng/grpc-web'

function createInstance<T>(ctor: Constructor<T>, ...args: any[]): T {
    return new ctor(...args)
}

type Constructor<T> = new (...args: any[]) => T

export default class gRPCClientBase<T> {
    client: T
    constructor(clientType: any) {
      this.client = createInstance<T>(clientType, process.env.API_GRPC_URL)
    }

    getMetadata() {
       return new grpc.Metadata()
    }

    getInSecureMetadata() {
      return new grpc.Metadata()
    }
}
