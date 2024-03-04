import { useDBStore } from "@/lib/store";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

const DeleteChannel = () => {
  const deleteChannel = useDBStore((state) => state.deleteChannel);

  const onDeleteChannel = async () => {
    try {
      const confirmed = window.confirm(
        "Are you sure you want to delete this channel?"
      );

      if (confirmed) {
        // Define the data you want to send as JSON
        await deleteChannel();
        console.log("Channel deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting channel:", error);
    }
  };

  return (
    <div
      className="absolute left-40 top-5 cursor-pointer z-10"
      onClick={onDeleteChannel}
    >
      <div className="rounded-full p-4 bg-transparent  hover:bg-slate-700 transition duration-200 ease-in-out ">
        <FontAwesomeIcon icon={faTrashCan} size="lg" />
      </div>
    </div>
  );
};

export default DeleteChannel;
