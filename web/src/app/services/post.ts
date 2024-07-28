import { PostServiceClient } from "schema/dist/schema/devlog/devblog/rpc/post_pb_service";
import gRPCClientBase from "./base";
import { PostInteractionRequest, CreatePostRequest, CreatePostResponse, GetPostRequest, GetPostResponse } from "schema/dist/schema/devlog/devblog/rpc/post_pb";
import { PostId, Post } from "schema/dist/schema/devlog/devblog/entities/post_pb";
import { Like, View, Vote } from "schema/dist/schema/devlog/entities/interaction_pb";
import { Post as ContentLayerPost } from "contentlayer/generated";
import { Author } from "schema/dist/schema/devlog/devblog/entities/author_pb";
import { AuthorLink } from "schema/dist/schema/surrealdb/links/author_pb";
import PostLocalStorage from "../storage/post";

export default class PostService extends gRPCClientBase<PostServiceClient> {
  postStorage: PostLocalStorage

  constructor(postStorage: PostLocalStorage) {
    super(PostServiceClient)
    this.postStorage = postStorage
  }

  async get(postTitle: string): Promise<{post: Post, totalLikes: number, totalViews: number}> {
    return new Promise((resolve, reject) => {
      const request = new GetPostRequest()
      request.setTitle(postTitle)

      this.client.get(request, this.getMetadata(), (err, data: GetPostResponse | null) => {
        if (err) return reject(err)

        return resolve({
          post: data!.getPost()!,
          totalLikes: data!.getTotalLikes(),
          totalViews: data!.getTotalViews()
        })
      })
    })
  }

  async view(postTitle: string): Promise<number> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const postTitleWords = postTitle.toLowerCase().split(' ')
        const url = window.location.href.toLowerCase()
        const isInTheSameWebsite = postTitleWords.every(word => url.includes(word))

        if (isInTheSameWebsite) {
          const request = new PostInteractionRequest()
          const postId = new PostId()
          postId.setTitle(postTitle)
          request.setId(postId)
          const view = new View()
          request.setView(view)

          this.client.interact(request, (err, data) => {
            if (err) return reject(err)

            resolve(data?.getTotalViewCount() || 0)
          })
        }
        else {
          resolve(0)
        }
      }, 10000)
    })
  }

  async like(postTitle: string, count: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const request = new PostInteractionRequest()
      const postId = new PostId()
      postId.setTitle(postTitle);
      request.setId(postId)
      const like = new Like()
      like.setCount(count)
      request.setLike(like)
      this.client.interact(request, this.getMetadata(), (err, data) => {
        if (err) return reject(err)

        resolve(data?.getTotalLikeCount() || 0)
      })
    })
  }

  async vote(postTitle: string): Promise<number> {
    return new Promise((resolve, reject) => {
      const request = new PostInteractionRequest()
      const postId = new PostId()
      postId.setTitle(postTitle);
      request.setId(postId)
      const vote = new Vote()
      request.setVote(vote)
      this.client.interact(request, this.getMetadata(), (err, data) => {
        if (err) return reject(err)

        this.postStorage.addVotedPost(postTitle)
        resolve(data?.getTotalVoteCount() || 0)
      })
    })
  }
}
