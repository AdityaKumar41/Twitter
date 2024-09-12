"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useGetUserById } from "@/hooks/user";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { IconArrowLeft } from "@tabler/icons-react";
import TwitterLayout from "@/components/Layout";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter, useParams } from "next/navigation";
import { SkeletonCard } from "@/components/Skeleton";
import Link from "next/link";
import Posts from "./posts/page";

const queryClient = new QueryClient();

const Page = ({
  children,
  showChildren,
}: {
  children: React.ReactNode;
  showChildren: boolean;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <TwitterLayout>
        <Profile children={children} showChildren={showChildren} />
      </TwitterLayout>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

const NotFound = () => {
  const router = useRouter();
  return (
    <div className="text-center mt-10">
      <div className="flex justify-center items-center">
        <div
          className="text-lg font-semibold hover:bg-zinc-900 p-1.5 rounded-full cursor-pointer"
          onClick={() => router.back()}
        >
          <IconArrowLeft />
        </div>
        <h1 className="ml-4">Profile</h1>
      </div>
      <div className="mt-10">
        <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto"></div>
        <h2 className="mt-4 text-2xl font-bold">This account doesn’t exist</h2>
        <p className="text-gray-500">Try searching for another.</p>
      </div>
    </div>
  );
};

export function Profile({
  children,
  showChildren,
}: {
  children: React.ReactNode;
  showChildren: boolean;
}) {
  const router = useRouter();
  const params = useParams();
  const id = params?.slug;

  const { userById, isLoading, error } = useGetUserById(id as string); // Adjust based on your hook return
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!isLoading && (error || !userById)) {
      setNotFound(true);
    }
  }, [isLoading, error, userById]);

  // If notFound is true, render the NotFound component
  if (notFound) {
    return <NotFound />;
  }

  // Render a loading state while fetching the user data
  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="relative overflow-x-scroll h-full">
      <nav className="flex items-center p-2 gap-4 sticky  z-10 top-0 left-0 right-0 bg-black backdrop-blur-xl bg-white/0">
        <div
          className="text-lg font-semibold hover:bg-zinc-900 p-1.5 rounded-full cursor-pointer"
          onClick={() => router.back()}
        >
          <IconArrowLeft />
        </div>
        <div>
          <h1 className="font-bold">
            {userById?.firstName} {userById?.lastName}
          </h1>
          <h2 className="text-gray-500 text-sm">
            {userById?.tweets?.length || "0"} Posts
          </h2>
        </div>
      </nav>
      <div>
        <div className="w-full">
          <div className="relative h-fit">
            <Image
              src={
                "https://pbs.twimg.com/profile_banners/1508376544334737408/1690083251/1080x360"
              }
              width={1080}
              height={360}
              className="w-full"
              alt="cover-img"
            />
            <div className="flex justify-between items-center  absolute top-28 w-full p-2">
              <div>
                <Image
                  src={userById?.profileImageUrl || "/avatar.png"}
                  width={140}
                  height={140}
                  alt="profile-img"
                  className="rounded-full border-[3px] border-slate-900"
                />
              </div>
              <div className="self-end">
                <button className="px-4 py-2 rounded-full border hover:bg-zinc-800">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
          <div className="relative mt-16 p-3">
            <h2>
              {userById?.firstName} {userById?.lastName}
            </h2>
            <h3>@{userById?.firstName?.toLowerCase()}</h3>
          </div>
        </div>
        <div className="py-4">
          <nav className="flex justify-around items-center text-center border-b border-gray-500">
            <Link
              className="hover:bg-zinc-900 p-4 w-full cursor-pointer"
              href={`/${userById?.id}`}
            >
              Post
            </Link>
            <Link
              className="hover:bg-zinc-900 p-4 w-full cursor-pointer"
              href={`/${userById?.id}/media`}
            >
              Media
            </Link>
            <Link
              className="hover:bg-zinc-900 p-4 w-full cursor-pointer"
              href={`/${userById?.id}/likes`}
            >
              Likes
            </Link>
          </nav>
          <div>{showChildren ? children : <Posts data={userById} />}</div>
        </div>
      </div>
    </div>
  );
}

export default Page;
