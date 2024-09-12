"use client";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { MdHomeFilled, MdOutlineGifBox } from "react-icons/md";
import { BsTwitterX } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import EmojiPicker from "emoji-picker-react";
import GifPicker from "gif-picker-react";
import axios from "axios";

import { IoSearch } from "react-icons/io5";
import FeedCard from "@/components/feedCard/feedcard";
import { useCurrectUser } from "@/hooks/user";
import { useQueryClient } from "@tanstack/react-query";
import { IconMoodSmile, IconPhoto } from "@tabler/icons-react";
import { useCreateTweet, useGetAllTweet } from "@/hooks/tweet";
import TwitterLayout from "@/components/Layout";
import { Tweet } from "@/gql/graphql";
import { graphqlClient } from "@/client/api";
import { getMediaSignedURL } from "@/graphql/query/tweet";
import toast from "react-hot-toast";
import PostSkeleton from "@/components/PostSkeleton";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleLogin } from "@react-oauth/google";
import Login from "@/components/Login";

export default function Props() {
  const API = process.env.NEXT_PUBLIC_API_KEY || "";
  const { user } = useCurrectUser();
  const { tweets, isLoading, error } = useGetAllTweet();
  const [content, setContent] = useState("");
  const [getMedia, setMedia] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGIF, setShowGIF] = useState(false);
  const { mutate } = useCreateTweet();

  const handlerFile = (input: HTMLInputElement) => {
    console.log("input", input);
    return async (e: Event) => {
      e.preventDefault();
      const file: File | null | undefined = input.files?.item(0);
      if (!file) return;
      const { getSignedURLTweet } = await graphqlClient.request(
        getMediaSignedURL,
        {
          imageName: file.name,
          imageType: file.type.split("/")[1],
        }
      );

      if (getSignedURLTweet) {
        toast.loading("Uploading File...", { id: "uploading" });
        await axios.put(getSignedURLTweet, file, {
          headers: {
            "Content-Type": file.type,
          },
        });
        toast.success("Uploaded..", { id: "uploading" });
        const url = new URL(getSignedURLTweet);
        const path = `${url.origin}${url.pathname}`;
        setMedia(path);
        // create dynamic image element
        const mediaShow = document.querySelector(".mediaShow");
        if (path.endsWith("mp4")) {
          const video = document.createElement("video");
          video.src = path;
          video.controls = true;
          video.className = "w-full rounded-lg";
          mediaShow?.appendChild(video);
        } else {
          const img = document.createElement("img");
          img.src = path;
          img.className = "w-full rounded-lg";
          mediaShow.appendChild(img);
          console.log(path);
        }
      }
    };
  };

  const handleImageSelect = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*, video/*");
    input.setAttribute("multiple", "false");

    const handler = handlerFile(input);
    input.addEventListener("change", handler);

    input.click();
  }, [handlerFile]);

  const onEmojiClick = (e: { emoji: string }) => {
    setContent((prevContent) => prevContent + e.emoji);
  };

  const handleCreateTweet = useCallback(() => {
    if (!content || (content.trim() === "" && !getMedia)) return;
    const createTweet = async () => {
      try {
        const imageURL = getMedia;
        await mutate({ content, imageURL });
        setContent("");
        const gifDisplay = document.querySelector(".mediaShow");
        if (gifDisplay) {
          while (gifDisplay.firstChild) {
            gifDisplay.removeChild(gifDisplay.firstChild); // Remove all child elements
          }
        }

        setMedia("");
      } catch (error) {
        console.error("Failed to create tweet:", error);
      }
    };

    createTweet();
  }, [content, mutate, setContent]);

  const onGifClick = (gif: { url: React.SetStateAction<string> }) => {
    setMedia(gif.url);

    const gifDisplay = document.querySelector(".mediaShow");

    // Create a wrapper div to hold the gif and the remove button
    const wrapperDiv = document.createElement("div");
    wrapperDiv.className = "relative w-full mb-2";

    // Create the gif image element
    const createElement = document.createElement("img");
    createElement.src = gif.url as string;
    setMedia(gif.url);
    createElement.className = "w-full rounded-lg"; // Style the gif as you like

    // Create the remove button
    const removeButton = document.createElement("button");
    removeButton.innerHTML = "&#10005;"; // Cross icon (X)
    removeButton.className =
      "absolute top-2 right-2 bg-zinc-900 text-white px-2 py-1 rounded-full cursor-pointer";
    removeButton.onclick = () => {
      if (gifDisplay) {
        gifDisplay.removeChild(wrapperDiv);
        setMedia((prv) => "");
      }
    };
    wrapperDiv.appendChild(createElement);
    wrapperDiv.appendChild(removeButton);
    if (gifDisplay) {
      gifDisplay.appendChild(wrapperDiv);
    }

    setShowGIF(false);
  };

  if (isLoading) {
    return (
      <TwitterLayout>
        <PostSkeleton />
      </TwitterLayout>
    );
  }

  if (error) {
    return <div>Error</div>;
  }

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
          <div className="hidden p-4 gap-3 sm:flex">
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
              <div className="mediaShow"></div>
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <IconPhoto
                    className="text-[#1987d1] size-7 hover:bg-blue-950 p-1 rounded-full cursor-pointer"
                    onClick={(e) => handleImageSelect(e)}
                  />
                  <div className="relative">
                    <MdOutlineGifBox
                      className="text-[#1987d1] size-7 hover:bg-blue-950 p-1 rounded-full cursor-pointer"
                      onClick={() => {
                        setShowGIF((prv) => !prv);
                        setShowEmoji(false);
                      }}
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
                      onClick={() => {
                        setShowEmoji((prv) => !prv);
                        setShowGIF(false);
                      }}
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
          {!user ? (
            <div className="dark sm:hidden">
              <Login />
            </div>
          ) : (
            <div className="flex p-4 gap-3 sm:hidden">
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
                <div className="mediaShow"></div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3 items-center">
                    <IconPhoto
                      className="text-[#1987d1] size-7 hover:bg-blue-950 p-1 rounded-full cursor-pointer"
                      onClick={(e) => handleImageSelect(e)}
                    />
                    <div className="relative">
                      <MdOutlineGifBox
                        className="text-[#1987d1] size-7 hover:bg-blue-950 p-1 rounded-full cursor-pointer"
                        onClick={() => {
                          setShowGIF((prv) => !prv);
                          setShowEmoji(false);
                        }}
                      />
                      {showGIF && (
                        <div className="absolute z-10 top-8 left-0">
                          <GifPicker
                            tenorApiKey={API}
                            onGifClick={onGifClick}
                          />
                        </div>
                      )}
                    </div>
                    <div className="relative">
                      <IconMoodSmile
                        className="text-[#1987d1] size-7 hover:bg-blue-950 p-1 rounded-full cursor-pointer"
                        onClick={() => {
                          setShowEmoji((prv) => !prv);
                          setShowGIF(false);
                        }}
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
          )}
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
