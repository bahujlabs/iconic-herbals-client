import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import { orderApi } from "../../api/orderApi.js";

export const useOrders = (filters = {}) =>
  useQuery({
    queryKey: queryKeys.orders(filters),
    queryFn: () => orderApi.getAll(filters),
  });
