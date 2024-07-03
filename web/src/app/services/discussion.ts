import { Discussion } from "schema/dist/schema/devlog/devblog/entities/discussion_pb"
import { PostLink } from "schema/dist/schema/surrealdb/links/post_pb"
import gRPCClientBase from "./base"
import { DevblogDiscussionServiceClient } from 'schema/dist/schema/devlog/devblog/rpc/discussion_pb_service'
import { NewDiscussionRequest } from "schema/dist/schema/devlog/devblog/rpc/discussion_pb"
import { PostId } from "schema/dist/schema/devlog/devblog/entities/post_pb"

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
        console.log('s')
        request.setPostId(postId)
        console.log('i')
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
}
