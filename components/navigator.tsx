import { useDBStore } from "@/lib/store";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export interface IChannel {
  id: number;
  channel_name: string;
}

export default function Nav() {
  const currentChannelId = useDBStore((state) => state.channel);
  const userId = useDBStore((state) => state.user);
  const channels = useDBStore((state) => state.channels);
  const setChannel = useDBStore((state) => state.setChannel);
  const addChannel = useDBStore((state) => state.addChannel);
  const getChannels = useDBStore((state) => state.getChannels);
  const [isAdding, setIsAdding] = useState(false);

  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    const { newChannelName } = data;
    await addChannel(newChannelName);
    setIsAdding(false);
    getChannels();
  };

  const onChannelClick = (id: number) => {
    setChannel(id);
  };

  useEffect(() => {
    getChannels();
  }, []);
  return (
    <div className="border max-w-32 w-full p-2">
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
      {isAdding ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            className="w-full bg-transparent border"
            type="text"
            {...register("newChannelName", { required: true, value: "" })}
          />
        </form>
      ) : (
        <div onClick={() => setIsAdding(true)}>
          <FontAwesomeIcon icon={faPlus} size="xl" />
        </div>
      )}
    </div>
  );
}
