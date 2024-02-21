import { IMessage } from "@/app/page";
import { IChannel } from "@/components/navigator";
import axios from "axios";
import { create } from "zustand";

interface DBStore {
  user: number;
  channel: number;
  channels: IChannel[];
  messages: IMessage[];
  fetchMessages: (channelId: number, userId: number) => Promise<void>;
  addDataUI: (data: IMessage) => Promise<void>;
  setChannel: (channelId: number) => Promise<void>;
  getChannels: (userId: number) => Promise<void>;
}

export const useDBStore = create<DBStore>((set) => ({
  user: 1,
  channel: 1,
  channels: [],
  messages: [],
  fetchMessages: async (channelId, userId) => {
    const response = await axios.post(`api/supabase/channel/${channelId}`, {
      userId: userId,
    });
    const { data } = response.data;
    set((state) => ({ messages: data }));
  },
  addDataUI: async (data: any) => {
    set((state) => ({ messages: [...state.messages, data] }));
  },
  setChannel: async (channelId: number) => {
    set((state) => ({ channel: channelId }));
  },
  getChannels: async (userId: number) => {
    try {
      const response = await axios.post("api/supabase/channel", {
        userId: userId,
      });

      const { data } = response.data;
      set((state) => ({ channels: data }));
    } catch (error) {
      console.error("Error refreshing channels:", error);
    }
  },
}));
