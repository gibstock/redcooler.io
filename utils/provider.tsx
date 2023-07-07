"use client";

import React, {useEffect, useState} from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools} from '@tanstack/react-query-devtools';
import { useUserStore, darkModeStore } from "@/hooks/store";
import api from "@/api/api";

function Providers({children}: React.PropsWithChildren) {
  const setUser = useUserStore(state => state.setUser);
  const setUserProfile = useUserStore(state => state.setUserProfile);
  const dark = darkModeStore(state => state.dark);
  const [client] = useState(
    new QueryClient(
      { 
      defaultOptions: {
        queries: {
          staleTime: 15000,
        }
      }
    }
    )
  );
  
  
  useEffect(() => {
    const user = async () => {
      const user = await api.getUser();
      if(!user) return;
      setUser(user);
      const userProfile = await api.getUserProfile(user.$id);
      setUserProfile(userProfile)
    };
    
    user();
  }, []);

  useEffect(() => {
    const darkCheck = () => {
      if(dark) {
        document.querySelector('html')?.classList.add('dark')
      } else {
        document.querySelector('html')?.classList.remove('dark')
      }
    }
    darkCheck()
  }, [dark])
  return (
      <QueryClientProvider client={client}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
  )
};

export default Providers;