import React, { useState } from "react";
import NavBar from "../Navbar/Navbar";
import { ChatState } from "../../context/chatProvider";
import { Box, VStack, Avatar, Input, Button, HStack } from "@chakra-ui/react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { Icon } from "@chakra-ui/react";
import Askques from "./Askques";
import Feedques from "./Feedques";
import ScrollableFeed from "react-scrollable-feed";
const QuesPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  console.log(user);
  return (
    <>
      <NavBar />
      <ScrollableFeed>
        <Box
          borderTop="2px solid black"
          d="flex"
          justifyContent="space-between"
          flexDirection="column"
          alignItems="center"
          w="100%"
          //overflowY="scroll"
        >
          {user && (
            <Askques fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}

          {user && <Feedques fetchAgain={fetchAgain} />} 
        </Box>
      </ScrollableFeed>
    </>
  );
};

export default QuesPage;
