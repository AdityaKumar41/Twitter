"use client";
import { graphqlClient } from "@/client/api";
import TwitterLayout from "@/components/Layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetTweetById } from "@/hooks/user";
import { IconArrowLeft, IconRepeat } from "@tabler/icons-react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FaRegBookmark } from "react-icons/fa6";
import { LuBarChart2 } from "react-icons/lu";
import { RiShare2Fill } from "react-icons/ri";
import PostSkeleton from "../../../components/PostSkeleton";

const queryClient = new QueryClient();

function Page() {
  return (
    <QueryClientProvider client={queryClient}>
      <TwitterLayout>
        <TweetById />
      </TwitterLayout>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export function TweetById() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const { data, isLoading, error } = useGetTweetById(id as string);

  if (isLoading) {
    return <PostSkeleton />;
  }

  if (error) {
    return <p>Error loading tweet data.</p>;
  }

  return (
    <div>
      <nav className="flex items-center p-2 gap-4 sticky  z-10 top-0 left-0 right-0 bg-black backdrop-blur-xl bg-white/0">
        <div
          className="text-lg font-semibold hover:bg-zinc-900 p-1.5 rounded-full cursor-pointer"
          onClick={() => router.back()}
        >
          <IconArrowLeft />
        </div>
        <div>
          <h1 className="font-bold">
            {data?.author?.firstName} {data?.author?.lastName}
          </h1>
        </div>
      </nav>
      <div className="mb-12">
        <div className="grid grid-cols-12  border-t border-gray-500 p-5 hover:bg-zinc-900 transition-all cursor-pointer gap-2">
          <div className="col-span-1">
            <Image
              src={data?.author?.profileImageUrl || "/avatar.png"}
              alt="avatar"
              height={40}
              width={40}
              className="rounded-full"
            />
          </div>
          <div className="col-span-11">
            <h5>
              <Link href={`/${data?.author?.id}`}>
                {data?.author?.firstName} {data?.author?.lastName}
              </Link>
            </h5>
            <p className="text-sm">
              {data?.content}{" "}
              {data?.imageURL ? (
                data?.imageURL.endsWith(".mp4") ? (
                  <video
                    src={data?.imageURL}
                    height={200}
                    width={200}
                    className="w-full rounded-xl border my-2"
                    controls
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <Image
                    src={data?.imageURL}
                    alt="tweet"
                    height={200}
                    width={200}
                    className="w-full rounded-xl border my-2"
                  />
                )
              ) : null}
            </p>

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-1 text-gray-500 hover:text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 hover:bg-blue-950 p-1 rounded-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z"
                  />
                </svg>
                <span className="text-xs">97</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 hover:text-green-400">
                <IconRepeat
                  stroke={1.5}
                  className="size-6 hover:bg-green-950 p-1 rounded-full"
                />
                <span className="text-xs">1.5k</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 hover:text-pink-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 hover:bg-pink-950 p-1 rounded-full"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                  />
                </svg>
                <span className="text-xs">2.5k</span>
              </div>
              <div className="flex items-center gap-1 text-gray-500 hover:text-blue-400">
                <LuBarChart2 className="size-6 hover:bg-blue-950 p-1 rounded-full" />
                <span className="text-xs">125k</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500">
                <FaRegBookmark className="size-5 hover:bg-blue-950 p-1 rounded-full hover:text-blue-400" />
                <RiShare2Fill className="size-5 hover:bg-blue-950 p-1 rounded-full hover:text-blue-400" />
              </div>
            </div>
            <div>
              <div className="hidden p-4 gap-3 sm:flex">
                <div className="col-span-1">
                  <Image
                    src={ "/avatar.png"}
                    alt="avatar"
                    height={40}
                    width={40}
                    className="rounded-full"
                  />
                </div>
                <div className="col-span-11 w-full">
                  <textarea
                    // value={content}
                    // onChange={(e) => setContent(e.target.value)}
                    name="content"
                    placeholder="what's happening?"
                    className="w-full bg-transparent text-white dark text-xl border-b border-gray-500"
                    rows={2}
                  />
                  <div className="mediaShow"></div>
                  <div className="flex items-center justify-between">
                    {/* <div className="flex gap-3 items-center">
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

                    </div> */}
                    <div>
                      
                    </div>
                    <button
                      
                      className="bg-[#1d9bf0] px-4 py-2 rounded-full disabled:opacity-50"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;
