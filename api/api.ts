import { Client, Avatars, Databases, Account, Permission, Role, Query, Storage} from 'appwrite';
import { Server } from '../utils/appwriteConfig';

type User = {
  email: string;
  password: string;
  username?: string;
}

let api = {
  sdk: null as unknown,
  provider: ():any => {
    if(api.sdk) {
      return api.sdk;
    }
    let client = new Client();
    client.setEndpoint(Server.endpoint)
    .setProject(Server.project);
    const account = new Account(client);
    const database = new Databases(client);
    const storage = new Storage(client);
    const avatars = new Avatars(client);

    api.sdk = { database, account, storage, avatars};
    return api.sdk;
  },

  signUp: async ({email, password, username}:User) => {
    return await api.provider().account.create("unique()", email, password, username);
  },
  createSession: async({email, password}: User) => {
    return await api.provider().account.createSession(email, password);
  },
  emailVerification: async(fallback: string) => {
    return api.provider().account.createVerification(fallback)
  },
  completeEmailVerification: async ({userId, secret}:{userId: string, secret: string}) => {
    await api.provider().account.updateVerification(userId, secret)
  },

  signIn: async ({email, password}: User) => {
    return await api.provider().account.createEmailSession(email, password);
  },

  signOut: async () => {
    return await api.provider().account.deleteSessions();
  },

  getUser: async () => {
    try {
      return await api.provider().account.get();
    }catch {
      return undefined;
    }
  },

  createDocument: ({message, userId}: {message: string, userId: string}) => {
    return api.provider().database.createDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, 'unique()', {message}, [Permission.delete(Role.user(userId))]);
  },

  listDocuments: (databaseId: string, collectionId: string) => {
    return api.provider().database.listDocuments(databaseId, collectionId);
  },

  listDocumentsWithQuery: async (): Promise<{message: string, $id: string}[]> => {
    const { documents: messages } = await api.provider().database.listDocuments(Server.conversationsDatabaseID, Server.conversationsCollectionID);
    return messages;
  },

  listTopicsWithQuery: async (): Promise<{
      subject: string, 
      $id: string, 
      starter: string, 
      beat: string, 
      createdBy: string, 
      user_account_id: string,
      isPrivate: boolean,
      created: Date,
      $permissions: string[],
      members: string[],
      convocount: number,
      countDocId: string,
      community: string,
      userAvatarId: string,
    }[]> => {
    const { documents: topics } = await api.provider().database.listDocuments(Server.topicsDatabaseID, Server.topicsCollectionID,
      [
        Query.notEqual("isPrivate", true),
        Query.orderDesc("created")

      ]);
    return topics;
  },

  deleteConversation: async (topicId: string): Promise<{
    $id: string,
  }[]> => {
    const {documents: conversations} = await api.provider().database.listDocuments(Server.conversationsDatabaseID, Server.conversationsCollectionID,
      [
        Query.equal("topicId", topicId)
      ]  
    )
    conversations.map( async (convo: any) => {
      await api.provider().database.deleteDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, convo.$id);
    })
    return conversations;
  },
  deleteTopic: async (id: string) => {
    await api.provider().database.deleteDocument(Server.topicsDatabaseID, Server.topicsCollectionID, id);
  },
  deleteConvoCount: async (convoDocId: string) => {
    await api.provider().database.deleteDocument(Server.convoCountDatabaseID, Server.convoCountCollectionID, convoDocId);
  },
  deleteConverstaionWithId: async (convoId: string) => {
    await api.provider().database.deleteDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, convoId);
  },

  createTopic: async (subject: string, starter: string, user_account_id: string, createdBy: string, community: string, beat?: string, isPrivate?: boolean, members?: string[], countDocId?: string, userAvatarId?: string, userAvatarHref?: string) => {
    const result = await api.provider().database.createDocument(Server.topicsDatabaseID, Server.topicsCollectionID, 'unique()', {
      subject,
      starter,
      beat,
      createdBy,
      created: new Date(Date.now()),
      user_account_id,
      isPrivate,
      members,
      countDocId,
      community,
      userAvatarId,
      userAvatarHref,
    },
    [
      Permission.delete(Role.user(user_account_id)), Permission.update(Role.user(user_account_id))
    ])
    return result
  },
  fetchLatestPosts: async(): Promise<{
    subject: string, 
    $id: string, 
    starter: string, 
    beat: string, 
    createdBy: string, 
    user_account_id: string,
    isPrivate: boolean,
    created: Date,
    community: string,
  }[]> => {
    const {documents: topics } = await api.provider().database.listDocuments(Server.topicsDatabaseID, Server.topicsCollectionID,
      [
        Query.equal("isPrivate", false),
        Query.orderDesc("created"),
        Query.limit(5)
      ]  
    );
    return topics;
  },

  fetchPostByTopicId: async($id: string): Promise<{
    subject: string, 
    $id: string, 
    starter: string, 
    beat: string, 
    createdBy: string, 
    user_account_id: string,
    isPrivate: boolean,
    created: Date,
    $permissions: string[],
    convocount: number,
    countDocId: string,
    members?: string[],
    community: string,
    userAvatarId: string,
    userAvatarHref: string,
  }> => {
    const result = await api.provider().database.getDocument(Server.topicsDatabaseID, Server.topicsCollectionID, $id);
    return result
  },
  fetchPrivateTopics: async(memberEmail: string): Promise<{
    subject: string, 
    $id: string, 
    starter: string, 
    beat: string, 
    createdBy: string, 
    user_account_id: string,
    isPrivate: boolean,
    created: Date,
    $permissions: string[],
    members: string[],
    convocount: number,
    countDocId: string,
    community: string,
    userAvatarId: string,
  }[]> => {
    const {documents: privateTopics } = await api.provider().database.listDocuments(Server.topicsDatabaseID, Server.topicsCollectionID,
      [
        Query.equal("isPrivate", true),
        Query.orderDesc("created")
      ]
    );
    return privateTopics;
  },

  fetchConversationByTopicId: async(topicId: string): Promise<{
    $id: string,
    content: string,
    created: Date,
    createdBy: string,
    topicId: string,
    userAccountId: string,
    parentConversationId?: string,
    commentType: string,
    $permissions: string[],
    avatarId: string,
    avatarHref: string,
  }[]> => {
    const {documents: conversations} = await api.provider().database.listDocuments(Server.conversationsDatabaseID, Server.conversationsCollectionID,
      [
        Query.equal("topicId", topicId)
      ]  
    );
    return conversations;
  },
  updateNameInConversationByUserId: async(userId: string, name: string) => {
    const {documents: convos} = await api.provider().database.listDocuments(Server.conversationsDatabaseID, Server.conversationsCollectionID, 
      [
        Query.equal("userAccountId", userId)
      ]);
      try{
        convos && await convos.forEach(async(convo: {$id: string, createdBy: string}) => {
          await api.provider().database.updateDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, convo.$id, 
            {
              createdBy: name,
            })
        })
      }catch (err) {
        console.error("Error updating name in conversation", err)
      }
  },
  testTopicByUserId: async(userId: string) => {
    const {documents: topics} = await api.provider().database.listDocuments(Server.topicsDatabaseID, Server.topicsCollectionID, 
      [
        Query.equal("user_account_id", userId)
      ]);
    return topics;
  },
  updateNameInTopicByUserId: async(userId: string, name: string) => {
    const {documents: topics} = await api.provider().database.listDocuments(Server.topicsDatabaseID, Server.topicsCollectionID, 
      [
        Query.equal("user_account_id", userId)
      ]);
      try{
        topics && await topics.forEach(async(topic: {$id: string, createdBy: string}) => {
          await api.provider().database.updateDocument(Server.topicsDatabaseID, Server.topicsCollectionID, topic.$id, 
            {
              createdBy: name,
            })
        })
      }catch (err) {
        console.error("Error updating name in topics", err)
      }
  },
  fetchConversationCount: async(topicId: string): Promise<{
    topicId: string,
    count: number,
  }[]> => {
    const {documents: count} = await api.provider().database.listDocuments(Server.convoCountDatabaseID, Server.convoCountCollectionID,
      [
        Query.equal("topicId", topicId)
      ]
    );
    return count;
  },

  submitCommentToTopicChain: async(content: string, createdBy: string,topicId: string, userAccountId: string, commentType: string, parentConversationId?: string, avatarId?: string, avatarHref?: string ) => {
    await api.provider().database.createDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, 'unique()', {
      content,
      created: new Date(Date.now()),
      createdBy,
      topicId,
      userAccountId,
      parentConversationId,
      commentType,
      avatarId,
      avatarHref,
    },
    [Permission.delete(Role.user(userAccountId)), Permission.update(Role.user(userAccountId))]) 
  },
  createCommentCount: async(topicId: string, convoCount: number) => {
    const result = await api.provider().database.createDocument(Server.convoCountDatabaseID, Server.convoCountCollectionID, 'unique()', {
      topicId,
      count: convoCount
    },
    );
    return result;
  },
  fetchSingleCommentCountByTopicId: async(docId: string): Promise<{
    topicId: string,
    count: number,
    $id: string
  }[]> => {
    const {documents: countDocId} = await api.provider().database.getDocument(Server.convoCountDatabaseID, Server.convoCountCollectionID, docId)
    return countDocId
  },
  fetchCommentCountByTopicId: async(topicId: string): Promise<{
    topicId: string,
    count: number,
    $id: string
  }[]> => {
    const {documents: countDocId} = await api.provider().database.listDocuments(Server.convoCountDatabaseID, Server.convoCountCollectionID,
      [
        Query.equal("topicId", topicId)
      ]  
    )
    return countDocId
  },
  fetchCommentCounts: async(): Promise<{
    topicId: string,
    count: number,
    $id: string
  }[]> => {
    const {documents: countDocId} = await api.provider().database.listDocuments(Server.convoCountDatabaseID, Server.convoCountCollectionID,
    )
    return countDocId
  },
  updateCommentCount: async(topicId: string, convoCount: number) => {
    await api.provider().database.updateDocument(Server.convoCountDatabaseID, Server.convoCountCollectionID, topicId,
      {
        count: convoCount
      }  
    )
  },

  editTopic: async (docId: string, starter: string, isPrivate?: boolean, beat?: string, members?: string[] ) => {
    await api.provider().database.updateDocument(Server.topicsDatabaseID, Server.topicsCollectionID, docId,  
      {
        starter,
        isPrivate,
        beat,
        members,
        community: "NA"
      }
    )
  },
  editComment: async (docId: string, commentToEdit: string, commentType: string) => {
    await api.provider().database.updateDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, docId,
      {
        content: commentToEdit,
        commentType,
      }  
    )
  },
  addCountDocIdToNewTopic: async (docId: string, countDocId: string) => {
    await api.provider().database.updateDocument(Server.topicsDatabaseID, Server.topicsCollectionID, docId,
      {
        countDocId,
      }  
    )
  },
  uploadPhoto: async(file: File) => {
    const result = await api.provider().storage.createFile(Server.bucketID, 'unique()', file);
    return result;
  },
  getUserInitials: async(name: string) => {
    return await api.provider().avatars.getInitials(name,200, 200);
  },
  getUserProfile: async(userId: string): Promise<{
    $id: string,
    userId: string,
    name: string,
    email: string,
    avatarId: string,
    role: string,
    flair: string,
    avatarHref: string,
  }[]> => {
    const {documents: userProfile } = await api.provider().database.listDocuments(Server.profileDatabaseID, Server.profileCollectionID, 
      [
        Query.equal("userId", userId)
      ]  
    )
    return userProfile;
  },
  createUserProfile: async(name: string, email: string, flair: string, role: string, userId: string, avatarId: string, avatarHref: string): Promise<{
    $id: string,
    userId: string,
    name: string,
    email: string,
    avatarId: string,
    role: string,
    flair: string,
    avatarHref: string,
  }[]> => {
    const result = api.provider().database.createDocument(Server.profileDatabaseID, Server.profileCollectionID, 'unique()', {
      name,
      email,
      flair,
      role,
      userId,
      avatarId,
      avatarHref,
    })
    return result
  },
  getAvatarById: async(avatarId: string): Promise<{
    href: string,
  }> => {
    const result = await api.provider().storage.getFilePreview(Server.bucketID, avatarId, 200,200,"center",100);
    return result;
  },
  updateName: async(name: string) => {
    await api.provider().account.updateName(name)
  },
  deleteProfilePhoto: async(fileId: string) => {
    await api.provider().storage.deleteFile(Server.bucketID, fileId);
  },
  updateProfile: async(docId: string, name?: string, flair?: string, avatarId?: string, avatarHref?: string) => {
    await api.provider().database.updateDocument(Server.profileDatabaseID, Server.profileCollectionID, docId, {
      name,
      flair,
      avatarId,
      avatarHref
    })
  },
  listAvatars: async() => {
    const {files} = await api.provider().storage.listFiles(Server.bucketID);
    return files;
  }



};

export default api;