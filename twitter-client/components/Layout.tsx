import { useCurrectUser } from "@/hooks/user";
import { IconDots, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import React, { useCallback, useMemo } from "react";
import { BsTwitterX } from "react-icons/bs";
import { CiCircleMore } from "react-icons/ci";
import { FaXTwitter } from "react-icons/fa6";
import {
  IoMailOutline,
  IoNotificationsOutline,
  IoPeopleOutline,
  IoPerson,
  IoSearch,
} from "react-icons/io5";
import { MdHomeFilled } from "react-icons/md";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { graphqlClient } from "@/client/api";
import { VerifyGoogleAuthToken } from "@/graphql/query/user";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
}
interface TwitterSidebar {
  name: string;
  icon: React.ReactNode;
  link: string;
}
const TwitterLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useCurrectUser();
  const queryClient = useQueryClient();
  const SidebarMenu: TwitterSidebar[] = useMemo(
    () => [
      {
        name: "Home",
        icon: <MdHomeFilled />,
        link: "/",
      },
      {
        name: "Explore",
        icon: <IoSearch />,
        link: "/explore",
      },
      {
        name: "Notification",
        icon: <IoNotificationsOutline />,
        link: "/notification",
      },
      {
        name: "Messages",
        icon: <IoMailOutline />,
        link: "/messages",
      },
      {
        name: "Communities",
        icon: <IoPeopleOutline />,
        link: "/communities",
      },
      {
        name: "Premium",
        icon: <BsTwitterX />,
        link: "/",
      },
      {
        name: "Profile",
        icon: <IoPerson />,
        link: `${user?.id}`,
      },
      {
        name: "More",
        icon: <CiCircleMore />,
        link: "/more",
      },
    ],
    [user?.id]
  );

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
    <div className="grid grid-cols-12 h-screen w-screen lg:px-32 md:px-10 px-0">
      <div className="col-span-2 sm:col-span-3 text-white flex flex-col justify-between">
        <div className="flex justify-start p-3 flex-col">
          <div className="hover:bg-zinc-900 cursor-pointer rounded-full p-2 h-fit w-fit text-2xl transition-all">
            <FaXTwitter />
          </div>
          <div className="mt-5 text-lg font-semibold">
            <ul>
              {SidebarMenu.map((item) => (
                <Link href={item.link}>
                  <li
                    className="list-none flex items-center gap-4 hover:bg-zinc-900 w-fit rounded-full px-2 py-2 transition-all cursor-pointer"
                    key={item.name}
                  >
                    <span className="text-[1.8rem] p-1 sm:text-[1.5rem]">
                      {item.icon}
                    </span>
                    <span className="sm:block hidden">{item.name}</span>
                  </li>
                </Link>
              ))}
            </ul>
          </div>
          <button className="bg-[#1d9bf0] p-3 mr-10 rounded-full mt-4 absolute right-0 bottom-4 sm:block sm:relative ">
            <IconPlus />
          </button>
        </div>
        {user && (
          <div className="flex items-center justify-between hover:bg-zinc-900  rounded-full px-2 py-2 transition-all cursor-pointer m-3">
            <div className="flex items-center gap-2">
              {user?.profileImageUrl ? (
                <Image
                  src={user?.profileImageUrl}
                  height={45}
                  width={45}
                  className="rounded-full"
                  alt="avatar"
                />
              ) : (
                <Image
                  src={"https://avatars.githubusercontent.com/u/119885098?v=4"}
                  height={45}
                  width={45}
                  className="rounded-full "
                  alt="avatar"
                />
              )}
              <div className="md:block hidden">
                <h2 className="text-[0.9rem]">
                  {user?.firstName} {user?.lastName}
                </h2>
                <p className="text-gray-500 text-[0.8rem]">@aditya_kumar</p>
              </div>
            </div>
            <div className="sm:block hidden">
              <IconDots />
            </div>
          </div>
        )}
      </div>
      <div className="col-span-10 sm:col-span-9 md:col-span-6 text-white border-x h-screen border-gray-500">
        {children}
      </div>
      <div className="col-span-3 text-white dark md:block hidden m-5 min-w-48">
        {!user && (
          <div className="">
            <Card>
              <CardHeader>
                <CardTitle>Login with Google</CardTitle>
                <CardDescription>
                  Subscribe to unlock new features and if eligible, receive a
                  share of ads revenue.
                </CardDescription>
                <GoogleLogin onSuccess={handleCredGoogle} />
              </CardHeader>
            </Card>
          </div>
        )}
        <div className="my-3">
          <Card>
            <CardHeader>
              <CardTitle>What happeening</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TwitterLayout;
