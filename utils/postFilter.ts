type Posts = {
  subject: string;
  $id: string;
  starter: string;
  beat: string;
  createdBy: string;
  user_account_id: string;
  isPrivate: boolean;
  created: Date;
  $permissions: string[];
  members: string[];
  convocount: number;
  countDocId: string;
  community: string;
  userAvatarId: string;
  audioFileId: string;
}[] | undefined

export const postFiler = (posts: Posts, isPrivate: boolean) => {
  return posts?.filter((post) => post.isPrivate === isPrivate);
}