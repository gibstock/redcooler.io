"use client";

import React, {useEffect, useState} from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools} from '@tanstack/react-query-devtools';
import { useUserStore } from "@/hooks/store";
import api from "@/api/api";

function Providers({children}: React.PropsWithChildren) {
  // const user = useUserStore(state => state.user);
  const setUser = useUserStore(state => state.setUser);
  const setUserProfile = useUserStore(state => state.setUserProfile);
  const setAvatarUrl = useUserStore(state => state.setUserAvatar);
  const setUserInitials = useUserStore(state => state.setUserInitials);
  const setImageUrlMap = useUserStore(state => state.setImageUrlMap)
  const setImageList = useUserStore(state => state.setImageList);
  const [client] = useState(
    new QueryClient({ defaultOptions: {queries: {staleTime: 5000}}})
  );
  

  useEffect(() => {
    const user = async () => {
      const user = await api.getUser();
      if(!user) return;
      setUser(user);
      const userInitials = await api.getUserInitials(user.name)
      setUserInitials(userInitials)
      const userProfile = await api.getUserProfile(user.$id);
      setUserProfile(userProfile)
      if(userProfile.length === 0){
        const newUserProfile = await api.createUserProfile(user.name, user.email, 'redcooler noob', 'user',user.$id, '')
        setUserProfile(newUserProfile)
      };
      if(userProfile[0].avatarId.length === 0) return;
      const userAvatarUrl = await api.getAvatarById(userProfile[0].avatarId)
      if(!userAvatarUrl) return;
      setAvatarUrl(userAvatarUrl.href);
      const getAvatars = await api.listAvatars();
      setImageList(getAvatars)
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