import React from "react";
import { Box, Text } from "@chakra-ui/react";
import { NavLink, Link } from "react-router-dom";
export default function Logo(props) {
  return (
    <Box {...props}>
    <NavLink to="/home">
    <Text fontSize="40px" fontWeight="bold">
        Qurbit
      </Text>
    </NavLink>
      
    </Box>
  );
}
