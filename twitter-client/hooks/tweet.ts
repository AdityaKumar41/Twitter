import { graphqlClient } from "@/client/api";
import { CreateTweetData } from "@/gql/graphql";
import { CreateTweetMutation } from "@/graphql/mutation/tweet";
import { GetAllTweets } from "@/graphql/query/tweet";
import {
  QueryErrorResetBoundary,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useCreateTweet = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (payload: CreateTweetData) =>
      graphqlClient.request(CreateTweetMutation, { payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["All_Tweets"] });
    },
  });
  return mutation;
};

export const useGetAllTweet = () => {
  const query = useQuery({
    queryKey: ["All_Tweets"],
    queryFn: () => graphqlClient.request(GetAllTweets),
  });
  return { ...query, tweets: query.data?.getAllTweets };
};
