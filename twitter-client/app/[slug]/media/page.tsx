import React, { useState } from "react";
import FeedCard from "@/components/feedCard/feedcard";
import { User, Tweet as TweetType, Maybe } from "@/gql/graphql";
import Page from "../page";

interface PostsProps {
  data: User;
}

const Media: React.FC<PostsProps> = ({ data }) => {
  const mediaTweets = (data?.tweets || []).filter(
    (tweet: Maybe<TweetType>) => !!tweet && !!tweet.imageURL
  );

  return (
    <div className="mb-12">
      {mediaTweets.length > 0 ? (
        mediaTweets.map(
          (tweet: Maybe<TweetType>) =>
            tweet && <FeedCard key={tweet.id} data={tweet} />
        )
      ) : (
        <div>No media posts available</div>
      )}
    </div>
  );
};

export default Media;
