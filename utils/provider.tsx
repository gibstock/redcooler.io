"use client";

import React, {useEffect, useState} from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools} from '@tanstack/react-query-devtools';
import { useUserStore } from "@/hooks/store";
import api from "@/api/api";

function Providers({children}: React.PropsWithChildren) {
  const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
  const [client] = useState(
    new QueryClient({ defaultOptions: {queries: {staleTime: 5000}}})
  );

  useEffect(() => {
    const user = async () => {
      const user = await api.getUser();
      console.log("USER FROM TOP: ", user)
      if(!user) return

      setUser(user);
    };

    user();
  }, []);
  return (
      <QueryClientProvider client={client}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  )
};

export default Providers;