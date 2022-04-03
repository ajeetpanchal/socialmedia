import React, { useState, useEffect } from "react";
import { ChatState } from "../../context/chatProvider";
import { useToast } from "@chakra-ui/toast";
import { Box, Stack, Text, HStack, VStack } from "@chakra-ui/layout";
import ChatLoading from "../message/ChatLoading";
import axios from "axios";
import { Button } from "@chakra-ui/button";
import { AiOutlineHeart } from "react-icons/ai";
import { FcLike } from "react-icons/fc";
import { Textarea } from "@chakra-ui/react";

import {
  Avatar,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from "@chakra-ui/react";
import ScrollableFeed from "react-scrollable-feed";
const Feedques = ({ fetchAgain }) => {
  const [loggeduser, setloggeduser] = useState();
  const [ques, setques] = useState({});
  const [islike, setislike] = useState(false);
  const [like, setlike] = useState(0);
  const [vall, setvall] = useState();
  const [viewans, setviewans] = useState([]);
  const { user, questions, setquestions } = ChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  let [value, setValue] = React.useState("");
  const [scrollBehavior, setScrollBehavior] = React.useState("inside");

  const [icon, seticon] = React.useState(
    <Icon as={AiOutlineHeart} w={8} h={8} />
  );

  const btnRef = React.useRef();
  useEffect(() => {
    setloggeduser(JSON.parse(localStorage.getItem("userInfo")));
    fetchquestions();
    // eslint-disable-next-line
  }, []);
  useEffect(() => {
    setloggeduser(JSON.parse(localStorage.getItem("userInfo")));
    fetchquestions();
    // eslint-disable-next-line
  }, [fetchAgain]);
  const fetchquestions = async () => {
    const Id = user._id;
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get("/api/question/fetch", config);
      // console.log(data);
      setquestions(data);
      // console.log(questions + "from main page");
      // questions.map((qu) => console.log(qu));
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the questions",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(error);
    }
  };

  const fetchans = async (qu) => {
    onOpen();
    setviewans(qu.answers);
    setques(qu);
    setvall(0);
    // console.log(qu);
  };

  const addlike = async (answerId) => {
    if (islike === true) {
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/question/upvote",
        { answerId },
        config
      );
      console.log(data);
      setlike(data.upvotes.length);
      console.log(like);
      seticon(<Icon as={FcLike} w={8} h={8} />);
      setislike(true);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to like that question",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(error);
    }
  };
  const addans = (qu) => {
    setques(qu);
    setvall(1);
    onOpen();
  };

  let handleInputChange = (e) => {
    let inputValue = e.target.value;
    setValue(inputValue);
  };
  const postans = async () => {
    if (vall === 0) {
      onClose();
      return;
    }
    const answerInBody = value;
    if (answerInBody === "") {
      toast({
        title: "Error Occured!",
        description: "Please enter something in ans section",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
    const questionId = ques._id;
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/question/add",
        { answerInBody, questionId },
        config
      );
      setviewans([...viewans, data]);
      console.log(data);

      onClose();
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to add answer",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      console.log(error);
    }
  };
  return (
    <>
      <Box width="115vh" mt="2">
        {questions.length !== 0 ? (
          <Stack>
            {questions.map((qu) => (
              <Box
                px={3}
                py={2}
                borderRadius="lg"
                key={qu._id}
                boxShadow="xl"
                rounded="md"
                bg="white"
                border="1px"
                borderColor="black"
              >
                <Box borderBottom="1px" borderColor="#aeb4b6">
                  <HStack spacing="5" borderBottom="2px solid grey.400">
                    <Avatar
                      name={qu.user.name}
                      src={qu.user.pic}
                      h="10"
                      w="10"
                    />
                    <Text fontSize="xl" color="#171923" fontWeight="500">
                      {qu.user.name}
                    </Text>
                  </HStack>
                </Box>
                <Box>
                  <Text
                    textAlign="center"
                    fontFamily="serif"
                    fontWeight="bold"
                    fontSize="41px"
                    color="#81E6D9"
                  >
                    {qu.questionName}
                  </Text>
                </Box>
                <Box mt="4" ml="3" mr="2" fontWeight={500} fontSize="17px">
                  <Text>{qu.content}</Text>
                </Box>
                <Box>
                  <Button ml="3" ref={btnRef} onClick={() => fetchans(qu)}>
                    View all Answers
                  </Button>
                  <Button bg="#63B3ED" m="2" onClick={() => addans(qu)}>
                    Give Answer
                  </Button>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        scrollBehavior={scrollBehavior}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{ques.questionName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {vall === 0 ? (
              <>
                {viewans.length > 0 ? (
                  <Stack>
                    {viewans.map((m) => (
                      <Box
                        key={m._id}
                        boxShadow="xl"
                        rounded="md"
                        bg="white"
                        border="1px"
                        borderColor="black"
                        px={2}
                      >
                        <Box borderBottom="1px" borderColor="#aeb4b6">
                          <HStack spacing="5" borderBottom="2px solid grey.400">
                            <Avatar
                              name={m.user.name}
                              src={m.user.pic}
                              h="7"
                              w="7"
                            />
                            <Text
                              fontSize="lg"
                              color="#171923"
                              fontWeight="500"
                            >
                              {m.user.name}
                            </Text>
                          </HStack>
                        </Box>
                        <Box>
                          <Text>{m.content}</Text>
                        </Box>
                        <Box>
                          <Button
                            ml="1"
                            bg="white"
                            _hover={{
                              bg: "white",
                              borderColor: "none",
                              outlineColor: "none",
                            }}
                            onClick={() => addlike(m._id)}
                          >
                            {icon}
                            {like !== 0 ? like : m.upvotes.length}
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                ) : (
                  <Text>Be a first one to ans the question</Text>
                )}
              </>
            ) : (
              <>
                <Textarea
                  value={value}
                  onChange={handleInputChange}
                  placeholder="Give your answer"
                  size="sm"
                  resize="vertical"
                />
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={postans}>
              {vall === 0 ? <>CLose</> : <>Post</>}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Feedques;
