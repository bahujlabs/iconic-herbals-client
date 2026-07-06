import { useInfiniteQuery } from "@tanstack/react-query";
import { userApi } from "../../api/userApi.js";
import { queryKeys } from "../../api/queryKeys.js";

export const useInfiniteUsers = (limit = 20) => {
  useInfiniteQuery({
    queryKey: [...queryKeys.users(), "infinite"],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => userApi.getAll({ page: pageParam, limit }),
    getNextPageParam: (last) => (last.hasNext ? last.nextPage : undefined),
  });
};
