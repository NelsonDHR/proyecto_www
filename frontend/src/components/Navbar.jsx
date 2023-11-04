import React, { useState } from "react";
import {
  Box,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
} from "@chakra-ui/react";
import ToggleColorMode from "./ToggleColorMode";
import { Link } from "react-router-dom";

const Navbar = ({ selectedOption, handleOptionClick, handleLogOut }) => {

  const { colorMode } = useColorMode();

  return (
    <Box
      bg={colorMode === "light" ? "white" : "gray.900"}
      px={4}
      py={4}
      height="70px"
      position="sticky"
      top={0}
      left={0}
      right={0}
      zIndex={10}
    >
      <Flex justifyContent="space-between" alignItems="center" height="100%">
        <Box>
          <Link to="/home">
            <Box fontWeight="bold" fontSize="xl">
              Splitcount
            </Box>
          </Link>
        </Box>
        <Box display="flex" alignItems="center">

          <Box
            onClick={() => handleOptionClick("events")}
            bg={
              selectedOption === "events"
                ? colorMode === "light"
                  ? "gray.200"
                  : "gray.500"
                : "transparent"
            }
            px={2}
            py={1}
            borderRadius="md"
            cursor="pointer"
            mr={4}
          >
            Events
          </Box>
          <Box
            onClick={() => handleOptionClick("contacts")}
            bg={
              selectedOption === "contacts"
                ? colorMode === "light"
                  ? "gray.200"
                  : "gray.500"
                : "transparent"
            }
            px={2}
            py={1}
            borderRadius="md"
            cursor="pointer"
            mr={4}
          >
            Contacts
          </Box>
          <Menu>
            <MenuButton
              as={Avatar}
              size="sm"
              src="https://bit.ly/dan-abramov"
              cursor="pointer"
              border={selectedOption == "profile" ?
                colorMode === "light" ?
                  "2px solid black" :
                  "2px solid white" :
                  "none"}
            />
            <MenuList>
              <MenuItem onClick={() => handleOptionClick("profile")}>Profile</MenuItem>
              <MenuItem onClick={() => handleLogOut()}>Log Out</MenuItem>
            </MenuList>
          </Menu>
          <ToggleColorMode />
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;
