import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients";
import { GraphqlContext } from "../../clients/interface";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
interface CreateTweetPayload {
  content: string;
  imageURL?: string;
}

const s3Client = new S3Client([
  {
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  },
]);

const queries = {
  getAllTweets: async () => {
    return await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  getSignedURLTweet: async (
    parent: any,
    { imageName, imageType }: { imageName: string; imageType: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthorized");

    const allowedFileTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "video/mp4",
    ];

    const fullImageType =
      imageType === "mp4" ? `video/${imageType}` : `image/${imageType}`;
    if (!allowedFileTypes.includes(fullImageType))
      throw new Error("Invalid image type");

    const putObjCommand = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${
        ctx.user.id
      }/tweets/${Date.now().toString()}-${imageName}.${imageType}`,
      ContentType: fullImageType,
    });
    const signedURl = await getSignedUrl(s3Client, putObjCommand, {
      expiresIn: 60 * 60,
    });

    return signedURl;
  },

  getTweetById: async (
    parent: any,
    { id }: { id: string },
    ctx: GraphqlContext
  ) => {
    return await prismaClient.tweet.findUnique({ where: { id } });
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
