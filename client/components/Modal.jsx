import { useRecoilState } from "recoil";
import { modalState, tweetIdState } from "../atoms/modalAtom";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  onSnapshot,
  doc,
  addDoc,
  collection,
  serverTimestamp,
} from "@firebase/firestore";
import { db } from "../lib/firebase";
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

const dropIn = {
  hidden: {
    y: "-100vh",
    opacity: 0,
  },
  visible: {
    y: "0",
    opacity: 1,
    transition: {
      duration: 0.1,
      type: "spring",
      damping: 25,
      stiffness: 500,
    },
  },
  exit: {
    y: "100vh",
    opacity: 0,
  },
};

const Backdrop = ({ children, onClick }) => {
  return (
    <motion.div
      onClick={onClick}
      className="fixed top-0 left-0 h-full w-full bg-[#5b7083] bg-opacity-40 flex items-start justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  );
};

const Modal = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [tweetId, setTweetId] = useRecoilState(tweetIdState);
  const [tweet, setTweet] = useState();
  const [comment, setComment] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const textAreaRef = useRef(null);
  const router = useRouter();

  useEffect(
    () =>
      onSnapshot(doc(db, "tweets", tweetId), (snapshot) => {
        setTweet(snapshot.data());
      }),
    [db]
  );

  const sendComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "tweets", tweetId, "comments"), {
      comment: comment,
      username: session.user.name,
      tag: session.user.tag,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
    });

    setIsOpen(false);
    setShowEmojis(false);
    setComment("");

    router.push(`/${tweetId}`);
  };
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    // Insert emoji into textarea at the current cursor position
    let cursorPosition = textAreaRef.current.selectionStart;
    let input_arr = Array.from(comment);
    input_arr.splice(cursorPosition, 0, emoji);
    let result = input_arr.join("");
    setComment(result);
  };

  return (
    <Backdrop onClick={() => setIsOpen(false)}>
      <motion.div
        onClick={(e) => e.stopPropagation()}
        className="rounded-xl flex flex-col justify-center bg-black sm:mt-10 sm:max-w-xl sm:w-full mx-6 relative"
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="flex items-center px-1.5 py-2 border-b border-gray-700">
          <div
            className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
            onClick={() => setIsOpen(false)}
          >
            <XIcon className="h-[22px] text-white" />
          </div>
        </div>
        <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
          <div className="w-full">
            <div className="text-[#6e767d] flex gap-x-3 relative">
              <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
              <img src={tweet?.userImg} alt="" className="h-11 w-11 avatar" />
              <div>
                <div className="inline-block group">
                  <h4 className="font-bold text-[#d9d9d9] inline-block text-[15px] sm:text-base group-hover:underline">
                    {tweet?.username}
                  </h4>
                  <span className="ml-1.5 text-sm sm:text-[15px]">
                    @{tweet?.tag}
                  </span>
                </div>{" "}
                ·{" "}
                <span className="hover:underline text-sm sm:text-[15px]">
                  <Moment fromNow>{tweet?.timestamp?.toDate()}</Moment>
                </span>
                <p className="text-[#d9d9d9] text-[15px] sm:text-base">
                  {tweet?.text}
                </p>
              </div>
            </div>
            <div className="mt-7 flex space-x-3 w-full">
              <img
                src={session.user.image}
                alt=""
                className="h-11 w-11 avatar"
              />
              <div className="flex-grow mt-2">
                <textarea
                  ref={textAreaRef}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tweet your reply"
                  rows="2"
                  className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[80px]"
                />

                <div className="flex items-center justify-between pt-2.5">
                  <div className="flex items-center relative">
                    <div className="icon">
                      <PhotographIcon className="text-[#1d9bf0] h-[22px]" />
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
                  </div>
                  <button
                    className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                    type="submit"
                    onClick={sendComment}
                    disabled={!comment.trim()}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {showEmojis && (
          <Picker
            onSelect={addEmoji}
            style={{
              position: "absolute",
              top: "100%",
              maxWidth: "320px",
              borderRadius: "20px",
            }}
            theme="dark"
          />
        )}
      </motion.div>
    </Backdrop>
  );
};

export default Modal;
