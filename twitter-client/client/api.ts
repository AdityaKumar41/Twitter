"use client";
import { GraphQLClient } from "graphql-request";

export const graphqlClient = new GraphQLClient(
  "https://pqm0dv79-4000.inc1.devtunnels.ms/graphql",
  {
    headers: () => {
      const token = localStorage.getItem("token");
      return {
        authorization: token ? `Bearer ${token}` : "",
      };
    },
  }
);
