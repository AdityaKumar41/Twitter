import { graphqlClient } from "@/client/api";
import { getTweetID } from "@/graphql/query/tweet";
import {
  GetCurrectLoginUserQuery,
  GetUserByIdQuery,
} from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";
export const useCurrectUser = () => {
  const query = useQuery({
    queryKey: ["Login_User"],
    queryFn: () => graphqlClient.request(GetCurrectLoginUserQuery),
  });

  return { ...query, user: query.data?.getCurrectUser };
};

export const useGetUserById = (id: string) => {
  const query = useQuery({
    queryKey: ["User", id],
    queryFn: () => graphqlClient.request(GetUserByIdQuery, { id }),
  });
  return { ...query, userById: query.data?.getUserById };
};

export const useGetTweetById = (id: string) => {
  const query = useQuery({
    queryKey: ["Tweet", id],
    queryFn: () => graphqlClient.request(getTweetID, { id }),
  });
  return { ...query, data: query.data?.getTweetById };
};
