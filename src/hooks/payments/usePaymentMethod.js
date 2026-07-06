import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import { paymentApi } from "../../api/paymentApi";

export const usePaymentMethods = () => {
  useQuery({
    queryKey: queryKeys.paymentMethods,
    queryFn: paymentApi.getSavedMethods,
  });
};
