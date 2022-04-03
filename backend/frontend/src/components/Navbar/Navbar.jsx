import React from "react";
import { Link, Box, Flex, Text, Stack } from "@chakra-ui/react";
import "./navbar.css";
import { IoMdHome } from "react-icons/io";
import { BsChatTextFill } from "react-icons/bs";
import { BsPatchQuestionFill } from "react-icons/bs";
import { MdAccountCircle } from "react-icons/md";

import { Icon } from "@chakra-ui/react";
import Logo from "./Logo";

const NavBar = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="navbar">
      <NavBarContainer {...props} >
        <Logo
        color={["#000000", "#000000", "primary.500", "primary.500"]}
        />
        <MenuToggle toggle={toggle} isOpen={isOpen} />
        <MenuLinks isOpen={isOpen} />
      </NavBarContainer>
    </div>
  );
};

const CloseIcon = () => (
  <svg width="24" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <title>Close</title>
    <path
      fill="Teal 300"
      d="M9.00023 7.58599L13.9502 2.63599L15.3642 4.04999L10.4142 8.99999L15.3642 13.95L13.9502 15.364L9.00023 10.414L4.05023 15.364L2.63623 13.95L7.58623 8.99999L2.63623 4.04999L4.05023 2.63599L9.00023 7.58599Z"
    />
  </svg>
);

const MenuIcon = () => (
  <svg
    width="24px"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
    fill="Teal 300"
  >
    <title>Menu</title>
    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
  </svg>
);

const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  );
};

const MenuItem = ({ children, isLast, to = "/", ...rest }) => {
  return (
    <Link href={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};

const MenuLinks = ({ isOpen }) => {
  let user = localStorage.getItem("userInfo")
  user = JSON.parse(user);

  return (
    <Box
      display={{ base: isOpen ? "block" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
    >
      <Stack
        spacing={12}
        align="center"
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["column", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
      >
        <MenuItem to="/home">
          <Icon as={IoMdHome} w={"55px"} h={"55px"} />
        </MenuItem>

        <MenuItem to="/ques">
          <Icon as={BsPatchQuestionFill} w={"45px"} h={"45px"} />
        </MenuItem>
        <MenuItem to="/chats">
          <Icon as={BsChatTextFill} w={"45px"} h={"45px"} />
        </MenuItem>
        <MenuItem to={`/profile/${user.College_id} `}>
          <Icon as={MdAccountCircle} w={"45px"} h={"45px"} />
        </MenuItem>
      </Stack>
    </Box>
  );
};

const NavBarContainer = ({ children, ...props }) => {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      w="100%"
      p={4}
      fontWeight="700"
      fontSize="lg"
      bg={["primary.500", "primary.500", "transparent", "transparent"]}
      color={["#000000", "#000000", "primary.500", "primary.500"]}
      {...props}
    >
      {children}
    </Flex>
  );
};

export default NavBar;
