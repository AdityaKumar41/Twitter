import Image from "next/image";
import React from "react";
import { FaRegBookmark, FaRetweet } from "react-icons/fa6";
import { IconRepeat } from "@tabler/icons-react";
import { LuBarChart2 } from "react-icons/lu";
import { RiShare2Fill } from "react-icons/ri";
import { Tweet } from "@/gql/graphql";

interface FeedCardProps {
  data: Tweet;
}

const FeedCard: React.FC<FeedCardProps> = ({ data }) => {
  const handleClickLike = () => {};
  return (
    <div className="grid grid-cols-12  border-t border-gray-500 p-5 hover:bg-zinc-900 transition-all cursor-pointer gap-2">
      <div className="col-span-1">
        <Image
          src={data.author?.profileImageUrl || "/avatar.png"}
          alt="avatar"
          height={40}
          width={40}
          className="rounded-full"
        />
      </div>
      <div className="col-span-11">
        <h5>
          {data.author?.firstName} {data.author?.lastName}
        </h5>
        <p className="text-sm">
          {data.content}{" "}
          {data.imageURL && (
            <Image src={data.imageURL} alt="tweet" height={200} width={200} />
          )}
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
          <div className="flex items-center gap-1 text-gray-500  hover:text-green-400">
            <IconRepeat
              stroke={1.5}
              className="size-6 hover:bg-green-950 p-1 rounded-full"
            />
            <span className="text-xs">1.5k</span>
          </div>
          <div
            className="flex items-center gap-1  text-gray-500 hover:text-pink-400"
            onClick={handleClickLike}
          >
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
      </div>
    </div>
  );
};

export default FeedCard;
