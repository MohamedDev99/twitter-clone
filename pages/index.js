import Head from "next/head";
import Feed from "../components/Feed";
import SideBar from "../components/SideBar";
import { getProviders, getSession, useSession } from "next-auth/react";
import Login from "../components/Login";
import Modal from "../components/Model";
import { useRecoilValue } from "recoil";
import { modalState } from "../atoms/modalAtom";
import Widgets from "../components/Widgets";

export default function Home({ trendingResults, followResults, providers }) {
    const { data: session } = useSession();

    // * get isOpen value from global Recoil state
    const isOpen = useRecoilValue(modalState);

    if (!session) {
        return <Login providers={providers} />;
    }

    return (
        <div className="h-screen">
            <Head>
                <title>Twitter Clone</title>
                <link rel="icon" href="https://pngimg.com/uploads/twitter/twitter_PNG9.png" />
            </Head>
            <main className=" min-h-screen text-white flex max-w-[1500px] mx-auto">
                <SideBar />
                <Feed />
                <Widgets trendingResults={trendingResults} followResults={followResults} />

                {isOpen && <Modal />}
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
