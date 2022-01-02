import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    setDoc,
} from "@firebase/firestore";
import {
    ChartBarIcon,
    ChatIcon,
    DotsHorizontalIcon,
    HeartIcon,
    ShareIcon,
    SwitchHorizontalIcon,
    TrashIcon,
} from "@heroicons/react/outline";
import { HeartIcon as HeartIconFilled, ChatIcon as ChatIconFilled } from "@heroicons/react/solid";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Moment from "react-moment";
import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
import { db } from "../firebase";

export default function Post({ post, id, postPage }) {
    const { data: session } = useSession();

    const [isOpen, setIsOpen] = useRecoilState(modalState);
    // * Post id
    const [postId, setPostId] = useRecoilState(postIdState);
    // * Comments
    const [comments, setComments] = useState([]);
    //*  posts like
    const [likes, setLikes] = useState([]);
    const [liked, setLiked] = useState(false);

    //* router
    const router = useRouter();

    // * set posts in order desc
    useEffect(
        () =>
            onSnapshot(
                query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")),
                (snapshot) => setComments(snapshot.docs)
            ),
        [db, id]
    );

    // * get likes from dataBase
    useEffect(
        () =>
            onSnapshot(collection(db, "posts", id, "likes"), (snapshot) => setLikes(snapshot.docs)),
        [db, id]
    );

    // * Check post likes
    useEffect(
        () => setLiked(likes.findIndex((like) => like.id === session?.user?.uid) !== -1),
        [likes]
    );

    const likePost = async () => {
        if (liked) {
            await deleteDoc(doc(db, "posts", id, "likes", session.user.uid));
        } else {
            await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
                username: session.user.name,
            });
        }
    };

    return (
        <div
            className={`flex p-4 cursor-pointer border-b border-gray-700 ${
                !postPage && "hover:bg-gray-500/10 transition duration-300"
            }`}
            onClick={() => router.push(`/${id}`)}>
            {!postPage && <img src={post?.userImg} alt="" className="h-9 w-9 mr-4 rounded-full" />}

            <div className="w-full flex flex-col space-y-2">
                <div className={`flex ${!postPage && "justify-between"}`}>
                    {postPage && (
                        <img src={post?.userImg} alt="" className="h-9 w-9 mr-4 rounded-full" />
                    )}
                    <div>
                        <div className="inline-block text-[1rem] to-gray-500 space-x-1 group">
                            <h4
                                className={`font-bold text-[15px] sm:text-base text-white group-hover:underline ${
                                    !postPage && "inline-block"
                                }`}>
                                {post?.username}
                            </h4>
                            <span className={`text-sm sm:text-[15px] ${!postPage && "ml-1.5"}`}>
                                @{post?.tag}
                            </span>
                        </div>{" "}
                        ·{" "}
                        <span className="hover:underline text-sm sm:text-[15px]">
                            <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                        </span>
                        {!postPage && (
                            <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                                {post?.text}
                            </p>
                        )}
                    </div>
                    <div className="icon group flex-shrink-0 ml-auto">
                        <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
                    </div>
                </div>
                {postPage && (
                    <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">{post?.text}</p>
                )}
                <img
                    src={post?.image}
                    alt=""
                    className="mr-2 rounded-2xl max-h-[700px] object-cover border-2 border-gray-600"
                />
                <div className={`text-white flex justify-around w-full ${postPage && "ml-auto"}`}>
                    {/* Comments Btn */}
                    <div
                        className="flex items-center space-x-1 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            setPostId(id);
                            setIsOpen(true);
                        }}>
                        <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
                            <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
                        </div>
                        {comments.length > 0 && (
                            <span className="group-hover:text-[#1d9bf0] text-sm">
                                {comments.length}
                            </span>
                        )}
                    </div>
                    {/* delete Btn or Retweet Btn */}
                    {session.user.uid === post?.id ? (
                        <div
                            className="flex items-center space-x-1 group"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteDoc(doc(db, "posts", id));
                                router.push("/");
                            }}>
                            <div className="icon group-hover:bg-red-600/10">
                                <TrashIcon className="h-5 group-hover:text-red-600" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-1 group">
                            <div className="icon group-hover:bg-green-500/10">
                                <SwitchHorizontalIcon className="h-5 group-hover:text-green-500" />
                            </div>
                        </div>
                    )}
                    {/* Likes Btn */}
                    <div
                        className="flex items-center space-x-1 group"
                        onClick={(e) => {
                            e.stopPropagation();
                            likePost();
                        }}>
                        <div className="icon group-hover:bg-pink-600/10">
                            {liked ? (
                                <HeartIconFilled className="h-5 text-pink-600" />
                            ) : (
                                <HeartIcon className="h-5 group-hover:text-pink-600" />
                            )}
                        </div>
                        {likes.length > 0 && (
                            <span
                                className={`group-hover:text-pink-600 text-sm ${
                                    liked && "text-pink-600"
                                }`}>
                                {likes.length}
                            </span>
                        )}
                    </div>
                    {/* share Btn */}
                    <div className="icon hover:bg-green-500/20 transition duration-300 group">
                        <ShareIcon className="h-5 group-hover:text-green-500" />
                    </div>
                    {/* <div className="icon group">
                        <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
                    </div> */}
                </div>
            </div>
        </div>
    );
}
