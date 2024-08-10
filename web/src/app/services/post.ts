import {
  PostId,
  Like,
  View,
  Vote,
  PostService as PostServiceClient,
  PostInteractionRequest,
  GetPostRequest,
  Post, GetPostResponse
} from "@devlog/schema-ts"
import gRPCClientBase from "./base"
import PostLocalStorage from "../storage/post"

export default class PostService extends gRPCClientBase<typeof PostServiceClient> {
  postStorage: PostLocalStorage

  constructor(postStorage: PostLocalStorage) {
    super(PostServiceClient)
    this.postStorage = postStorage
  }

  async get(postTitle: string): Promise<{ post: Post, totalLikes: number, totalViews: number }> {
    const request = new GetPostRequest()
    request.title = postTitle

    const response = await this.client.get(request, { headers: this.getHeader() }) as GetPostResponse

    return {
      post: response.post!,
      totalLikes: response.totalLikes,
      totalViews: response.totalViews
    }
  }

  async view(postTitle: string): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        const postTitleWords = postTitle.toLowerCase().split(' ')
        const url = window.location.href.toLowerCase()
        const isInTheSameWebsite = postTitleWords.every(word => url.includes(word))

        if (isInTheSameWebsite) {
          const request = new PostInteractionRequest()
          const postId = new PostId()
          postId.title = postTitle
          request.id = postId
          request.interaction = {value: new View(), case: 'view'}

          const response = await this.client.interact(request)
          resolve(response.interactionResult.value || 0)
        } else {
          resolve(0)
        }
      }, 10000)
    })
  }

  async like(postTitle: string, count: number): Promise<number> {
    const request = new PostInteractionRequest()
    const postId = new PostId()
    postId.title = postTitle
    request.id = postId

    const like = new Like()
    like.count = count
    request.interaction = {value: like, case: 'like'}

    const response = await this.client.interact(request, { headers: this.getHeader() })
    return response.interactionResult.value || 0
  }

  async vote(postTitle: string): Promise<number> {
    const request = new PostInteractionRequest()
    const postId = new PostId()
    postId.title = postTitle
    request.id = postId
    request.interaction = {value: new Vote(), case: 'vote'}

    const response = await this.client.interact(request, { headers: this.getHeader() })
    await this.postStorage.addVotedPost(postTitle)
    return response.interactionResult.value || 0
  }
}