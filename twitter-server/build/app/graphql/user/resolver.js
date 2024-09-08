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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolver = void 0;
const axios_1 = __importDefault(require("axios"));
const clients_1 = require("../../clients");
const jwt_1 = __importDefault(require("../../services/jwt"));
const queries = {
    verifyGoogleToken: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { token }) {
        const GoogleAuthToken = token;
        const GoogleAuthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
        GoogleAuthUrl.searchParams.set("id_token", GoogleAuthToken);
        const { data } = yield axios_1.default.get(GoogleAuthUrl.toString(), {
            responseType: "json",
        });
        console.log(data);
        const user = yield clients_1.prismaClient.user.findUnique({
            where: { email: data.email },
        });
        if (!user) {
            yield clients_1.prismaClient.user.create({
                data: {
                    firstName: data.given_name,
                    lastName: data.family_name,
                    email: data.email,
                    profileImageUrl: data.picture,
                },
            });
        }
        const GetByDB = yield clients_1.prismaClient.user.findUnique({
            where: { email: data.email },
        });
        if (!GetByDB)
            throw new Error("Something Went Wrong!");
        const userToken = jwt_1.default.GenereateJWT(GetByDB);
        return userToken;
    }),
    getCurrectUser: (parent, args, context) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const id = (_a = context.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!id)
            null;
        const user = yield clients_1.prismaClient.user.findUnique({ where: { id } });
        return user;
    }),
    getUserById: (parent_1, _a) => __awaiter(void 0, [parent_1, _a], void 0, function* (parent, { id }) {
        const user = yield clients_1.prismaClient.user.findUnique({ where: { id } });
        return user;
    }),
};
const TweetsRes = {
    User: {
        tweets: (parent) => __awaiter(void 0, void 0, void 0, function* () {
            return yield clients_1.prismaClient.tweet.findMany({
                where: { authorId: parent.id },
            });
        }),
    },
};
exports.resolver = { queries, TweetsRes };
