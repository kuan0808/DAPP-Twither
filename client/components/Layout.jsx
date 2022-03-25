import { useSession } from "next-auth/react";
import { useRecoilState } from "recoil";

import { modalState } from "../atoms/modalAtom";
import Modal from "./Modal";
import Sidebar from "./Sidebar";
import Widgets from "./Widgets";

const Layout = ({ trendingResults, followResults, children }) => {
  const { data: session } = useSession({ required: true });
  const [isOpen, setIsOpen] = useRecoilState(modalState);

  return (
    <div>
      <main className="bg-black min-h-screen flex max-w-[1500px] mx-auto">
        <Sidebar />
        {children}
        <Widgets
          trendingResults={trendingResults}
          followResults={followResults}
        />

        {isOpen && <Modal />}
      </main>
    </div>
  );
};

export default Layout;
