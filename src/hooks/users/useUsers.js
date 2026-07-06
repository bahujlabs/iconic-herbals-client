import { useQuery } from "@tanstack/react-query";
import { userApi } from "../../api/userApi.js";
import { queryKeys } from "../../api/queryKeys.js";

export const useUsers = (filters = {}) =>
  useQuery({
    queryKeys: queryKeys.user(filters),
    queryFn: () => userApi.getAll(filters),
  });
