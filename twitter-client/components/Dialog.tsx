"use client";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { IconMoodSmile, IconPhoto, IconPlus } from "@tabler/icons-react";
import { MdOutlineGifBox } from "react-icons/md";
import { useCurrectUser } from "@/hooks/user";
import { useCreateTweet, useGetAllTweet } from "@/hooks/tweet";
import { useCallback, useState } from "react";
import { graphqlClient } from "@/client/api";
import { getMediaSignedURL } from "@/graphql/query/tweet";
import toast from "react-hot-toast";
import axios from "axios";
import GifPicker from "gif-picker-react";
import EmojiPicker from "emoji-picker-react";
import Login from "./Login";

export default function PostDialog() {
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
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-[#1d9bf0] py-4 px-4 sm:py-4 sm:px-12 mr-10  rounded-full mt-4 absolute right-0 bottom-4 sm:block sm:relative z-10"
        >
          Post
        </Button>
      </DialogTrigger>
      <DialogContent className="rounded-2xl sm:max-w-[525px] bg-zinc-900 text-white  border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white">Create a post</DialogTitle>
          <DialogDescription className="text-gray-400">
            Share what's on your mind with your followers.
          </DialogDescription>
        </DialogHeader>
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
              placeholder="What's happening?"
              className="w-full bg-transparent text-white text-xl border-b border-gray-700 focus:outline-none focus:border-blue-500 placeholder-gray-500"
              rows={2}
            />
            <div className="mediaShow"></div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-3 items-center">
                <IconPhoto
                  className="text-blue-400 size-7 hover:bg-blue-900/50 p-1 rounded-full cursor-pointer"
                  onClick={(e) => handleImageSelect(e)}
                />
                <div className="relative">
                  <MdOutlineGifBox
                    className="text-blue-400 size-7 hover:bg-blue-900/50 p-1 rounded-full cursor-pointer"
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
                        theme="dark"
                      />
                    </div>
                  )}
                </div>
                <div className="relative">
                  <IconMoodSmile
                    className="text-blue-400 size-7 hover:bg-blue-900/50 p-1 rounded-full cursor-pointer"
                    onClick={() => {
                      setShowEmoji((prv) => !prv);
                      setShowGIF(false);
                    }}
                  />
                  {showEmoji && (
                    <div className="absolute z-10 sm:left-0 sm:right-0 w-full right-24">
                      <EmojiPicker onEmojiClick={onEmojiClick} theme="dark" />
                    </div>
                  )}
                </div>
              </div>
              <Button
                onClick={handleCreateTweet}
                disabled={!content || content.trim() === ""}
                className="bg-blue-500 text-white hover:bg-blue-600 rounded-full"
              >
                Post
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
