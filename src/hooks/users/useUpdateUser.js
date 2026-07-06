import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../api/userApi";
import { queryKeys } from "../../api/queryKeys";

export const useUpdateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => userApi.update(id, data),
    onSuccess: (updated) => {
      qc.setQueryData(queryKeys.user(updated.id, updated));
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
