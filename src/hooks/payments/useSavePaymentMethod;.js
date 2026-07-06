import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "../../api/paymentApi.js";
import { queryKeys } from "../../api/queryKeys.js";

export const useSavePaymentMethod = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: paymentApi.saveMethod,
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.paymentMethods }),
  });
};
