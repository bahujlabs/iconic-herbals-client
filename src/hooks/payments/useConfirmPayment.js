import { useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "../../api/paymentApi";
import { queryKeys } from "../../api/queryKeys";

export const useConfirmPayment = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ reference, ...data }) =>
      paymentApi.verifyTransaction(reference, data),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: queryKeys.order(result.orderId) });
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};
