import { useDBStore } from "@/lib/store";
import { useEffect } from "react";

export interface IChannel {
  id: number;
  channel_name: string;
}

export default function Nav() {
  const currentChannelId = useDBStore((state) => state.channel);
  const userId = useDBStore((state) => state.user);
  const channels = useDBStore((state) => state.channels);
  const setChannel = useDBStore((state) => state.setChannel);
  const getChannels = useDBStore((state) => state.getChannels);

  const onChannelClick = (id: number) => {
    console.log(id);
    setChannel(id);
  };

  useEffect(() => {
    getChannels(userId);
  }, []);
  return (
    <div className="border max-w-32 w-full">
      {channels.map((channel) => (
        <div
          key={channel.id}
          onClick={() => onChannelClick(channel.id)}
          className={`cursor-pointer ${
            currentChannelId === channel.id ? "text-red-500" : "text-white"
          }`}
        >
          {channel.channel_name}
        </div>
      ))}
    </div>
  );
}
