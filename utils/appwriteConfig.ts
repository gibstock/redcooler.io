export const Server = {
  endpoint : process.env.NEXT_PUBLIC_ENDPOINT!,
  project : process.env.NEXT_PUBLIC_PROJECT!,
  conversationsCollectionID : process.env.NEXT_PUBLIC_CONVERSATIONS_COLLECTION!,
  conversationsDatabaseID : process.env.NEXT_PUBLIC_CONVERSATIONS_DATABASE!,
  topicsCollectionID : process.env.NEXT_PUBLIC_TOPICS_COLLECTION!,
  topicsDatabaseID : process.env.NEXT_PUBLIC_TOPICS_DATABASE!,
  convoCountDatabaseID : process.env.NEXT_PUBLIC_CONVOCOUNT_DATABASE!,
  convoCountCollectionID : process.env.NEXT_PUBLIC_CONVOCOUNT_COLLECTION!,
  profileDatabaseID : process.env.NEXT_PUBLIC_PROFILE_DATABASE!,
  profileCollectionID : process.env.NEXT_PUBLIC_PROFILE_COLLECTION!,
  bucketID: process.env.NEXT_PUBLIC_BUCKET_ID!,
  apiKey: process.env.NEXT_PUBLIC_API_KEY!,
  audioBucketID: process.env.NEXT_PUBLIC_AUDIO_BUCKET_ID!,
  audioApiKey: process.env.NEXT_PUBLIC_AUDIO_API_KEY!
}