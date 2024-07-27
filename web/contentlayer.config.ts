// contentlayer.config.ts
import * as postPbServicePkg from "grpc-ts/dist/schema/devlog/devblog/rpc/post_grpc_pb.js"
import postPbPkg from "grpc-ts/dist/schema/devlog/devblog/rpc/post_pb.js"
import postEntityPbPkg from "grpc-ts/dist/schema/devlog/devblog/entities/post_pb.js"
import authorPkg from "grpc-ts/dist/schema/devlog/devblog/entities/author_pb.js"
import authorLinkPkg from "grpc-ts/dist/schema/surrealdb/links/author_pb.js"
import {defineDocumentType, makeSource} from "contentlayer/source-files"
import readingTime from "reading-time"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import GithubSlugger from 'github-slugger'
import { JWTGenerator } from "./build-time/jwt"
import * as grpc from '@grpc/grpc-js'

const { PostServiceClient } = postPbServicePkg
const { CreatePostRequest  } = postPbPkg
const { Author } = authorPkg
const { AuthorLink } = authorLinkPkg
const { Post: PostEntity } = postEntityPbPkg

export const Post = defineDocumentType(() => ({
    name: "Post",
    filePathPattern: `**/*.mdx`,
    contentType: "mdx",
    fields: {
        title: {type: "string", required: true},
        publishedDate: {type: "date", required: false},
        description: {type: "string", required: true},
        image: {type: "image", required: true},
        isPublished: {type: "boolean", default: false},
        authorDisplayName: {type: "string", required: true},
        authorEmail: {type: "string", required: true},
        authorFullName: {type: "string", required: true},
        keywords: {type: "list", of: {type: "string"}},
    },
    computedFields: {
        url: {
            type: "string",
            resolve: (post) => `/posts/${post._raw.flattenedPath}`,
        },
        publicImage: {
            type: "string",
            resolve: (post) => post.image.filePath.replace("../public", ""),
        },
        readingTime: {
            type: "json",
            resolve: (doc) => readingTime(doc.body.raw),
        },
        toc: {
            type: "json",
            required: true,
            resolve: async (doc) => {
                const regulrExp = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
                const slugger = new GithubSlugger();
                const headings = Array.from(doc.body.raw.matchAll(regulrExp)).map(
                    ({groups}) => {
                        const flag = groups?.flag;
                        const content = groups?.content;

                        return {
                            level:
                                flag?.length == 1 ? "one" : flag?.length == 2 ? "two" : "three",
                            text: content,
                            slug: content ? slugger.slug(content) : undefined,
                        };
                    },
                );

                return headings;
            },
        },
        entity: {
          type: "json",
          required: true,
          resolve: async (content) => {
            return new Promise((resolve, reject) => {
              const privateKey = process.env.DEVLOGS_ACCESS_TOKEN_PRIVATE_KEY || 'this_is_unsafe_keythis_is_unsafe_keythis_is_unsafe_key'
              const request = new CreatePostRequest()
              const author = new Author()
              author.setEmail(content.authorEmail)
              author.setFullName(content.authorFullName)
              author.setDisplayName(content.authorDisplayname)

              const authorLink = new AuthorLink()
              authorLink.setObject(author)
              const postEntity = new PostEntity()
              postEntity.setTitle(content.title)
              postEntity.setDescription(content.description)
              postEntity.setAuthor(authorLink);
              postEntity.setUrl(`/posts/${content.title}`)
              request.setPost(postEntity)

              const jwtGenerate = new JWTGenerator()
              const accessKey = jwtGenerate.generateJWT([
                ['email', 'system@devlog.studio.com'],
                ['name', 'system'],
              ], { minutes: 5 }, privateKey)
              const metadata = new grpc.Metadata()
              metadata.set('authorization', accessKey.content)
              const url = process.env.DEVLOG_DEVBLOG_API_GRPC_URL || '127.0.0.1:30001'
              const client = new PostServiceClient(url, grpc.credentials.createInsecure() as any)
              client.create(request, metadata, (err, data) => {
                if (err) return reject(err)

                resolve(data?.getPost())
              })
            })
          }
        }
    },
}));

const codeOptions = {
    theme: "github-dark",
    grid: false,
};

export default makeSource({
    contentDirPath: "content",
    mdx: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
            rehypeSlug,
            [rehypeAutolinkHeadings, {behavior: "append"}],
            [rehypePrettyCode, codeOptions],
        ],
    },
    documentTypes: [Post],
});
