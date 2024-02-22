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
  addChannel: (newChannel: string) => Promise<void>;
  setChannel: (channelId: number) => Promise<void>;
  getChannels: () => Promise<void>;
}

export const useDBStore = create<DBStore>((set, get) => ({
  user: 1,
  channel: 1,
  channels: [],
  messages: [],
  fetchMessages: async (channelId, userId) => {
    const response = await axios.get(
      `api/supabase/channel/message?userId=${userId}&channelId=${channelId}`
    );
    const { data } = response.data;
    set((state) => ({ messages: data }));
  },
  addDataUI: async (newData: IMessage) => {
    set((state) => ({ messages: [...state.messages, newData] }));
  },
  setChannel: async (channelId: number) => {
    set((state) => ({ channel: channelId }));
  },
  addChannel: async (newChannelName: string) => {
    const userId = get().user;
    const newChannelData: IChannel = {
      id: 123,
      channel_name: newChannelName,
    };

    set((state) => ({ channels: [newChannelData, ...state.channels] }));
    try {
      await axios.post(
        `api/supabase/channel?userId=${userId}&newChannel=${newChannelName}`
      );
    } catch (error) {
      console.error(error);
    }
  },
  getChannels: async () => {
    const userId = get().user;

    try {
      const response = await axios.get(`api/supabase/channel?userId=${userId}`);
      const { data } = response.data;
      set((state) => ({ channels: data }));

      // Set the default channel to the most recent channelId
      const mostRecentChannelId = data.length > 0 ? data[0].id : 1;
      set((state) => ({ channel: mostRecentChannelId }));
    } catch (error) {
      console.error("Error refreshing channels:", error);
    }
  },
}));
