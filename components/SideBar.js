import Image from "next/image";
import { HomeIcon } from "@heroicons/react/solid";
import {
    HashtagIcon,
    BellIcon,
    InboxIcon,
    BookmarkIcon,
    ClipboardListIcon,
    UserIcon,
    DotsCircleHorizontalIcon,
    DotsHorizontalIcon,
} from "@heroicons/react/outline";
import SidebarLink from "./SidebarLink";
import { useSession, signOut } from "next-auth/react";

function SideBar() {
    const { data: session } = useSession();

    return (
        <div className="hidden sm:flex flex-col items-center xl:items-start xl:w-[340px] p-2 fixed h-full">
            <div className="flex items-center justify-center w-14 h-14 p-0 xl:ml-24 hoverAnimation">
                <Image width={30} height={30} src="https://rb.gy/ogau5a" alt="" />
            </div>
            <div className="space-y-2.5 mt-4 mb-2.5 xl:ml-24">
                <SidebarLink text="Home" Icon={HomeIcon} active />
                <SidebarLink text="Explore" Icon={HashtagIcon} />
                <SidebarLink text="Notifications" Icon={BellIcon} />
                <SidebarLink text="Messages" Icon={InboxIcon} />
                <SidebarLink text="Bookmarks" Icon={BookmarkIcon} />
                <SidebarLink text="Lists" Icon={ClipboardListIcon} />
                <SidebarLink text="Profile" Icon={UserIcon} />
                <SidebarLink text="More" Icon={DotsCircleHorizontalIcon} />
            </div>
            <button className="hidden xl:inline ml-auto xl:ml-24 text-[#d9d9d9] bg-[#1d9bf0] rounded-full w-56 h-[52px] font-bold text-lg tracking-[.12rem] hover:bg-blue-500 ">
                Tweet
            </button>

            <div
                onClick={() => signOut()}
                className="flex gap-2 items-center justify-center hoverAnimation mt-auto xl:ml-auto xl:-mr-2.5 py-2">
                <img className="w-9 h-9 rounded-full" src={session.user.image} alt="" />
                <div className="hidden xl:inline leading-5 tracking-wider">
                    <h4 className="font-bold">{session.user.name}</h4>
                    <p className="text-[#6e767d]">@{session.user.tag}</p>
                </div>
                <DotsHorizontalIcon className="h-5 hidden xl:inline ml-10" />
            </div>
        </div>
    );
}

export default SideBar;
