import { useMutation } from "@tanstack/react-query";
import { orderApi } from "../../api/orderApi";

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: orderApi.create,
  });
};
