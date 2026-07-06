import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../api/userApi";
import { queryKeys } from "../../api/queryKeys";

export const useDeleteUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userApi.delete,
    onSuccess: (_, id) => {
      qc.removeQueries({ queryKey: queryKeys.user(id) });
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
