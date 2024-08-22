import {
  PostId,
  NewDiscussionRequest,
  Discussion,
  GetDiscussionsRequest,
  Paging, GetDiscussionsResponse, DevblogDiscussionService,
} from "@devlog/schema-ts"

import gRPCClientBase from "./base"

export default class DiscussionService extends gRPCClientBase<typeof DevblogDiscussionService> {
  constructor() {
    super(DevblogDiscussionService)
  }

  async newDiscussion(content: string, postTitle: string): Promise<boolean> {
    if (!content) {
      throw "Empty message !!"
    }

    const request = new NewDiscussionRequest()
    const postId = new PostId()
    postId.title = postTitle

    const newDiscussion = new Discussion()
    newDiscussion.content = content

    request.newDiscussion = newDiscussion

    try {
      request.postId = postId
    } catch (ignore) {
      console.log(ignore)
    }

    await this.client.new_discussion(request, { headers: this.getHeader() })
    return true
  }

  async getDiscussions(page: Paging, title: string): Promise<{ discussions: Discussion[], paging: Paging }> {
    if (page.page < 1) throw 'The page must be a positive number'
    if (page.rowsPerPage < 1) throw 'The rowsPerPage must be a positive number'

    const request = new GetDiscussionsRequest()
    request.paging = page
    request.postId = new PostId({
      title
    })

    const response = await this.client.get_discussions(request, { headers: this.getHeader() }) as GetDiscussionsResponse

    const discussionsList = response.discussions.map(discussion => discussion)

    return {
      discussions: discussionsList,
      paging: response.paging!,
    }
  }
}
