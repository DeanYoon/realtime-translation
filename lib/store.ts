import { IMessage } from "@/app/page";
import axios from "axios";
import { create } from "zustand";

type DBStore = {
  DBData: IMessage[];
  refreshDB: () => Promise<void>;
};

export const useDBStore = create<DBStore>((set) => ({
  DBData: [],
  refreshDB: async () => {
    const response = await axios.get("api/supabase");
    const { data } = response.data;
    set((state) => ({ DBData: data }));
  },
}));
