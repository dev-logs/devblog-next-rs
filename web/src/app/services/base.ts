import {createGrpcWebTransport} from "@connectrpc/connect-web"
import {createPromiseClient, PromiseClient} from "@connectrpc/connect"
import {ServiceType} from "@bufbuild/protobuf";

export default class gRPCClientBase<T extends ServiceType> {
  client: PromiseClient<T>
  constructor(clientDesc: T) {
    const transport = createGrpcWebTransport({
      baseUrl: process.env.API_GRPC_URL!,
      useBinaryFormat: true,
    })

    this.client = createPromiseClient(clientDesc, transport)
  }

  getSecureHeader(): HeadersInit {

    let tokenObj: any = JSON.parse(localStorage.getItem('access-token') || '{}')
    if (!tokenObj || !tokenObj.content) throw 'Login is required'
    return [
       ['authorization', `${tokenObj.content}`]
    ]
  }

  getInSecureHeader(): HeadersInit {
    return []
  }

  getHeader() {
    try {
      return this.getSecureHeader()
    }
    catch(ignored) {
      return this.getInSecureHeader()
    }
  }
}
