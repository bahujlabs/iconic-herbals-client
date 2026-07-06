import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "../../api/userApi";

export const useCreateUser = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
};
