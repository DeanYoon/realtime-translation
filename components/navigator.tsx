import { useDBStore } from "@/lib/store";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
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

  const inputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit } = useForm();
  const { ref } = register("");

  const onSubmit = async (data: any) => {
    const { newChannelName } = data;
    await addChannel(newChannelName);
    setIsAdding(false);
    getChannels();
  };

  const onChannelClick = (id: number) => {
    setChannel(id);
  };

  //input 밖 클릭 시 input 사라지게
  const handleClickOutside = (event: any) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      // Click occurred outside the input element
      setIsAdding(false);
    }
  };

  useEffect(() => {
    getChannels();

    //input 밖 클릭 시 input 사라지게

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
          <div ref={inputRef} onClick={handleClickOutside}>
            {/* input 밖 클릭 시 input 사라지게 */}

            <input
              className="w-full bg-transparent border"
              type="text"
              {...register("newChannelName", { required: true, value: "" })}
            />
          </div>
        </form>
      ) : (
        <div onClick={() => setIsAdding(true)} className="cursor-pointer">
          <FontAwesomeIcon icon={faPlus} size="xl" />
        </div>
      )}
    </div>
  );
}
