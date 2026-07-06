import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../api/queryKeys";
import {userApi} from '../../api/userApi'

//Optimistic patch example
export const useUpdateUsername = () =>{
    const qc = useQueryClient();
    return useMutation({
        mutationFn: ({id,name}) => userApi.patch(id, {name}),
        onMutate: async ({id, name}) =>{
            await qc.cancelQueries({queryKey: queryKeys.user(id)});
            const previous = qc.cancelQueries({queryKey: queryKeys.user(id)});
            qc.setQueryData(queryKeys.user(id), (old) => ({...old,name}));
            return {previous}
        },
        onError:(_, {id}, ctx)=>{
            qc.setQueryData(queryKeys.user(id),ctx.previous)
        },
        onSettled:(_,_,{id})=> qc.invalidateQueries({queryKey:queryKeys.user(id)})
    })
}