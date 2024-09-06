"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { FaXTwitter } from "react-icons/fa6";
import { MdHomeFilled, MdOutlineGifBox } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
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
import { graphqlClient } from "@/client/api";
import { VerifyGoogleAuthToken } from "@/graphql/query/user";
import { useCurrectUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import {
  IconDots,
  IconDotsVertical,
  IconMoodSmile,
  IconPhoto,
} from "@tabler/icons-react";
import { useCreateTweet, useGetAllTweet } from "@/hooks/tweet";
import { Tweet } from "@/gql/graphql";

export default function Props() {
  const { user } = useCurrectUser();
  const queryClient = useQueryClient();
  const { tweets } = useGetAllTweet();
  const [content, setContent] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const { mutate } = useCreateTweet();

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

  const handleCredGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error("Google Token not found!");
      const { verifyGoogleToken } = await graphqlClient.request(
        VerifyGoogleAuthToken,
        {
          token: googleToken,
        }
      );

      // if (verifyGoogleToken) {
      //   const expiryDate = new Date();
      //   expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry
      //   return (document.cookie = `token=${verifyGoogleToken}; expires=${expiryDate.toUTCString()};`);
      // }

      toast.success("Verified Success!");
      if (verifyGoogleToken)
        window.localStorage.setItem("token", verifyGoogleToken);

      await queryClient.invalidateQueries({ queryKey: ["Login_User"] });
    },
    [queryClient]
  );

  const handleImageSelect = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  };

  const onEmojiClick = (e) => {
    setContent((prevContent) => prevContent + e.emoji);
  };

  const handleCreateTweet = useCallback(() => {
    if (!content || content.trim() === "") return;
    return mutate({ content }), setContent("");
  }, []);
  return (
    <div>
      <div className="grid grid-cols-12 h-screen w-screen px-32">
        <div className="col-span-3  text-white flex flex-col justify-between">
          <div className="flex justify-start p-3 flex-col">
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
          {user && (
            <div className="flex items-center justify-between hover:bg-zinc-900  rounded-full px-2 py-2 transition-all cursor-pointer m-3">
              <div className="flex items-center gap-2">
                {user?.profileImageUrl ? (
                  <Image
                    src={user?.profileImageUrl}
                    height={45}
                    width={45}
                    className="rounded-full "
                    alt="avatar"
                  />
                ) : (
                  <Image
                    src={
                      "https://avatars.githubusercontent.com/u/119885098?v=4"
                    }
                    height={45}
                    width={45}
                    className="rounded-full "
                    alt="avatar"
                  />
                )}
                <div>
                  <h2 className="text-[0.9rem]">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-gray-500 text-[0.8rem]">@aditya_kumar</p>
                </div>
              </div>
              <div>
                <IconDots />
              </div>
            </div>
          )}
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
            <div className="flex p-4 gap-3">
              <div className="col-span-1">
                <Image
                  src={"https://avatars.githubusercontent.com/u/119885098?v=4"}
                  alt="avatar"
                  height={40}
                  width={40}
                  className="rounded-full"
                />
              </div>
              <div className="col-span-11 w-full ">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  name="content"
                  placeholder="what's happening?"
                  className="w-full bg-transparent text-white dark text-xl border-b border-gray-500"
                  rows={2}
                />
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <IconPhoto
                      className="text-[#1987d1] size-7 hover:bg-blue-950 p-1 rounded-full cursor-pointer"
                      onClick={(e) => handleImageSelect(e)}
                    />
                    <MdOutlineGifBox className="text-[#1987d1] size-7 hover:bg-blue-950 p-1 rounded-full cursor-pointer" />
                    <div className="relative">
                      <IconMoodSmile
                        className="text-[#1987d1] size-7 hover:bg-blue-950 p-1 rounded-full cursor-pointer"
                        onClick={() => setShowEmoji((prv) => !prv)}
                      />
                      {showEmoji && (
                        <div className="absolute z-10 top-8 left-0">
                          <EmojiPicker onEmojiClick={onEmojiClick} />
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleCreateTweet}
                    disabled={!content || content.trim() === ""}
                    className="bg-[#1d9bf0] px-4 py-2 rounded-full disabled:opacity-50"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
            <div className="mb-12">
              {tweets?.map((tweet) => (
                <FeedCard key={tweet?.id} data={tweet as Tweet} />
              ))}
            </div>
          </div>
        </div>
        <div className="col-span-3 text-white dark ">
          {!user && (
            <div className="my-3">
              <Card>
                <CardHeader>
                  <CardTitle>Login with Google</CardTitle>
                  <CardDescription>
                    Subscribe to unlock new features and if eligible, receive a
                    share of ads revenue.
                  </CardDescription>
                  <GoogleLogin onSuccess={handleCredGoogle} />
                </CardHeader>
              </Card>
            </div>
          )}
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
