import { Client, Databases, Account, Permission, Role, ID} from 'appwrite';
import { Server } from '../utils/appwriteConfig';

type SDK = {
  database: Databases;
  account: Account;
}
type User = {
  email: string;
  password: string;
  username?: string;
}

type CreateDocument = {
  databaseId: string;
  collectionId: string;
  data: {message: string};
  permissions?: string;
}

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

  deleteMessage: async (id: string) => {
    await api.provider().database.deleteDocument(Server.conversationsDatabaseID, Server.conversationsCollectionID, id);
  }

};

export default api;