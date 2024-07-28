import { PostServiceClient } from "schema/dist/schema/devlog/devblog/rpc/post_pb_service";
import gRPCClientBase from "./base";
import { PostInteractionRequest, CreatePostRequest, CreatePostResponse, GetPostRequest, GetPostResponse } from "schema/dist/schema/devlog/devblog/rpc/post_pb";
import { PostId, Post } from "schema/dist/schema/devlog/devblog/entities/post_pb";
import { Like } from "schema/dist/schema/devlog/entities/interaction_pb";
import { Post as ContentLayerPost } from "contentlayer/generated";
import { Author } from "schema/dist/schema/devlog/devblog/entities/author_pb";
import { AuthorLink } from "schema/dist/schema/surrealdb/links/author_pb";

export default class PostService extends gRPCClientBase<PostServiceClient> {
  constructor() {
    super(PostServiceClient)
  }

  async get(postTitle: string): Promise<{post: Post, totalLikes: number, totalViews: number}> {
    return new Promise((resolve, reject) => {
      const request = new GetPostRequest()
      request.setTitle(postTitle)

      this.client.get(request, this.getSecureMetadata(), (err, data: GetPostResponse | null) => {
        if (err) return reject(err)

        return resolve({
          post: data!.getPost()!,
          totalLikes: data!.getTotalLikes(),
          totalViews: data!.getTotalViews()
        })
      })
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
      this.client.interact(request, (err, data) => {
        if (err) return reject(err)

        resolve(data?.getTotalLikeCount() || 0)
      })
    })
  }

  async migrateContentLayerToDb(content: ContentLayerPost): Promise<Post> {
    return new Promise((resolve, reject) => {
      const request = new CreatePostRequest()
      const author = new Author()
      author.setEmail(content.authorEmail)
      author.setFullName(content.authorFullName)
      author.setDisplayName(content.authorDisplayName)

      const authorLink = new AuthorLink()
      authorLink.setObject(author)
      const post = new Post()
      post.setTitle(content.title)
      post.setDescription(content.description)
      post.setAuthor(authorLink);
      request.setPost(post)

      this.client.create(request, (err, data) => {
        if (err) return reject(err)

        const createdPost = data?.getPost()!
        return resolve(createdPost)
      })
    })
  }
}
