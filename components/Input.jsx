import { useRef, useState } from "react";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "@firebase/firestore";
import { getDownloadURL, ref, uploadString } from "@firebase/storage";
import clsx from "clsx";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { useSession } from "next-auth/react";

import { db } from "../lib/firebase";

const Input = () => {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [loading, setLoading] = useState(false);

  const filePickerRef = useRef(null);
  const textAreaRef = useRef(null);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files.length) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setSelectedFile(reader.result);
      };
    }
  };
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    // Insert emoji into textarea at the current cursor position
    let cursorPosition = textAreaRef.current.selectionStart;
    let input_arr = Array.from(input);
    input_arr.splice(cursorPosition, 0, emoji);
    let result = input_arr.join("");
    setInput(result);
  };

  const submitPost = async () => {
    if (loading) return;
    setLoading(true);
    setShowEmojis(false);

    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      username: session.user.name,
      userImg: session.user.image,
      tag: session.user.tag,
      text: input,
      timestamp: serverTimestamp(),
    });

    const imageRef = ref(storage, `posts/${docRef.id}/image`);

    if (selectedFile) {
      await uploadString(imageRef, selectedFile, "data_url").then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setLoading(false);
    setInput("");
    setSelectedFile(null);
  };

  return (
    <div
      className={clsx(
        "border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll scrollbar-hide",
        { "opacity-60": loading }
      )}
    >
      <img
        className="h-11 w-11 rounded-full object-cover cursor-pointer"
        src={session.user.image}
        alt=""
      />
      <div className="w-full divide-y divide-gray-700">
        {/* TODO: Make a spinner while loading */}
        <div className={clsx({ "pb-7": selectedFile, "space-y-2.5": input })}>
          <textarea
            className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]"
            value={input}
            rows="2"
            placeholder="What's happening?"
            onChange={(e) => setInput(e.target.value)}
            ref={textAreaRef}
          />
          {selectedFile && (
            <div className="relative">
              <div
                onClick={() => setSelectedFile(null)}
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75
              rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
              >
                <XIcon className="h-5 text-white" />
              </div>
              <img
                className="rounded-2xl max-h-80 object-contain"
                src={selectedFile}
                alt=""
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center">
              <div
                className="icon"
                onClick={() => filePickerRef.current.click()}
              >
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
              <div
                className="icon"
                onClick={() => setShowEmojis((prev) => !prev)}
              >
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
                    maxWidth: "320px",
                    borderRadius: "20px",
                  }}
                  theme="dark"
                />
              )}
            </div>
            <button
              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
              disabled={!input.trim() && !selectedFile}
              onClick={submitPost}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
