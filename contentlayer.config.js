// contentlayer.config.ts
import { defineDocumentType, makeSource } from 'contentlayer/source-files'
import readingTime from "reading-time";

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `**/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    publishedDate: { type: 'date', required: true },
    description: { type: 'string', required: true },
    image: { type: 'image', required: true },
    isPublished: { type: 'boolean', default: false },
    author: { type: 'string', required: true},
    keywords: {type: 'list', of: {type: 'string'}}
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/posts/${post._raw.flattenedPath}` },
    publicImage: {type: 'string', resolve: (post) => post.image.filePath.replace('../public', '')},
    readingTime: {
      type: "json",
      resolve: (doc) => readingTime(doc.body.raw)
    },
  },
}))

export default makeSource({ contentDirPath: 'content', documentTypes: [Post] })
