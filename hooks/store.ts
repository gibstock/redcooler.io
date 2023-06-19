import { create } from 'zustand';
import { devtools} from 'zustand/middleware';

interface BearState {
  bears: number;
  increase: (by: number) => void;
}

export const useBearStore = create<BearState>()(
  devtools(
    (set) => ({
      bears: 0,
      increase: (by) => set((state) => ({ bears: state.bears + by})),
    })
  )
)

type User = {
  $id: string,
  name: string,
  email: string,
  registration: string,
  $permissions: string[]
}

type UserProfile = {
  $id: string;
  userId: string;
  name: string;
  email: string;
  avatarId: string;
  role: string;
  flair: string;
}[]

type UserInitials = {
  href: string
}

interface UserStore {
  user: User | null,
  setUser: (user: User | null) => void,
  userProfile: UserProfile | null ,
  setUserProfile: (userProfile: UserProfile | null) => void,
  userAvatar: string | null,
  setUserAvatar: (userAvatar: string | null) => void,
  userInitials: UserInitials | null,
  setUserInitials: (userInitials: UserInitials | null) => void,
  currentDoc: string | null,
  setCurrentDoc: (docId: string) => void,
  contentToEdit: string | null,
  setContentToEdit: (content: string) => void,
  titleToEdit: string | null,
  setTitleToEdit: (title: string) => void,
  emailsForEdit: string[],
  setEmailsForEdit: (emails: string[]) => void,
  convoCount: number,
  setConvoCount: (old: number) => void,
  beatToEdit: string | null,
  setBeatToEdit: (beat: string) => void,
  isPrivateToEdit: boolean | null,
  setIsPrivateToEdit: (isPrivate: boolean) => void,
  commentToEdit: string | null,
  setCommentToEdit: (content: string) => void,
  mark: string | null,
  setMark: (type: string) => void,
  topicId: string | null,
  setTopicId: (topicId: string) => void,
  commentId: string | null,
  setCommentId: (commentId: string) => void,

}

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user: user})),
      userProfile: null,
      setUserProfile: (userProfile) => set(() => ({userProfile: userProfile})),
      userAvatar: null,
      setUserAvatar: (userAvatar) => set(() => ({ userAvatar: userAvatar})),
      userInitials: null,
      setUserInitials: (userInitials) => set(() => ({ userInitials: userInitials})),
      currentDoc: null,
      setCurrentDoc: (docId) => set(() => ({currentDoc: docId})),
      contentToEdit: null,
      setContentToEdit: (content) => set(() =>({contentToEdit: content})),
      titleToEdit: null,
      setTitleToEdit: (title) => set(() => ({titleToEdit: title})),
      emailsForEdit: [],
      setEmailsForEdit: (emails) => set(() => ({emailsForEdit: emails})),
      convoCount: 0,
      setConvoCount: (old) => set(() => ({convoCount: old + 1})),
      beatToEdit: null,
      setBeatToEdit: (beat) => set(() => ({beatToEdit: beat})),
      isPrivateToEdit: null,
      setIsPrivateToEdit: (isPrivate) => set(() => ({isPrivateToEdit: isPrivate})),
      commentToEdit: null,
      setCommentToEdit: (content) => set(() => ({commentToEdit: content})),
      mark: null,
      setMark: (type) => set(() => ({ mark: type})),
      topicId: null,
      setTopicId: (topicId) => set(() => ({ topicId: topicId})),
      commentId: null,
      setCommentId: (commentId) => set(() => ({ commentId: commentId}))
    })
  )
)