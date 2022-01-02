import {
    PhotographIcon,
    XIcon,
    CalendarIcon,
    ChartBarIcon,
    EmojiHappyIcon,
} from "@heroicons/react/outline";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { useRef, useState } from "react";
import { db, storage } from "../firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import { signOut, useSession } from "next-auth/react";

function Input() {
    const { data: session } = useSession();

    // * get input value and store it in a state variable
    const [input, setInput] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false);
    const [loading, setLoading] = useState(false);

    // * ref to input element
    const filePickerRef = useRef(null);

    // * send post to firbase
    const sendPost = async () => {
        if (loading) return;
        setLoading(true);

        const docRef = await addDoc(collection(db, "posts"), {
            id: session.user.uid,
            username: session.user.name,
            userImg: session.user.image,
            tag: session.user.tag,
            text: input,
            timestamp: serverTimestamp(),
        });

        const imageRef = ref(storage, `posts/${docRef.id}/image`);
        // * upload an image to firebase
        if (selectedFile) {
            await uploadString(imageRef, selectedFile, "data_url").then(async () => {
                const downloadUrl = await getDownloadURL(imageRef);
                await updateDoc(doc(db, "posts", docRef.id), {
                    image: downloadUrl,
                });
            });
        }

        setLoading(false);
        setInput("");
        setSelectedFile(null);
        setShowEmojis(false);
    };

    // * image for post it
    const addImageToPost = (e) => {
        const reader = new FileReader();
        if (e.target.files[0]) {
            reader.readAsDataURL(e.target.files[0]);
        }

        reader.onloadend = (readerEvent) => {
            setSelectedFile(readerEvent.target.result);
        };
    };

    // * add emoji with a string
    const addEmoji = (e) => {
        let sym = e.unified.split("-");
        let codesArray = [];
        sym.forEach((el) => codesArray.push("0x" + el));
        let emoji = String.fromCodePoint(...codesArray);
        setInput(input + emoji);
    };

    return (
        <div
            className={`border-b scrollbar-hide border-gray-700 p-3 flex space-x-3 overflow-y-scroll ${
                loading && "opacity-60"
            }`}>
            <img
                className="w-10 h-10 rounded-full cursor-pointer"
                src={session.user.image}
                alt=""
            />
            <div className="w-full divide-y divide-gray-700">
                <div className={`${selectedFile && "pb-7"} ${input && "space-y-2.5"}`}>
                    <textarea
                        className="placeholder-gray-600 font-semibold text-lg tracking-wider w-full resize-none max-h-16 rounded bg-transparent outline-none"
                        placeholder="What's happening ?"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        rows="2"
                    />
                </div>
                {selectedFile && (
                    <div className="relative">
                        <div
                            onClick={() => setSelectedFile(null)}
                            className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75 rounded-full flex items-center justify-center left-1 top-1 cursor-pointer">
                            <XIcon className="h-5" />
                        </div>
                        <img
                            src={selectedFile}
                            alt=""
                            className="rounded-2xl max-h-80 object-contain"
                        />
                    </div>
                )}
                {!loading && (
                    <div className="flex items-center justify-between pt-2.5">
                        <div className="flex items-center space-x-3">
                            <div className="icon" onClick={() => filePickerRef.current.click()}>
                                <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
                                <input
                                    type="file"
                                    hidden
                                    onChange={addImageToPost}
                                    ref={filePickerRef}
                                />
                            </div>
                            <div className="icon rotate-90">
                                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>
                            <div className="icon" onClick={() => setShowEmojis(!showEmojis)}>
                                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>
                            <div className="icon">
                                <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
                            </div>
                            {showEmojis && (
                                <Picker
                                    onSelect={addEmoji}
                                    style={{
                                        position: "absolute",
                                        marginTop: "465px",
                                        marginLeft: -40,
                                        maxWidth: "300px",
                                        borderRadius: "20px",
                                    }}
                                    theme="dark"
                                />
                            )}
                        </div>
                        <button
                            className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                            disabled={!input.trim() && !selectedFile}
                            onClick={sendPost}>
                            Tweet
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Input;
