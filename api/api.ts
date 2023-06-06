import { Client, Databases, Account, Permission, Role, Query, ID} from 'appwrite';
import { Server } from '../utils/appwriteConfig';
import { v4 as uuidv4 } from 'uuid';

let docUuid = uuidv4();

// type SDK = {
//   database: Databases;
//   account: Account;
// }
type User = {
  email: string;
  password: string;
  username?: string;
}

// type CreateDocument = {
//   databaseId: string;
//   collectionId: string;
//   data: {message: string};
//   permissions?: string;
// }

let api = {
  sdk: null as unknown,
  provider: ():any => {
    if(api.sdk) {
      return api.sdk;
    }
    let client = new Client();
    client.setEndpoint(Server.endpoint).setProject(Server.project);
    const account = new Account(client);
    const database = new Databases(client);

    api.sdk = { database, account};
    return api.sdk;
  },

  signUp: async ({email, password, username}:User) => {
    return await api.provider().account.create("unique()", email, password, username);
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
      $permissions: string[]
    }[]> => {
    const { documents: topics } = await api.provider().database.listDocuments(Server.topicsDatabaseID, Server.topicsCollectionID);
    return topics;
  },

  deleteConversation: async (id: string) => {
    await api.provider().database.deleteDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, id);
  },
  deleteTopic: async (id: string) => {
    await api.provider().database.deleteDocument(Server.topicsDatabaseID, Server.topicsCollectionID, id);
  },

  createTopic: async (subject: string, starter: string, user_account_id: string, createdBy: string, beat?: string, isPrivate?: boolean) => {
    await api.provider().database.createDocument(Server.topicsDatabaseID, Server.topicsCollectionID, 'unique()', {
      id: docUuid,
      subject,
      starter,
      beat,
      createdBy,
      created: new Date(Date.now()),
      user_account_id,
      isPrivate,
    },
    [Permission.delete(Role.user(user_account_id))])
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
  }[]> => {
    const {documents: topics } = await api.provider().database.listDocuments(Server.topicsDatabaseID, Server.topicsCollectionID,
      [
        Query.equal("isPrivate", false),
        Query.limit(5)
      ]  
    );
    return topics;
  },

  fetchPostByTopicId: async($id: string, user_account_id: string): Promise<{
    subject: string, 
    $id: string, 
    starter: string, 
    beat: string, 
    createdBy: string, 
    user_account_id: string,
    isPrivate: boolean,
    created: Date,
  }[]> => {
    const {documents: topic } = await api.provider().database.listDocuments(Server.topicsDatabaseID, Server.topicsCollectionID, 
      [
        Query.equal("topicId", $id ),
        Query.notEqual("isPrivate", true),
        Query.equal("userAccountId", user_account_id)
      ]
    );
    return topic
  },
  fetchPrivateTopics: async(user_account_id: string): Promise<{
    subject: string, 
    $id: string, 
    starter: string, 
    beat: string, 
    createdBy: string, 
    user_account_id: string,
    isPrivate: boolean,
    created: Date,
  }[]> => {
    const {documents: topics } = await api.provider().database.listDocuments(Server.topicsDatabaseID, Server.topicsCollectionID,
      [
        Query.equal("isPrivate", true),
        Query.equal("userAccountId", user_account_id)
      ]
    );
    return topics;
  }


};

export default api;