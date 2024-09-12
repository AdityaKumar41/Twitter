"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { User, LogOut, ChevronDown } from "lucide-react";
import { User as Users } from "@/gql/graphql";
import Link from "next/link";

interface UserProps {
  user?: Users;
}

export default function Component({ user }: UserProps = {}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center justify-between hover:bg-zinc-800 bg-zinc-900 rounded-full px-3 py-2 transition-all cursor-pointer m-3">
          <div className="flex items-center gap-3">
            <Image
              src={
                user?.profileImageUrl ||
                "https://avatars.githubusercontent.com/u/119885098?v=4"
              }
              height={40}
              width={40}
              className="rounded-full"
              alt="avatar"
            />
            <div className="md:block hidden">
              <h2 className="text-[0.9rem] text-white font-medium">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-400 text-[0.8rem]">@aditya_kumar</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400 ml-2" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-56 rounded-xl bg-zinc-900 border-zinc-800 text-white">
        <div className="grid gap-2">
          <Link href={`/${user?.id}`}>
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-zinc-800 text-white hover:text-white rounded-xl"
          >
            <User className="mr-2 h-4 w-4" />
            View Profile
          </Button>
          </Link>
          <Button
            variant="ghost"
            className="w-full justify-start hover:bg-zinc-800 hover:text-white text-white rounded-xl"
            onClick={() => {
              // Add your logout logic here
              console.log("Logout clicked");
              setIsOpen(false);
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
