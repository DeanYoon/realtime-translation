import { Message } from "@/types/collection";

const TextCard = ({ message }: { message: Message }) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div>{message.input}</div>
      <div>{message.translated}</div>
    </div>
  );
};

export default TextCard;
