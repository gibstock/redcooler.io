import React from 'react';
import { useUserStore } from '@/hooks/store';
import api from '@/api/api';
import { Server } from '@/utils/appwriteConfig';
import { useRouter } from 'next/navigation';

// NEED
/*
* Topics database
* User from zustand
* API
* Server
* useRouter
*/

const NewTopic = () => {
  
  const user = useUserStore(state => state.user);

  return (
    <div>
      <h1>New Topic</h1>
      <p>User: {user?.name}</p>
    </div>
  )
}

export default NewTopic