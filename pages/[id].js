import Head from "next/head";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "@firebase/firestore";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/solid";

import { Comment, Layout, Tweet } from "../components";
import { db } from "../lib/firebase";

function TweetPage({ trendingResults, followResults }) {
  const [tweet, setTweet] = useState();
  const [comments, setComments] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(
    () =>
      onSnapshot(doc(db, "tweets", id), (snapshot) => {
        setTweet(snapshot.data());
      }),
    [db]
  );

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
  return (
    <div>
      <Head>
        <title>
          {tweet?.username} on Twitter: "{tweet?.text}"
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout trendingResults={trendingResults} followResults={followResults}>
        <div className="flex-grow border-l border-r border-gray-700 max-w-2xl sm:ml-[73px] xl:ml-[370px]">
          <div className="flex items-center px-1.5 py-2 border-b border-gray-700 text-[#d9d9d9] font-semibold text-xl gap-x-4 sticky top-0 z-50 bg-black">
            <div
              className="hoverAnimation w-9 h-9 flex items-center justify-center xl:px-0"
              onClick={() => router.push("/")}
            >
              <ArrowLeftIcon className="h-5 text-white" />
            </div>
            Tweet
          </div>

          <Tweet id={id} tweet={tweet} tweetPage />
          {comments.length > 0 && (
            <div className="pb-72">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  id={comment.id}
                  comment={comment.data()}
                />
              ))}
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
}

export default TweetPage;

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }
  const trendingResults = await fetch(
    "https://jsonkeeper.com/b/NKEV"
  ).then((res) => res.json());
  const followResults = await fetch(
    "https://jsonkeeper.com/b/WWMJ"
  ).then((res) => res.json());
  return {
    props: {
      trendingResults,
      followResults,
      session,
    },
  };
};
