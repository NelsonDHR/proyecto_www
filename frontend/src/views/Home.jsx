import React from 'react';
import {
  Box,
  useColorMode,
} from '@chakra-ui/react';
import { useState } from 'react';
import Navbar from '../components/Navbar';
import Events from './Events/Events';
import Contatcs from './Contacts/Contacts';

const Home = () => {
  const { colorMode } = useColorMode();

  const [selectedOption, setSelectedOption] = useState('events');

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      bg={colorMode === 'light' ? 'gray.200' : 'gray.800'}
    >
      <Navbar selectedOption={selectedOption} handleOptionClick={handleOptionClick} />
      {selectedOption === 'events' ? <Events /> : <Contatcs />}
    </Box>
  );
};

export default Home;