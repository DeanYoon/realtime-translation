import { IMessage } from "@/app/page";
import { Message } from "@/types/collection";

const TextCard = ({ message }: { message: IMessage }) => {
  return (
    <div className="flex flex-col w-full text-lg   items-center justify-between">
      <div className="w-full border p-1">{message.input}</div>
      <div className="w-full border bg-red-500 bg-opacity-40 p-1">
        {message.translated}
      </div>
    </div>
  );
};

export default TextCard;
