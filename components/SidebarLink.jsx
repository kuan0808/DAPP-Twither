import React from "react";
import { useRouter } from "next/router";
import clsx from "clsx";

const SidebarLink = ({ text, Icon, active }) => {
  const router = useRouter();
  return (
    <div
      className={clsx(
        "text-[#d9d9d9] flex items-center justify-center xl:justify-start text-xl space-x-3 hoverAnimation",
        { "font-bold text-white": active }
      )}
      onClick={() => active && router.push("/")}
    >
      <Icon className="h-7" />
      <span className="hidden xl:inline">{text}</span>
    </div>
  );
};

export default SidebarLink;
