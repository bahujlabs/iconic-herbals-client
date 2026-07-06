import { useQuery } from "@tanstack/react-query";
import { paymentApi } from "../../api/paymentApi";

export const useOrderPaymentStatus = (orderId) =>
  useQuery({
    queryKey: ["payment-status", orderId],
    queryFn: () => paymentApi.getPaymentStatus(orderId),
    enabled: !!orderId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      const done = ["paid", "failed", "cancelled"].includes(status);
      return done ? false : 3000; //poll every seconde
    },
  });
