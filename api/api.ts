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
  // ACCOUNT METHODS
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
  updateName: async(name: string) => {
    await api.provider().account.updateName(name)
  },
  // GENERAL METHODS
  // TOPIC METHODS
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
  deleteTopic: async (id: string) => {
    await api.provider().database.deleteDocument(Server.topicsDatabaseID, Server.topicsCollectionID, id);
  },
  createTopic: async (subject: string, starter: string, user_account_id: string, createdBy: string, community: string, beat?: string, isPrivate?: boolean, members?: string[], countDocId?: string, userAvatarId?: string, userAvatarHref?: string, audioFileId?: string) => {
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
      audioFileId,
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
    audioFileId: string,
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
    audioFileId: string,
  }[]> => {
    const {documents: privateTopics } = await api.provider().database.listDocuments(Server.topicsDatabaseID, Server.topicsCollectionID,
      [
        Query.equal("isPrivate", true),
        Query.orderDesc("created")
      ]
    );
    return privateTopics;
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
  updateAvatarHrefInTopicByUserId: async(userId: string, avatarHref: string, avatarId: string) => {
    const {documents: topics} = await api.provider().database.listDocuments(Server.topicsDatabaseID, Server.topicsCollectionID, 
      [
        Query.equal("user_account_id", userId)
      ]);
      console.log("topics returned from update avatar href method", topics)
      try{
        topics && await topics.forEach(async(topic: {$id: string}) => {
          console.log("topic $id to try", topic)
          const res = await api.provider().database.updateDocument(Server.topicsDatabaseID, Server.topicsCollectionID, topic.$id, 
            {
              userAvatarHref: avatarHref,
              userAvatarId: avatarId
            })
            console.log("topic update", res)
        })
      }catch (err) {
        console.error("Error updating avatarHref in topics", err)
      }
      return topics;
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
  addCountDocIdToNewTopic: async (docId: string, countDocId: string) => {
    await api.provider().database.updateDocument(Server.topicsDatabaseID, Server.topicsCollectionID, docId,
      {
        countDocId,
      }  
    )
  },
  // CONVERSATION METHODS
  createDocument: ({message, userId}: {message: string, userId: string}) => {
    return api.provider().database.createDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, 'unique()', {message}, [Permission.delete(Role.user(userId))]);
  },
  listDocumentsWithQuery: async (): Promise<{message: string, $id: string}[]> => {
    const { documents: messages } = await api.provider().database.listDocuments(Server.conversationsDatabaseID, Server.conversationsCollectionID);
    return messages;
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
  deleteConverstaionWithId: async (convoId: string) => {
    await api.provider().database.deleteDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, convoId);
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
  fetchConversationsByUserId: async(userId: string) => {
    const {documents: convos} = await api.provider().database.listDocuments(Server.conversationsDatabaseID, Server.conversationsCollectionID, 
      [
        Query.equal("userAccountId", userId)
      ])
    return convos;
  },
  updateAvatarHrefByConvoById: async(convoId: string, avatarHref: string, avatarId: string) => {
    const {document: convo} = await api.provider().database.updateDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, convoId, 
      {
        avatarHref,
        avatarId
      })
    return convo;
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
  updateAvatarInConversationByUserId: async(userId: string, avatarHref: string) => {
    const {documents: convos} = await api.provider().database.listDocuments(Server.conversationsDatabaseID, Server.conversationsCollectionID, 
      [
        Query.equal("userAccountId", userId)
      ]);
      try{
        convos && await convos.forEach(async(convo: {$id: string}) => {
          const updatedDoc = await api.provider().database.updateDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, convo.$id, 
            {
              avatarHref: avatarHref,
            })
          })
        }catch (err) {
          console.error("Error updating avatarHref in conversation", err)
        }
    return convos
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
  editComment: async (docId: string, commentToEdit: string, commentType: string) => {
    await api.provider().database.updateDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, docId,
      {
        content: commentToEdit,
        commentType,
      }  
    )
  },
  // COUNT METHODS
  deleteConvoCount: async (convoDocId: string) => {
    await api.provider().database.deleteDocument(Server.convoCountDatabaseID, Server.convoCountCollectionID, convoDocId);
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
  // PROFILE METHODS
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
  updateProfile: async(docId: string, name?: string, flair?: string, avatarId?: string, avatarHref?: string) => {
    const updatedProfile = await api.provider().database.updateDocument(Server.profileDatabaseID, Server.profileCollectionID, docId, {
      name,
      flair,
      avatarId,
      avatarHref
    })
    return updatedProfile;
  },
  checkUsernameExists: async(username: string) => {
    const {documents: profile} = await api.provider().database.listDocuments(Server.profileDatabaseID, Server.profileCollectionID,
      [
        Query.equal("name", username)
      ]
      )
    return profile;
  },

  // PHOTO STORAGE BUCKET METHODS
  uploadPhoto: async(file: File) => {
    const result = await api.provider().storage.createFile(Server.bucketID, 'unique()', file);
    return result;
  },
  getUserInitials: async(name: string) => {
    return await api.provider().avatars.getInitials(name,200, 200);
  },
  getAvatarById: async(avatarId: string): Promise<{
    href: string,
  }> => {
    const result = await api.provider().storage.getFilePreview(Server.bucketID, avatarId, 200,200,"center",100);
    return result;
  },
  deleteProfilePhoto: async(fileId: string) => {
    await api.provider().storage.deleteFile(Server.bucketID, fileId);
  },
  
  listAvatars: async() => {
    const {files} = await api.provider().storage.listFiles(Server.bucketID);
    return files;
  },
  // AUDIO STORAGE BUCKET METHODS
  uploadAudioFile: async(file: File) => {
    return await api.provider().storage.createFile(Server.audioBucketID, 'unique()', file);
  },
  streamAudioFile: async(fileId: string) => {
    return await api.provider().storage.getFileView(Server.audioBucketID, fileId);
  }
};

export default api;