import React, { useState } from 'react';
import {
  Box,
  Flex,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorMode,
} from '@chakra-ui/react';
import { FaBars } from 'react-icons/fa';
import ToggleColorMode from './ToggleColorMode';

const Navbar = ({ selectedOption, handleOptionClick }) => {
  const { colorMode } = useColorMode();

  return (
    <Box
      bg={colorMode === 'light' ? 'white' : 'gray.900'}
      px={4}
      py={4}
      height="70px"
      position="fixed"
      top={0}
      left={0}
      right={0}
      zIndex={10}
    >
      <Flex justifyContent="space-between" alignItems="center" height="100%">
        <Box>
          <Box fontWeight="bold" fontSize="xl">
            Splitcount
          </Box>
        </Box>
        <Box display="flex" alignItems="center">
          <Box
            onClick={() => handleOptionClick('events')}
            bg={(selectedOption === 'events') ? (colorMode === 'light' ? 'gray.200' : 'gray.500') : 'transparent'}
            px={2}
            py={1}
            borderRadius="md"
            cursor="pointer"
            mr={4}
          >
            Events
          </Box>
          <Box
            onClick={() => handleOptionClick('contacts')}
            bg={(selectedOption === 'contacts') ? (colorMode === 'light' ? 'gray.200' : 'gray.500') : 'transparent'}
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
            />
            <MenuList>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Log Out</MenuItem>
            </MenuList>
          </Menu>
          <ToggleColorMode />
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;