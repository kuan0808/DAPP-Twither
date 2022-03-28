import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  ChartBarIcon,
  ChatIcon,
  DotsHorizontalIcon,
  HeartIcon,
  ShareIcon,
  SwitchHorizontalIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import {
  HeartIcon as HeartIconFilled,
  ChatIcon as ChatIconFilled,
} from "@heroicons/react/solid";
import Moment from "react-moment";
import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "@firebase/firestore";

import { modalState, tweetIdState } from "../atoms/modalAtom";
import { db } from "../lib/firebase";

const Tweet = ({ id, tweet, tweetPage }) => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useRecoilState(modalState);
  const [tweetId, setTweetId] = useRecoilState(tweetIdState);
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const router = useRouter();

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "tweets", id, "comments"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => setComments(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(
    () =>
      onSnapshot(collection(db, "tweets", id, "likes"), (snapshot) =>
        setLikes(snapshot.docs)
      ),
    [db, id]
  );

  useEffect(
    () =>
      setLiked(
        likes.findIndex((like) => like.id === session?.user?.uid) !== -1
      ),
    [likes]
  );

  const likeTweet = async () => {
    if (liked) {
      await deleteDoc(doc(db, "tweets", id, "likes", session.user.uid));
    } else {
      await setDoc(doc(db, "tweets", id, "likes", session.user.uid), {
        username: session.user.name,
      });
    }
  };

  return (
    <div
      className="p-3 flex cursor-pointer border-b border-gray-700"
      onClick={() => router.push(`/${id}`)}
    >
      {!tweetPage && (
        <img src={tweet?.userImg} alt="" className="w-11 h-11 avatar mr-4" />
      )}
      <div className="flex flex-col space-y-2 w-full">
        <div className={clsx("flex", !tweetPage && "justify-between")}>
          {tweetPage && (
            <img
              className="h-11 w-11 avatar mr-4"
              src={tweet?.userImg}
              alt=""
            />
          )}
          <div className="text-[#6e767d]">
            <div className="inline-block group">
              <h4
                className={clsx(
                  "font-bold text-[15px] sm:text-base text-[#d9d9d9] group-hover:underline",
                  !tweetPage && "inline-block"
                )}
              >
                {tweet?.username}
              </h4>
              <span
                className={clsx(
                  "text-sm sm:text-[15px]",
                  !tweetPage && "ml-1.5"
                )}
              >
                @{tweet?.tag}
              </span>
            </div>{" "}
            ·{" "}
            <span className="hover:underline text-sm sm:text-[15px]">
              <Moment fromNow>{tweet?.timestamp?.toDate()}</Moment>
            </span>
            {!tweetPage && (
              <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
                {tweet?.text}
              </p>
            )}
          </div>
          <div className="icon group flex-shrink-0 ml-auto">
            <DotsHorizontalIcon className="h-5 text-[#6e767d] group-hover:text-[#1d9bf0]" />
          </div>
        </div>
        {tweetPage && (
          <p className="text-[#d9d9d9] text-[15px] sm:text-base mt-0.5">
            {tweet?.text}
          </p>
        )}
        <img
          className="rounded-2xl max-h-[700px] object-cover mr-2"
          src={tweet?.image}
          alt=""
        />
        <div
          className={clsx(
            "text-[#6e767d] flex justify-between w-10/12",
            tweetPage && "mx-auto"
          )}
        >
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              setTweetId(id);
              setIsOpen(true);
            }}
          >
            <div className="icon group-hover:bg-[#1d9bf0] group-hover:bg-opacity-10">
              <ChatIcon className="h-5 group-hover:text-[#1d9bf0]" />
            </div>
            {comments.length > 0 && (
              <span className="group-hover:text-[#1d9bf0] text-sm">
                {comments.length}
              </span>
            )}
          </div>
          {session.user.uid === tweet?.id ? (
            <div
              className="flex items-center space-x-1 group"
              onClick={(e) => {
                e.stopPropagation();
                deleteDoc(doc(db, "tweets", id));
                router.push("/");
              }}
            >
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
          <div
            className="flex items-center space-x-1 group"
            onClick={(e) => {
              e.stopPropagation();
              likeTweet();
            }}
          >
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
                }`}
              >
                {likes.length}
              </span>
            )}
          </div>
          <div className="icon group">
            <ShareIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
          <div className="icon group">
            <ChartBarIcon className="h-5 group-hover:text-[#1d9bf0]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
