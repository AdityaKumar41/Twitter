import React from "react";
import FeedCard from "@/components/feedCard/feedcard";
import { User, Tweet as TweetType } from "@/gql/graphql";

interface PostsProps {
  data: User;
}

const Posts: React.FC<PostsProps> = ({ data }) => {
  return (
    <div className="mb-12">
      {data?.tweets?.map((tweet: TweetType | null) => (
        <FeedCard key={tweet!.id} data={tweet!} />
      ))}
    </div>
  );
};

export default Posts;
