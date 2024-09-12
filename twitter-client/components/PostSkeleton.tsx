import { Skeleton } from "./ui/skeleton";

export default function PostSkeleton() {
  return (
    <div className="mb-12">
      <div className="grid grid-cols-12  border-t border-gray-500 p-5 hover:bg-zinc-900 transition-all cursor-pointer gap-2">
        <div className="col-span-1">
          <Skeleton className="h-[50px] w-[50px] rounded-full" />
        </div>
        <div className="col-span-11">
          <h5>
            <Skeleton className="ml-10 h-6 w-4/5 rounded-xl" />
          </h5>
          <div className="text-sm">
            <Skeleton className="h-[125px] w-full rounded-xl mt-7" />
          </div>

          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-6 w-full rounded-xl" />
          </div>

          <div className="comment my-5">
            <Skeleton className="h-[50px] w-[50px] rounded-full" />

            <h5>
              <Skeleton className="ml-10 h-6 w-4/5 rounded-xl" />
            </h5>
            <div className="text-sm">
              <Skeleton className="h-[125px] w-full rounded-xl mt-7" />
            </div>

            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-full rounded-xl" />
            </div>
          </div>
          <div className="comment my-5">
            <Skeleton className="h-[50px] w-[50px] rounded-full" />

            <h5>
              <Skeleton className="ml-10 h-6 w-4/5 rounded-xl" />
            </h5>
            <div className="text-sm">
              <Skeleton className="h-[125px] w-full rounded-xl mt-7" />
            </div>

            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-full rounded-xl" />
            </div>
          </div>
          <div className="comment my-5">
            <Skeleton className="h-[50px] w-[50px] rounded-full" />

            <h5>
              <Skeleton className="ml-10 h-6 w-4/5 rounded-xl" />
            </h5>
            <div className="text-sm">
              <Skeleton className="h-[125px] w-full rounded-xl mt-7" />
            </div>

            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-6 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
