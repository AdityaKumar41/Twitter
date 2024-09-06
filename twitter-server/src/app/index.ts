import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { User } from "./graphql/user";
import bodyParser from "body-parser";
import cors from "cors";
import JWTServices from "./services/jwt";
import { GraphqlContext } from "./clients/interface";
import { Tweet } from "./graphql/tweet";

export async function serverInit() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs: `
      ${User.type}

      ${Tweet.type}
      
      type Query {
        ${User.queries}
        ${Tweet.queries}
      }
      type Mutation  {
        ${Tweet.mutations}
      }
    `,
    resolvers: {
      Query: {
        ...User.resolver.queries,
        ...Tweet.resolvers.queries,
      },
      Mutation: {
        ...Tweet.resolvers.mutations,
      },
      ...Tweet.resolvers.tweetResolvers,
      ...User.resolver.TweetsRes,
    },
  });

  await graphqlServer.start();

  app.use(
    "/graphql",
    expressMiddleware(graphqlServer, {
      context: async ({ req, res }) => {
        return {
          user: req.headers.authorization
            ? JWTServices.VerifyJWT(req.headers.authorization.split(" ")[1])
            : null,
        };
      },
    })
  );
  return app;
}
