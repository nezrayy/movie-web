import { create } from "zustand"; // menggunakan named import
import { persist } from "zustand/middleware"; // pastikan persist juga diimport dengan benar

interface SessionState {
  session: any;
  setSession: (session: any) => void;
}

const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      session: null, // initialize session as null
      setSession: (session: any) => set({ session }), // update session
    }),
    {
      name: "session-storage", // key in localStorage
      // @ts-ignore
      getStorage: () => localStorage, // specify storage as localStorage
    }
  )
);

export default useSessionStore;
