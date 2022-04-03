import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/chatProvider";
import {
  IconButton,
  Spinner,
  FormControl,
  Input,
  StatLabel,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Text } from "@chakra-ui/layout";
import { getSender, getSenderFull } from "./config/ChatLogics";
import ProfileModal from "./useravatar/ProfileModel";
import { Button } from "@chakra-ui/button";
import { useToast } from "@chakra-ui/toast";
import "./SlideDrawer.css";
import axios from "axios";
import "./SlideDrawer.css";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";
import Lottie from "react-lottie";
import animationData from "./animations/3759-typing.json";
const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;
export const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const {
    selectedChat,
    setSelectedChat,
    user,
    setUser,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();
  const [allmessage, setallmessage] = useState("");
  const [loading, setloading] = useState(false);
  const [newmessage, setnewmessage] = useState();
  const [socketconnected, setsocketconnected] = useState(false);
  const [typing, settyping] = useState(false);
  const [istyping, setistyping] = useState(false);
  const toast = useToast();
  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);

    socket.on("connected", () => setsocketconnected(true));
    console.log("connection made");
    socket.on("typing", () => setistyping(true));
    socket.on("stoptyping", () => setistyping(false));
  }, []);
  useEffect(() => {
    fetchmessages();
    setnewmessage("");
    settyping(false);
    selectedChatCompare = selectedChat;
    // eslint-disable-next-line
  }, [selectedChat]);
  // console.log("notification accur", notification);
  // console.log("length of notification is ", notification.length);
  useEffect(() => {
    socket.on("message received", (newmessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newmessageReceived.chat._id
      ) {
        //give notification
        if (!notification.includes(newmessageReceived)) {
          setNotification([newmessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setallmessage([...allmessage, newmessageReceived]);
      }
    });
  });
  const fetchmessages = async () => {
    // console.log(selectedChat._id);
    if (!selectedChat) {
      return;
    }
    try {
      setloading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/${selectedChat._id}`, config);
      setallmessage(data);
      setloading(false);
      socket.emit("join chat", selectedChat._id);
      // console.log("from fetch messages");
      // console.log(allmessage);
    } catch (e) {
      toast({
        title: "something went wrong couldn't load message",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };
  const sendMessage = async (event) => {
    if (event.key === "Enter" && newmessage) {
      socket.emit("stoptyping", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setnewmessage("");
        const { data } = await axios.post(
          "/sendmessage",
          {
            content: newmessage,
            chatId: selectedChat._id,
          },
          config
        );
        socket.emit("new message", data);
        setallmessage([...allmessage, data]);
        console.log(allmessage);
      } catch (error) {
        toast({
          title: " couldn't send message",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  };
  const typingHandler = (e) => {
    setnewmessage(e.target.value);

    //typic Indicator Logics
    if (!socketconnected) {
      console.log("not connected..");
      return;
    }
    if (!typing) {
      socket.emit("typing", selectedChat._id);
      settyping(true);
    }
    console.log(selectedChat);
    //function that decide when user stop typing
    let lasttypingtime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timediffrence = timeNow - lasttypingtime;
      if (timediffrence >= timerLength && typing) {
        socket.emit("stoptyping", selectedChat._id);

        console.log("stop typing");
        settyping(false);
      }
    }, timerLength);
  };
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            d="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
            color="#37837f"
          >
            <IconButton
              d={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {getSender(user, selectedChat.users)}
            <ProfileModal user={getSenderFull(user, selectedChat.users)} />
          </Text>
          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className="message">
                <ScrollableChat allmessage={allmessage} />
              </div>
            )}
            {
              <Box d="flex" flexDirection="row" justifyContent="space-between">
                <FormControl
                  onKeyDown={sendMessage}
                  id="first-name"
                  isRequired
                  mt={1}
                >
                  {istyping ? (
                    <div>
                      <Lottie
                        options={defaultOptions}
                        width={70}
                        style={{ marginBottom: 15, marginLeft: 0 }}
                      />
                    </div>
                  ) : (
                    <></>
                  )}
                  <Input
                    variant="filled"
                    bg="#E0E0E0"
                    placeholder="Enter a message.."
                    value={newmessage}
                    onChange={typingHandler}
                    fontSize="3xl"
                    outlineColor="#00000036"
                  />
                </FormControl>
              </Box>
            }
          </Box>
        </>
      ) : (
        <Box d="flex" alignItems="center" justifyContent="center" h="100%">
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};
