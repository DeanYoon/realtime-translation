import { IMessage } from "@/app/page";
import { Message } from "@/types/collection";

const TextCard = ({ message }: { message: IMessage }) => {
  return (
    <div className="flex flex-col w-full items-center justify-between">
      <div className="w-2/5 border ">{message.input}</div>
      <div className="w-2/5 border bg-red-500">{message.translated}</div>
    </div>
  );
};

export default TextCard;
