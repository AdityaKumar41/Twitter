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
const queries = {
    getAllTweets: () => __awaiter(void 0, void 0, void 0, function* () {
        return yield clients_1.prismaClient.tweet.findMany({
            orderBy: { createdAt: "desc" },
        });
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
