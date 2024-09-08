"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { MdHomeFilled, MdOutlineGifBox } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import EmojiPicker from "emoji-picker-react";
import GifPicker from "gif-picker-react";
import {
  IoMailOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoPerson,
} from "react-icons/io5";

import { IoSearch } from "react-icons/io5";
import FeedCard from "@/components/feedCard/feedcard";
import { useCurrectUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { IconMoodSmile, IconPhoto } from "@tabler/icons-react";
import { useCreateTweet, useGetAllTweet } from "@/hooks/tweet";
import TwitterLayout from "@/components/Layout";
import { Tweet } from "@/gql/graphql";

export default function Props() {
  const API = process.env.NEXT_PUBLIC_API_KEY || "";
  const { user } = useCurrectUser();
  const { tweets } = useGetAllTweet();
  const [content, setContent] = useState("");
  const [getGif, setGif] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGIF, setShowGIF] = useState(false);
  const { mutate } = useCreateTweet();

  const handleImageSelect = (
    e: React.MouseEvent<SVGSVGElement, MouseEvent>
  ) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
  };

  const onEmojiClick = (e: { emoji: string }) => {
    setContent((prevContent) => prevContent + e.emoji);
  };

  const handleCreateTweet = useCallback(() => {
    if (!content || (content.trim() === "" && !getGif)) return;
    const createTweet = async () => {
      try {
        const imageURL = getGif;
        await mutate({ content, imageURL });
        setContent("");
        const gifDisplay = document.querySelector(".gifShow");
        if (gifDisplay) {
          while (gifDisplay.firstChild) {
            gifDisplay.removeChild(gifDisplay.firstChild); // Remove all child elements
          }
        }
        setGif("");
      } catch (error) {
        console.error("Failed to create tweet:", error);
      }
    };

    createTweet();
  }, [content, mutate, setContent]);

  const onGifClick = (gif: { url: React.SetStateAction<string> }) => {
    setGif(gif.url);

    const gifDisplay = document.querySelector(".gifShow");

    // Create a wrapper div to hold the gif and the remove button
    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = "relative w-full mb-2";

    // Create the gif image element
    const createElement = document.createElement("img");
    createElement.src = gif.url as string;
    setGif(gif.url);
    createElement.className = "w-full rounded-lg"; // Style the gif as you like

    // Create the remove button
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "&#10005;"; // Cross icon (X)
    removeButton.className =
      "absolute top-2 right-2 bg-zinc-900 text-white px-2 py-1 rounded-full cursor-pointer";
    removeButton.onclick = () => {
      if (gifDisplay) {
        gifDisplay.removeChild(wrapperDiv);
        setGif((prv) => "");
      }
    };
    wrapperDiv.appendChild(createElement);
    wrapperDiv.appendChild(removeButton);
    if (gifDisplay) {
      gifDisplay.appendChild(wrapperDiv);
    }

    setShowGIF(false); // Close the GIF picker after selection
  };

  return (
    <div>
      <TwitterLayout>
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
                src={user?.profileImageUrl || "/avatar.png"}
                alt="avatar"
                height={40}
                width={40}
                className="rounded-full"
              />
            </div>
            <div className="col-span-11 w-full">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                name="content"
                placeholder="what's happening?"
                className="w-full bg-transparent text-white dark text-xl border-b border-gray-500"
                rows={2}
              />
              <div className="gifShow"></div>
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <IconPhoto
                    className="text-[#1987d1] size-7 hover:bg-blue-950 p-1 rounded-full cursor-pointer"
                    onClick={(e) => handleImageSelect(e)}
                  />
                  <div className="relative">
                    <MdOutlineGifBox
                      className="text-[#1987d1] size-7 hover:bg-blue-950 p-1 rounded-full cursor-pointer"
                      onClick={() => setShowGIF((prv) => !prv)}
                    />
                    {showGIF && (
                      <div className="absolute z-10 top-8 left-0">
                        <GifPicker tenorApiKey={API} onGifClick={onGifClick} />
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <IconMoodSmile
                      className="text-[#1987d1] size-7 hover:bg-blue-950 p-1 rounded-full cursor-pointer"
                      onClick={() => setShowEmoji((prv) => !prv)}
                    />
                    {showEmoji && (
                      <div className="absolute z-10 sm:left-0 sm:right-0 w-full right-24">
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
      </TwitterLayout>
    </div>
  );
}
