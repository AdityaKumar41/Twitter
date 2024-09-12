import { graphqlClient } from "@/client/api";
import { VerifyGoogleAuthToken } from "@/graphql/query/user";
import { useCurrectUser } from "@/hooks/user";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export default function Login() {
  const { user } = useCurrectUser();
  const queryClient = useQueryClient();
  const handleCredGoogle = useCallback(
    async (cred: CredentialResponse) => {
      const googleToken = cred.credential;
      if (!googleToken) return toast.error("Google Token not found!");
      const { verifyGoogleToken } = await graphqlClient.request(
        VerifyGoogleAuthToken,
        {
          token: googleToken,
        }
      );

      // if (verifyGoogleToken) {
      //   const expiryDate = new Date();
      //   expiryDate.setDate(expiryDate.getDate() + 7); // 7 days expiry
      //   return (document.cookie = `token=${verifyGoogleToken}; expires=${expiryDate.toUTCString()};`);
      // }

      toast.success("Verified Success!");
      if (verifyGoogleToken)
        window.localStorage.setItem("token", verifyGoogleToken);

      await queryClient.invalidateQueries({ queryKey: ["Login_User"] });
    },
    [queryClient]
  );
  return (
    <div className="dark">
      <Card>
        <CardHeader>
          <CardTitle>Login with Google</CardTitle>
          <CardDescription>
            Subscribe to unlock new features and if eligible, receive a share of
            ads revenue.
          </CardDescription>
          <GoogleLogin onSuccess={handleCredGoogle} />
        </CardHeader>
      </Card>
    </div>
  );
}
