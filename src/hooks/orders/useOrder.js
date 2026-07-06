import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import { orderApi } from "../../api/orderApi.js";

export const useOrder = (id) => {
  return useQuery({
    queryKey: queryKeys.order(id),
    queryFn: () => orderApi.getById(id),
    enabled: !!id,
  });
};
