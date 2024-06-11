// contentlayer.config.ts
import {defineDocumentType, makeSource} from "contentlayer/source-files";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import GithubSlugger from 'github-slugger'

export const Post = defineDocumentType(() => ({
    name: "Post",
    filePathPattern: `**/*.mdx`,
    contentType: "mdx",
    fields: {
        title: {type: "string", required: true},
        publishedDate: {type: "date", required: true},
        description: {type: "string", required: true},
        image: {type: "image", required: true},
        isPublished: {type: "boolean", default: false},
        author: {type: "string", required: true},
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
