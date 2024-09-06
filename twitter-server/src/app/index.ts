import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { User } from "./graphql/user";
import bodyParser from "body-parser";
import cors from "cors";
import CookieParser from "cookie-parser";
import JWTServices from "./services/jwt";
import { GraphqlContext } from "./clients/interface";

export async function serverInit() {
  const app = express();
  app.use(bodyParser.json());
  app.use(cors());
  app.use(CookieParser());
  const graphqlServer = new ApolloServer<GraphqlContext>({
    typeDefs: `
      ${User.type}
      
      type Query {
        ${User.queries}
      }
    `,
    resolvers: {
      Query: {
        ...User.resolver.queries,
      },
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
