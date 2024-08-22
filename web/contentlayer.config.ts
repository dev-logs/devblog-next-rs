import readingTime from "reading-time"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import {
    AuthorLink,
    Author,
    CreatePostRequest,
    CreatePostResponse,
    Post as PostEntity,
    PostService
} from "@devlog/schema-ts";
import {createGrpcTransport} from "@connectrpc/connect-node";
import {createPromiseClient} from "@connectrpc/connect";
import GithubSlugger from "github-slugger";
import {JWTGenerator} from "./build-time/jwt";
import { defineDocumentType, makeSource } from "contentlayer/source-files"

const url = (post: any) => {
  return `/posts/${post.title.toLowerCase().replaceAll(' ', '-')}`
}

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
            resolve: (post: any) => url(post),
        },
        slug: {
          type: "string",
          required: true,
          resolve: (post: any) => post.title.toLowerCase().replaceAll(' ', '-')
        },
        publicImage: {
            type: "string",
            resolve: (post: any) => post.image.filePath.replace("../public", ""),
        },
        readingTime: {
            type: "json",
            resolve: (doc: any) => readingTime(doc.body.raw),
        },
        toc: {
            type: "json",
            required: true,
            resolve: async (doc: any) => {
                //@ts-ignore
                const regulrExp = /\n(?<flag>#{1,6})\s+(?<content>.+)/g;
                const slugger = new GithubSlugger();
                const headings = Array.from(doc.body.raw.matchAll(regulrExp)).map(
                    ({groups}: any) => {
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
          resolve: async (content: any) => {
              const privateKey = process.env.DEVLOGS_ACCESS_TOKEN_PRIVATE_KEY || 'this_is_unsafe_keythis_is_unsafe_keythis_is_unsafe_key'
              const request = new CreatePostRequest()
              const author = new Author()
              author.email = content.authorEmail
              author.fullName = content.authorFullName
              author.displayName = content.authorDisplayName

              const authorLink = new AuthorLink()
              authorLink.link = {value: author, case: 'object'}
              const postEntity = new PostEntity()
              postEntity.title = content.title
              postEntity.description = content.description
              postEntity.author = authorLink
              postEntity.url = url(content)
              request.post = postEntity

              const jwtGenerate = new JWTGenerator()
              const accessKey = jwtGenerate.generateJWT([
                  ['email', 'system@devlog.studio'],
                  ['name', 'system'],
              ],

              {minutes: 5}, privateKey)

              const connectionUrl = process.env.DEVLOG_DEVBLOG_API_GRPC_URL || 'http://127.0.0.1:30001'
              const connectTransport = createGrpcTransport({
                  baseUrl: connectionUrl,
                  httpVersion: '2'
              })

              const client = createPromiseClient(PostService, connectTransport)
              const response = await client.create(request, {headers: [['authorization', accessKey.content]]}) as CreatePostResponse
              console.log(`Migrated post ${content.title}`, response)
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
            //@ts-ignore
            [rehypePrettyCode, codeOptions],
        ],
    },
    documentTypes: [Post],
});
