import {DevblogDiscussionServiceClient} from 'schema/dist/schema/devlog/devblog/rpc/discussion_pb_service'
import {Paging} from 'schema/dist/schema/devlog/models/paging_pb'
import {GetDiscussionsRequest} from "schema/dist/schema/devlog/devblog/rpc/discussion_pb"
import {grpc} from '@improbable-eng/grpc-web'

export default class DiscussionService {
  private rpcService: DevblogDiscussionServiceClient

  constructor() {
    this.rpcService = new DevblogDiscussionServiceClient(process.env.DEVBLOG_API_URL!)
  }

  async getDiscussions() {
    const paging = new Paging()
    paging.setPage(1)
    paging.setRowsPerPage(1)

    const metadata = new grpc.Metadata()
    const request = new GetDiscussionsRequest()
    request.setPaging(paging)
    return new Promise((resolve, reject) => {
      this.rpcService.get_discussions(request, metadata, (err: any, res: any) => {
        if (err) return reject(err)

        resolve(res!.toObject())
      })
    })
  }
}
