import { getSession } from "next-auth/react";
import Head from "next/head";

import { Layout, Feed } from "../components";

export default function Home({ trendingResults, followResults }) {
  return (
    <div>
      <Head>
        <title>Twither</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout trendingResults={trendingResults} followResults={followResults}>
        <Feed />
      </Layout>
    </div>
  );
}
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
