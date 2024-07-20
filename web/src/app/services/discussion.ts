import { Discussion } from "schema/dist/schema/devlog/devblog/entities/discussion_pb"
import { PostLink } from "schema/dist/schema/surrealdb/links/post_pb"
import gRPCClientBase from "./base"
import { DevblogDiscussionServiceClient } from 'schema/dist/schema/devlog/devblog/rpc/discussion_pb_service'
import { GetDiscussionsRequest, GetDiscussionsResponse, NewDiscussionRequest } from "schema/dist/schema/devlog/devblog/rpc/discussion_pb"
import { PostId } from "schema/dist/schema/devlog/devblog/entities/post_pb"
import { Paging } from "schema/dist/schema/devlog/rpc/paging_pb"

export default class DiscussionService extends gRPCClientBase<DevblogDiscussionServiceClient> {
  constructor() {
    super(DevblogDiscussionServiceClient)
  }

  async newDiscussion(content: string, postTitle: string) {
    return new Promise((resolve, reject) => {
      if (!content) {
        return reject("Empty message !!")
      }

      const request = new NewDiscussionRequest()
      const postId = new PostId()
      postId.setTitle(postTitle)
      const newDiscussion = new Discussion()
      newDiscussion.setContent(content)

      request.setNewDiscussion(newDiscussion)
      try {
        request.setPostId(postId)
      }
      catch (ignore) {
        console.log(ignore)
      }

      this.client.new_discussion(request, this.getSecureMetadata(), (err, data) => {
        if (err) {
          console.log('new discussion error', err.message)
          return reject(err)
        }

        return resolve(data)
      })
    })
  }

  async getDiscussions(page: number, rowsPerPage: number)  {
    return new Promise((resolve, reject) => {
      if (page < 1) return reject('The page must be positive number')
      if (rowsPerPage < 1) return reject('The rowsPerPage must be positive number')

      const request = new GetDiscussionsRequest()
      const paging = new Paging()
      paging.setPage(page)
      paging.setRowsPerPage(rowsPerPage)
      request.setPaging(paging)

      this.client.get_discussions(request, this.getSecureMetadata(), (err, data: GetDiscussionsResponse | null) => {
        if (err) return reject(err)

        const list = data!.getDiscussionsList()
        return resolve([...list])
      })
    })
  }
}
