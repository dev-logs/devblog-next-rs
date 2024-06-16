"use client";

import {allPosts} from "contentlayer/generated";
import {MdxContent} from "../mdx";
import {TableOfContent} from "../table-of-content";
import {PostTitle} from "../title";
import {PostFooter} from "@/app/posts/footer";

const discussions = [
    {
        id: 1,
        user: 'Floyd Miles',
        avatar: 'https://randomuser.me/api/portraits/men/86.jpg',
        content: 'Actually, now that I try out the links on my message, above, none of them take me to the secure site. Only my shortcut on my desktop, which I created years ago.',
        reactions: [],
        timestamp: '6 hours ago'
    },
    {
        id: 2,
        user: 'Jane Cooper',
        avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
        content: 'I have also faced similar issues. The links do not redirect properly.',
        reactions: [],
        timestamp: '2 hours ago'
    },
    {
        id: 3,
        user: 'Albert Flores',
        avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
        content: 'Before installing this plugin please put back again your WordPress and site URL back to http.',
        reactions: [],
        timestamp: '1 hour ago'
    },
    {
        id: 4,
        user: 'Bessie Cooper',
        avatar: 'https://randomuser.me/api/portraits/women/74.jpg',
        content: 'Hi @Albert Flores. Thanks for your reply.',
        reactions: [],
        timestamp: '18 minutes ago'
    },
    {
        id: 5,
        user: 'Cody Fisher',
        avatar: 'https://randomuser.me/api/portraits/men/11.jpg',
        content: 'Is anyone else experiencing problems with the site?',
        reactions: [],
        timestamp: '10 minutes ago'
    }
];

export default function PostPageContent(props: any) {
    return <div className={"relative h-screen w-screen overflow-hidden"}>
        <div className={"z-0 h-full w-full top-0 left-0"}>
        </div>
        <div className={"z-10 absolute h-screen w-screen top-0 left-0 overflow-scroll"}>
            <HtmlDom {...props}/>
        </div>
    </div>
}

function HtmlDom(props: any = {}) {
    const {
        params: {slug}
    } = props;

    const post = allPosts.find((post) => post._raw.flattenedPath === slug)!;

    return (
        <div className={"h-full w-full mt-10"}>
            <div className="w-screen flex flex-col">
                <PostTitle post={post}/>
                <div className="grid grid-cols-12 w-full lg:pb-56 pb-14 backdrop-blur-3xl">
                    <div
                        className="lg:col-span-3 col-span-full lg:items-start items-center flex flex-row h-fit lg:sticky lg:left-5 lg:top-20 lg:justify-start justify-center">
                        <TableOfContent post={post}/>
                    </div>
                    <div
                        className="flex lg:justify-start flex-col lg:items-start lg:pl-16 items-center  lg:col-span-9 col-span-full mt-8">
                        <article className="prose 2xl:prose-xl prose-lg mb-10 w-full p-8 rounded-xl backdrop-blur-lg">
                            <MdxContent post={post}/>
                        </article>
                    </div>
                </div>
                <div className="w-screen h-full">
                    <PostFooter discussions={discussions}/>
                </div>
            </div>
        </div>
    );
}
