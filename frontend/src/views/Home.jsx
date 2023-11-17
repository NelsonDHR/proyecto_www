import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Spinner,
  Text,
  useColorMode,
} from '@chakra-ui/react';

import Navbar from '../components/Navbar';
import Events from './Events/Events';
import ContactsView from './Contacts/ContactsView';
import Profile from './Profile/Profile';
import Activities from './Activities/Activities';

import { logOut } from "../api/auth.api";


const Home = () => {

  const { colorMode } = useColorMode();
  const [selectedOption, setSelectedOption] = useState('events');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const [activityEvent, setActivityEvent] = useState('')
  const navigateTo = useNavigate();

  const handleActivityEvent = (event) =>{
    setActivityEvent(event);
  }

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  useEffect(() => {
    let timeoutId;
    if (isSuccess) {
      setIsLoading(true);
      setMessage('Logging out...');
      timeoutId = setTimeout(() => {
        navigateTo('/log-in');
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isSuccess, navigateTo]);

  const handleLogOut = async () => {
    try {
      const response = await logOut();
      localStorage.removeItem("token");
      setIsSuccess(true);
      console.log(response.data);
    } catch (error) {
      setIsSuccess(false);
      console.error('Error al cerrar sesión:', error.response.data);
    }
  };

  const handleAccountDeletion = () => {
    setIsLoading(true);
    setMessage('Deleting account...');
    setTimeout(() => {
      navigateTo('/sign-up');
    }, 3000);
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
      {isLoading ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          margin="auto"
        >
          <Text fontSize="xl">{message}</Text>
          <Spinner size="xl" mt="4" />
        </Box>
      ) : (
        <Navbar
          selectedOption={selectedOption}
          handleOptionClick={handleOptionClick}
          handleLogOut={handleLogOut}
        />
      )}
      {!isLoading && selectedOption === 'events' && <Events handleOptionClick={handleOptionClick} handleActivityEvent={handleActivityEvent}/>}      {!isLoading && selectedOption === 'contacts' && <ContactsView />}
      {!isLoading && selectedOption === 'profile' && <Profile onAccountDeletion={handleAccountDeletion} />}
      {!isLoading && selectedOption === 'activities' && <Activities event={activityEvent}/>}
    </Box>
  );
};

export default Home;