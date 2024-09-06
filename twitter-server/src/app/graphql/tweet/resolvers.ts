import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients";
import { GraphqlContext } from "../../clients/interface";
interface CreateTweetPayload {
  content: string;
  imageURL?: string;
}

const queries = {
  getAllTweets: async () => {
    return await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });
  },
};

const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("Unauthorized");
    const tweet = await prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL,
        author: { connect: { id: ctx.user.id } },
      },
    });
    return tweet;
  },
};

const tweetResolvers = {
  Tweet: {
    author: async (parent: Tweet) => {
      return await prismaClient.user.findUnique({
        where: { id: parent.authorId },
      });
    },
  },
};

export const resolvers = {
  mutations,
  tweetResolvers,
  queries,
};
