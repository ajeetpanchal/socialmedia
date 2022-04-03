import React, { useState } from "react";
import {
  Box,
  VStack,
  Avatar,
  Input,
  Button,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { Icon } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/toast";
import { ChatState } from "../../context/chatProvider";
import axios from "axios";
const Askques = ({ fetchAgain, setFetchAgain }) => {
  const { user } = ChatState();
  const [title, settitle] = useState("");
  const [loading, setloading] = useState(false);
  const [des, setdes] = useState("");
  const toast = useToast();
  const createques = async () => {
    if (!title || !des) {
      toast({
        title: "Please Enter something in description",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    } else {
      try {
        setloading(true);

        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.post(
          `/api/question/create`,
          { title, des },
          config
        );
        setloading(false);
        JSON.stringify(data);
        console.log(data);
        settitle("");
        setdes("");
        setFetchAgain(true);
      } catch (e) {
        setloading(false);
        toast({
          title: "Error Occured!",
          description: "Failed to create question",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom-left",
        });
      }
    }
  };
  return (
    <>
      <Box
        width="115vh"
        border="3px solid grey.500"
        borderRadius="20px"
        boxShadow="md"
        rounded="md"
        bg="white"
      >
        <VStack
          //divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="stretch"
        >
          <Box>
            <HStack spacing="2">
              <Box ml="2">
                <Avatar name={user.name} src={user.pic} />
              </Box>

              <Box w="87%">
                <Input
                  variant="flushed"
                  placeholder={"What's your question title " + user.name + "?"}
                  m="2"
                  value={title}
                  onChange={(e) => settitle(e.target.value)}
                />

                <Input
                  w="100%"
                  variant="flushed"
                  placeholder={"describe your question " + user.name + "?"}
                  m="2"
                  value={des}
                  onChange={(e) => setdes(e.target.value)}
                />
              </Box>
            </HStack>
          </Box>
          <Box h="50px" d="flex" alignItems="center" m="2">
            <Button ml="3">
              <Icon as={HiOutlinePhotograph} w={5} h={5} />
              Photo
            </Button>
            <Button bg="#63B3ED" m="2" onClick={createques}>
              Post
            </Button>
          </Box>
        </VStack>
      </Box>
    </>
  );
};

export default Askques;
