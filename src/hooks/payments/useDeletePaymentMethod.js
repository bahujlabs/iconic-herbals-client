import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "../../api/paymentApi";
import { queryKeys } from "../../queryKeys";

export const useDeletePaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentApi.deleteMethod,
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: queryKeys.paymentMethods });
      const previous = qc.getQueryData(queryKeys.paymentMethods);
      qc.setQueryData(queryKeys.paymentMethods, (old = []) =>
        old.filter((m) => m.id !== id),
      );
      return { previous };
    },
    onError: (_, __, ctx) =>
      qc.setQueryData(queryKeys.paymentMethods, ctx.previous),
    onSettled: () =>
      qc.invalidateQueries({ queryKey: queryKeys.paymentMethods }),
  });
};
