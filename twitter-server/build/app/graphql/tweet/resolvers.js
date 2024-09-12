"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const clients_1 = require("../../clients");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const s3Client = new client_s3_1.S3Client([
    {
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
    },
]);
const queries = {
    getAllTweets: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield clients_1.prismaClient.tweet.findMany({
            orderBy: { createdAt: "desc" },
        });
    }),
    getSignedURLTweet: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { imageName, imageType }, ctx) {
        if (!ctx.user || !ctx.user.id)
            throw new Error("Unauthorized");
        const allowedFileTypes = [
            "image/png",
            "image/jpeg",
            "image/jpg",
            "video/mp4",
        ];
        const fullImageType = imageType === "mp4" ? `video/${imageType}` : `image/${imageType}`;
        if (!allowedFileTypes.includes(fullImageType))
            throw new Error("Invalid image type");
        const putObjCommand = new client_s3_1.PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `uploads/${ctx.user.id}/tweets/${Date.now().toString()}-${imageName}.${imageType}`,
            ContentType: fullImageType,
        });
        const signedURl = yield (0, s3_request_presigner_1.getSignedUrl)(s3Client, putObjCommand, {
            expiresIn: 60 * 60,
        });
        return signedURl;
    }),
    getTweetById: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { id }, ctx) {
        return yield clients_1.prismaClient.tweet.findUnique({ where: { id } });
    }),
};
const mutations = {
    createTweet: (parent_1, _a, ctx_1) => __awaiter(void 0, [parent_1, _a, ctx_1], void 0, function* (parent, { payload }, ctx) {
        if (!ctx.user)
            throw new Error("Unauthorized");
        const tweet = yield clients_1.prismaClient.tweet.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: { connect: { id: ctx.user.id } },
            },
        });
        return tweet;
    }),
};
const tweetResolvers = {
    Tweet: {
        author: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield clients_1.prismaClient.user.findUnique({
                where: { id: parent.authorId },
            });
        }),
    },
};
exports.resolvers = {
    mutations,
    tweetResolvers,
    queries,
};
