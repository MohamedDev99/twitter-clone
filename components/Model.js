import { useRecoilState } from "recoil";
import { modalState, postIdState } from "../atoms/modalAtom";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { onSnapshot, doc, addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import {
    CalendarIcon,
    ChartBarIcon,
    EmojiHappyIcon,
    PhotographIcon,
    XIcon,
} from "@heroicons/react/outline";
import { useRouter } from "next/router";
import Moment from "react-moment";
import { Picker } from "emoji-mart";

function Modal() {
    const { data: session } = useSession();

    // * display the model
    const [isOpen, setIsOpen] = useRecoilState(modalState);
    // * Post Id
    const [postId, setPostId] = useRecoilState(postIdState);
    const [post, setPost] = useState(null);

    // * add comment
    const [comment, setComment] = useState("");
    // const [showEmojis, setShowEmojis] = useState(false);

    // * router
    const router = useRouter();

    // * retrieve the post by postId from db (Firebase/Firestore)
    useEffect(
        () =>
            onSnapshot(doc(db, "posts", postId), (snapshot) => {
                setPost(snapshot.data());
            }),
        [db]
    );

    // * send comment to DB
    const sendComment = async (e) => {
        e.preventDefault();

        // * Comment Details
        await addDoc(collection(db, "posts", postId, "comments"), {
            comment: comment,
            username: session.user.name,
            tag: session.user.tag,
            userImg: session.user.image,
            timestamp: serverTimestamp(),
        });

        // * set Reply Section empty
        setIsOpen(false);
        setComment("");
        // setShowEmojis(false);

        router.push(`/${postId}`);
    };

    // * add emoji with a string
    const addEmoji = (e) => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setComment(comment + emoji);
    };

    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog as="div" className="fixed z-50 inset-0 pt-8" onClose={setIsOpen}>
                <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0">
                        <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <div className="text-white inline-block align-bottom bg-black rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
                            {/* close btn */}
                            <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
                                <div
                                    onClick={() => setIsOpen(false)}
                                    className="w-9 h-9 flex items-center justify-center xl:px-0 hoverAnimation">
                                    <XIcon className="h-[22px]" />
                                </div>
                            </div>
                            <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
                                <div className="w-full">
                                    <div className="text-[#6e767d] flex gap-x-3 relative">
                                        <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                                        <img
                                            className="h-11 w-11 rounded-full"
                                            src={post?.userImg}
                                            alt=""
                                        />
                                        <div>
                                            <div className="inline-block group">
                                                <h4 className="text-white front-bold inline-block text-[15px] sm:text-base hover:underline">
                                                    {post?.username}
                                                </h4>
                                                <span className="ml-1.5 text-sm sm:text-[15px]">
                                                    @{post?.tag}
                                                </span>{" "}
                                                ·{" "}
                                                <span className="hover:underline text-sm sm:text-[15px]">
                                                    <Moment fromNow>
                                                        {post?.timestamp?.toDate()}
                                                    </Moment>
                                                </span>
                                                <p className="text-[15px] sm:text-base">
                                                    {post?.text}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Reply Section */}
                                    <div className="mt-7 space-x-3 flex w-full">
                                        <img
                                            className="h-11 w-11 rounded-full"
                                            src={session?.user.image}
                                            alt=""
                                        />
                                        <div className="flex-grow mt-2">
                                            <textarea
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Tweet your reply"
                                                rows="2"
                                                className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                                            />
                                            <div className="flex items-center justify-between pt-2.5">
                                                <div className="flex items-center">
                                                    <div className="icon">
                                                        <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
                                                    </div>

                                                    <div className="icon rotate-90">
                                                        <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                                                    </div>

                                                    <div
                                                        className="icon"
                                                        onClick={() => setShowEmojis(!showEmojis)}>
                                                        <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                                                    </div>

                                                    <div className="icon">
                                                        <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                                                    </div>
                                                    {/* {showEmojis && (
                                                        <Picker
                                                            onSelect={addEmoji}
                                                            style={{
                                                                position: "absolute",
                                                                marginTop: "465px",
                                                                marginLeft: -40,
                                                                maxWidth: "300px",
                                                                borderRadius: "20px",
                                                                zIndex: 99,
                                                            }}
                                                            theme="dark"
                                                        />
                                                    )} */}
                                                </div>
                                                <button
                                                    className="bg-[#427aa0] rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-70 disabled:cursor-default"
                                                    type="submit"
                                                    onClick={sendComment}
                                                    disabled={!comment.trim()}>
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default Modal;
