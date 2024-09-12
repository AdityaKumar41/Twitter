import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <div>
        <div className="w-full">
          <div className="relative h-fit">
            <Skeleton className=" w-full h-[200px]" />
            <div className="flex justify-between items-center  absolute top-28 w-full p-2">
              <div>
                <Skeleton className="h-[150px] w-[150px] rounded-full" />
              </div>
              <div className="self-end">
                <button className="px-4 py-2 rounded-full border">
                  <Skeleton className="h-6 w-[80px]" />
                </button>
              </div>
            </div>
          </div>
          <div className="relative mt-16 p-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
