import React, { useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import ToggleColorMode from "./ToggleColorMode";
import man1 from '../assets/avatars/man-1.png';
import man2 from '../assets/avatars/man-2.png';
import man3 from '../assets/avatars/man-3.png';
import woman1 from '../assets/avatars/woman-1.png';
import woman2 from '../assets/avatars/woman-2.png';
import woman3 from '../assets/avatars/woman-3.png';
import bear from '../assets/avatars/bear.png';
import cat from '../assets/avatars/cat.png';
import panda from '../assets/avatars/panda.png';
import { getUser } from "../api/profile.api";

const Navbar = ({ selectedOption, handleOptionClick, handleLogOut }) => {

  const { colorMode } = useColorMode();
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(response => setUser(response.data));
  }, []);

  const avatarImages = {
    'man-1.png': man1,
    'man-2.png': man2,
    'man-3.png': man3,
    'woman-1.png': woman1,
    'woman-2.png': woman2,
    'woman-3.png': woman3,
    'bear.png': bear,
    'cat.png': cat,
    'panda.png': panda,
  };

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
              src={user ? avatarImages[user.avatar_name] : "https://bit.ly/dan-abramov"}
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
