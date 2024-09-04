import readingTime from "reading-time"
import rehypeAutolinkHeadings from "rehype-autolink-headings"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import {
    AuthorLink,
    Author,
    Post as PostEntity,
} from "@devlog/schema-ts";
import GithubSlugger from "github-slugger";
import { defineDocumentType, makeSource } from "contentlayer/source-files"
import fs from 'fs'

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
          resolve: (content: any) => {
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
              fs.mkdirSync('./.contentlayer/generated/bumped', {recursive: true})
              fs.writeFileSync(`./.contentlayer/generated/bumped/${content.title.toLowerCase().replaceAll(' ', '-')}.bin`, postEntity.toBinary(), 'binary')
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
