import { useCurrectUser } from "@/hooks/user";
import { IconDots, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import { BsTwitterX } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import {
  IoMailOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoPerson,
  IoSearch,
} from "react-icons/io5";
import { MdHomeFilled } from "react-icons/md";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/client/api";
import { VerifyGoogleAuthToken } from "@/graphql/query/user";
import Link from "next/link";
import Component from "./Popover";
import { Button } from "./ui/button";
import { Popover, PopoverContent } from "./ui/popover";
import PostDialog from "./Dialog";
import Login from "./Login";

interface LayoutProps {
  children: React.ReactNode;
}
interface TwitterSidebar {
  name: string;
  icon: React.ReactNode;
  link: string;
}
const TwitterLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useCurrectUser();
  const SidebarMenu: TwitterSidebar[] = useMemo(
    () => [
      {
        name: "Home",
        icon: <MdHomeFilled />,
        link: "/",
      },
      {
        name: "Explore",
        icon: <IoSearch />,
        link: "/explore",
      },
      {
        name: "Notification",
        icon: <IoNotificationsOutline />,
        link: "/notification",
      },
      {
        name: "Messages",
        icon: <IoMailOutline />,
        link: "/messages",
      },
      {
        name: "Communities",
        icon: <IoPeopleOutline />,
        link: "/communities",
      },
      {
        name: "Premium",
        icon: <BsTwitterX />,
        link: "/",
      },
      {
        name: "Profile",
        icon: <IoPerson />,
        link: `${user?.id}`,
      },
      {
        name: "More",
        icon: <CiCircleMore />,
        link: "/more",
      },
    ],
    [user?.id]
  );

  return (
    <div className="grid grid-cols-12 h-screen w-screen lg:px-32 md:px-10 px-0">
      <div className="hidden sm:flex sm:col-span-3 text-white flex-col justify-between">
        <div className="flex justify-start p-3 flex-col">
          <div className="hover:bg-zinc-900 cursor-pointer rounded-full p-2 h-fit w-fit text-2xl transition-all">
            <FaXTwitter />
          </div>
          <div className="mt-5 text-lg font-semibold">
            <ul>
              {SidebarMenu.map((item) => (
                <Link href={item.link}>
                  <li
                    className="list-none flex items-center gap-4 hover:bg-zinc-900 w-fit rounded-full px-2 py-2 transition-all cursor-pointer"
                    key={item.name}
                  >
                    <span className="text-[1.8rem] p-1 sm:text-[1.5rem]">
                      {item.icon}
                    </span>
                    <span className="sm:block hidden">{item.name}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <div className="hidden sm:block">
            <PostDialog />
          </div>
        </div>

        {user && <Component user={user} />}
      </div>
      <div className="block sm:hidden">
        <PostDialog />
      </div>
      <div className="col-span-12 sm:col-span-9 md:col-span-6 text-white border-x h-screen border-gray-500">
        {children}
      </div>
      <div className="col-span-3 text-white dark md:block hidden m-5 min-w-48">
        {!user && <Login />}
        <div className="my-3">
          <Card>
            <CardHeader>
              <CardTitle>What happeening</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TwitterLayout;
