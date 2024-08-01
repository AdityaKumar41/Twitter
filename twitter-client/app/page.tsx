import Image from "next/image";
import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import { MdHomeFilled } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import {
  IoMailOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoPerson,
} from "react-icons/io5";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { IoSearch } from "react-icons/io5";
import FeedCard from "@/components/feedCard/feedcard";
export default function Home() {
  interface TwitterSidebar {
    name: string;
    icon: React.ReactNode;
  }
  const SidebarMenu: TwitterSidebar[] = [
    {
      name: "Home",
      icon: <MdHomeFilled />,
    },
    {
      name: "Explore",
      icon: <IoSearch />,
    },
    {
      name: "Notification",
      icon: <IoNotificationsOutline />,
    },
    {
      name: "Messages",
      icon: <IoMailOutline />,
    },
    {
      name: "Communities",
      icon: <IoPeopleOutline />,
    },
    {
      name: "Premium",
      icon: <BsTwitterX />,
    },
    {
      name: "Profile",
      icon: <IoPerson />,
    },
    {
      name: "More",
      icon: <CiCircleMore />,
    },
  ];
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-32">
        <div className="col-span-3  text-white flex justify-start p-3 flex-col">
          <div className="hover:bg-zinc-900 cursor-pointer rounded-full p-2 h-fit w-fit text-2xl transition-all">
            <FaXTwitter />
          </div>
          <div className="mt-5 text-lg font-semibold">
            <ul>
              {SidebarMenu.map((item) => (
                <li
                  className="list-none flex items-center gap-4 hover:bg-zinc-900 w-fit rounded-full px-2 py-2 transition-all cursor-pointer"
                  key={item.name}
                >
                  <span className="text-[1.5rem]">{item.icon}</span>
                  <span className="">{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <button className="bg-[#1d9bf0] p-3 mr-10 rounded-full mt-4 ">
            Post
          </button>
        </div>

        <div className="col-span-6  text-white border-x h-screen border-gray-500 mr-9">
          <div className="flex justify-around items-center text-center border-b border-gray-500">
            <div className="hover:bg-zinc-900 p-4 w-full cursor-pointer">
              For you
            </div>
            <div className="hover:bg-zinc-900 p-4 w-full cursor-pointer">
              Following
            </div>
          </div>
          <div className="overflow-x-scroll h-full">
            <FeedCard />
            <FeedCard />
            <FeedCard />
            <FeedCard />
            <FeedCard />
          </div>
        </div>
        <div className="col-span-3 text-white dark ">
          <div className="my-3">
            <Card>
              <CardHeader>
                <CardTitle>Subscribe to Premium</CardTitle>
                <CardDescription>
                  Subscribe to unlock new features and if eligible, receive a
                  share of ads revenue.
                </CardDescription>
                <button className="bg-[#1d9bf0] p-1.5 mr-10 rounded-full mt-4 w-2/4">
                  Subscribe
                </button>
              </CardHeader>
            </Card>
          </div>
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
    </div>
  );
}
