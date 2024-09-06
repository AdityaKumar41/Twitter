import { graphqlClient } from "@/client/api";
import { GetCurrectLoginUserQuery } from "@/graphql/query/user";
import { useQuery } from "@tanstack/react-query";
export const useCurrectUser = () => {
  const query = useQuery({
    queryKey: ["Login_User"],
    queryFn: () => graphqlClient.request(GetCurrectLoginUserQuery),
  });

  return { ...query, user: query.data?.getCurrectUser };
};
