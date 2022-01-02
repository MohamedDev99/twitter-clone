import { collection, doc, onSnapshot, orderBy, query } from "@firebase/firestore";
import { getProviders, getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { modalState } from "../atoms/modalAtom";
// import Widgets from "../components/Widgets";
import Post from "../components/Post";
import { db } from "../firebase";
import { ArrowLeftIcon } from "@heroicons/react/solid";
import Head from "next/head";
import SideBar from "../components/SideBar";
import Login from "../components/Login";
import Comment from "../components/Comment";
import Model from "../components/Model";
import Widgets from "../components/Widgets";

export default function PostPage({ trendingResults, followResults, providers }) {
    //* get user session
    const { data: session } = useSession();
    // * get isOpen value from global Recoil state
    const isOpen = useRecoilValue(modalState);
    // * get router and retrieve id from url
    const router = useRouter();
    const { id } = router.query;

    // ? set and get post/comments
    const [post, setPost] = useState();
    const [comments, setComments] = useState([]);

    // * get post details with id
    useEffect(
        () =>
            onSnapshot(doc(db, "posts", id), (snapshot) => {
                setPost(snapshot.data());
            }),
        [db]
    );

    // * get components
    useEffect(
        () =>
            onSnapshot(
                query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")),
                (snapshot) => setComments(snapshot.docs)
            ),
        [db, id]
    );

    // * login
    if (!session) return <Login providers={providers} />;

    return (
        <div className="h-screen">
            <Head>
                <title>
                    {post?.username} on Twitter: "
                    {post?.text.length <= 15 ? post?.text : post?.text.slice(0, 15) + " ..."}"
                </title>
                <link rel="icon" href="https://pngimg.com/uploads/twitter/twitter_PNG9.png" />
            </Head>
            <main className=" min-h-screen text-white flex max-w-[1500px] mx-auto">
                <SideBar />
                <div className=" flex-grow border-l border-r border-gray-800 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
                    <div className="bg-black flex items-center gap-x-4 text-xl font-semibold py-2 px-1.5 sticky top-0 z-50 border-b border-gray-700">
                        <div
                            onClick={() => router.push("/")}
                            className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0">
                            <ArrowLeftIcon className="h-5" />
                        </div>
                        Tweet
                    </div>
                    <Post id={id} post={post} postPage />
                    {comments && (
                        <div className="pb-72">
                            {comments.map((comment) => (
                                <Comment
                                    key={comment.id}
                                    id={comment.id}
                                    comment={comment.data()}
                                    postId={id}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <Widgets trendingResults={trendingResults} followResults={followResults} />

                {isOpen && <Model />}
            </main>
        </div>
    );
}

// * get dynamic informations from endpoints
export async function getServerSideProps(context) {
    const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV").then((res) => res.json());
    const followResults = await fetch("https://jsonkeeper.com/b/WWMJ").then((res) => res.json());
    const providers = await getProviders();
    const session = await getSession(context);

    return {
        props: {
            trendingResults,
            followResults,
            providers,
            session,
        },
    };
}
