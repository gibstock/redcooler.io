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
}

interface UserStore {
  user: User | null,
  setUser: (user: User | null) => void,
  currentDoc: string | null,
  setCurrentDoc: (docId: string) => void
}

export const useUserStore = create<UserStore>()(
  devtools(
    (set) => ({
      user: null,
      setUser: (user) => set(() => ({ user: user})),
      currentDoc: null,
      setCurrentDoc: (docId) => set(() => ({currentDoc: docId}))

    })
  )
)