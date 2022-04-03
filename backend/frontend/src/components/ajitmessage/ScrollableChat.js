import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "./config/ChatLogics";
import { ChatState } from "../../context/chatProvider";
import { Avatar } from "@chakra-ui/avatar";
import { Tooltip } from "@chakra-ui/tooltip";
import ScrollableFeed from "react-scrollable-feed";
const ScrollableChat = ({ allmessage }) => {
  const { user } = ChatState();
  //   allmessage.map((ms) => {
  //     console.log(ms);
  //   });
  return (
    <ScrollableFeed>
      {allmessage &&
        allmessage.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(allmessage, m, i, user._id) ||
              isLastMessage(allmessage, i, user._id)) && (
              <Tooltip label={m.sender.name} placement="bottom-start" hasArrow>
                <Avatar
                  mt="7px"
                  mr={1}
                  size="sm"
                  cursor="pointer"
                  name={m.sender.name}
                  src={m.sender.pic}
                />
              </Tooltip>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
                }`,
                marginLeft: isSameSenderMargin(allmessage, m, i, user._id),
                marginTop: isSameUser(allmessage, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
