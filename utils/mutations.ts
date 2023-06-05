import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from '@/api/api';

const queryClient = useQueryClient();


export const deleteTopicMutation = useMutation({
  mutationFn: api.deleteTopic, 
  onSuccess: (data: any, variables: string, context: any) => {
    queryClient.invalidateQueries([`${variables}`]);
  }
})