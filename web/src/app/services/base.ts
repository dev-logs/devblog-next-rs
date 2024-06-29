import { grpc } from "@improbable-eng/grpc-web"
import { AuthenticationService } from "schema/dist/schema/devlog/rpc/authentication_pb_service"

function createInstance<T>(service: any): T {
  const client: T = {} as any

  Object.keys(service).forEach((key: string) => {
    const target: any = service[key] as any
    if (!target.methodName) return

    if (target.requestStream || target.responseStream)
      throw "Not supported gRPC stream"

    client[key] = async (
      request: InstanceType<typeof target.requestType>,
      metadata: grpc.Metadata,
    ): Promise<InstanceType<typeof target.responseType>> => {
      return new Promise((resolve, reject) => {
        grpc.invoke(service[key], {
          request: request,
          host: process.env.API_GRPC_URL!,
          metadata: metadata,
          onHeaders: (header) => {
            console.log('hed', header)
          },
          onEnd: function (code, msg, traillers) {
            if (code !== grpc.Code.OK) {
              const err: any = new Error(
                traillers.headersMap["Grpc-Message"]?.toString() || '',)
              err.code = code
              err.metadata = traillers
              console.log('loi roi dm', JSON.stringify(traillers.headersMap))
              reject(err)
            } else {
              resolve(msg)
            }
          },
        })
      })
    }
  })

  return client as T
}

export default class gRPCClientBase<T> {
  client: T
  constructor(clientType: any) {
    this.client = createInstance<T>(clientType)
  }

  getMetadata() {
    return new grpc.Metadata()
  }

  getInSecureMetadata() {
    return new grpc.Metadata()
  }
}
