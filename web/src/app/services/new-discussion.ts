import {DevblogDiscussionServiceClient} from 'schema/dist/schema/devlog/devblog/rpc/discussion_pb_service'
import {Paging} from 'schema/dist/schema/devlog/models/paging_pb'
import {GetDiscussionsRequest} from 'schema/dist/schema/devlog/devblog/rpc/discussion_pb'
import {grpc} from '@improbable-eng/grpc-web'
import {Discussion} from "schema/src/schema/devlog/devblog/models/discussion_pb"
import {NewDiscussionRequest} from "schema/src/schema/devlog/devblog/rpc/discussion_pb"
import gRPCClientBase from "@/app/services/base"

export default class DiscussionService extends gRPCClientBase {
  private rpcService: DevblogDiscussionServiceClient

  constructor() {
    super()
    this.rpcService = new DevblogDiscussionServiceClient(process.env.DEVBLOG_API_URL!)
  }

  async newDiscussion(discussion: Discussion) {
    const request = new NewDiscussionRequest()
    request.setNewdiscussion(discussion)
    return new Promise((resolve, reject) => {
      this.rpcService.new_discussion(request, this.getMetadata(), (err, data) => {
        if (err) reject(err)
        if(data) resolve(data)
      })
    })
  }

  async getDiscussions({page, rowsPerPage, postId}: any = {}) {
    const paging = new Paging()
    paging.setPage(page)
    paging.setRowsPerPage(rowsPerPage)

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
