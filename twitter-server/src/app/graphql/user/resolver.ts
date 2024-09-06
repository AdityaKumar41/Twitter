import axios from "axios";
import { prismaClient } from "../../clients";
import JWTServices from "../../services/jwt";
import { GraphqlContext } from "../../clients/interface";
import { User } from "@prisma/client";

interface GoogleAuthInterface {
  iss?: string;
  azp?: string;
  aud?: string;
  sub?: string;
  email: string;
  email_verified: string;
  nbf?: string;
  name?: string;
  picture?: string;
  given_name: string;
  family_name?: string;
  iat?: string;
  exp?: string;
  jti?: string;
  alg?: string;
  kid?: string;
  typ?: string;
}

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const GoogleAuthToken = token;
    const GoogleAuthUrl = new URL("https://oauth2.googleapis.com/tokeninfo");
    GoogleAuthUrl.searchParams.set("id_token", GoogleAuthToken);
    const { data } = await axios.get<GoogleAuthInterface>(
      GoogleAuthUrl.toString(),
      {
        responseType: "json",
      }
    );

    console.log(data);
    const user = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      await prismaClient.user.create({
        data: {
          firstName: data.given_name,
          lastName: data.family_name,
          email: data.email,
          profileImageUrl: data.picture,
        },
      });
    }

    const GetByDB = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!GetByDB) throw new Error("Something Went Wrong!");

    const userToken = JWTServices.GenereateJWT(GetByDB);

    return userToken;
  },

  getCurrectUser: async (parent: any, args: any, context: GraphqlContext) => {
    const id = context.user?.id;
    if (!id) null;

    const user = await prismaClient.user.findUnique({ where: { id } });
    return user;
  },
};

const TweetsRes = {
  User: {
    tweets: async (parent: User) => {
      return await prismaClient.tweet.findMany({
        where: { authorId: parent.id },
      });
    },
  },
};

export const resolver = { queries, TweetsRes };
