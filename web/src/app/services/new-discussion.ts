//@ts-ignore
import {DevblogDiscussionServiceClient} from 'schema/dist/schema/devlog/devblog/rpc/discussion_grpc_web_pb'
import {Paging} from 'schema/dist/schema/devlog/models/paging_pb'
import {GetDiscussionsRequest} from "schema/dist/schema/devlog/devblog/rpc/discussion_pb"

export default class DiscussionService {
  private rpcService: DevblogDiscussionServiceClient

  constructor() {
    this.rpcService = new DevblogDiscussionServiceClient('http://localhost:30001')
  }

  async getDiscussions() {
    const paging = new Paging()
    paging.setPage(1)
    paging.setRowsPerPage(1)

    const request = new GetDiscussionsRequest()
    request.setPaging(paging)
    console.log(request)
    return new Promise((resolve, reject) => {
      this.rpcService.get_discussions(request, {}, (err: any, res: any) => {
        if (err) {
          return reject(err)
        }

        resolve(res!.toObject())
      })
    })
  }
}
