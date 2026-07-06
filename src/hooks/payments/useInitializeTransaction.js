import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PaymentApi } from "../../api/paymentApi";
import { queryKeys } from "../../api/queryKeys";

export const useInitializeTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: PaymentApi.initializeTransaction,
    onSuccess: (data, { orderId }) =>
      qc.setQueryData(queryKeys.paymentIntent(orderId), data),
  });
};
