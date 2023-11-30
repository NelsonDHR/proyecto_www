import React, { useState, useEffect } from 'react';
import {
  Box,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tag,
  Text,
  Wrap,
  useDisclosure,
  Button,
  Heading,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import UpdateEventModal from "./UpdateEventModal";
import DeleteEventModal from "./DeleteEventModal";
import foodImage from "../../assets/events/food.png";
import travelImage from "../../assets/events/travel.png";
import homeImage from "../../assets/events/home.png";
import coupleImage from "../../assets/events/couple.png";
import otherImage from "../../assets/events/other.png";
import { getUser, getUserById } from '../../api/profile.api';
import { getBalances } from '../../api/event.api';

const Event = ({ data, index, refreshEvents, deleteEvents, contacts, handleActivitiesClick }) => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hoverShadow = useColorModeValue("lg", "dark-lg");
  const modalBgColor = useColorModeValue('white', 'gray.800');
  const [creatorName, setCreatorName] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [balances, setBalances] = useState([]);

  useEffect(() => {
    getUserById(data.creator)
      .then((response) => {
        setCreatorName(response.data.nickname);
      })
      .catch((error) => {
        console.error('Error fetching user details:', error);
      });
  }, [data.creator]);

  useEffect(() => {
    getUser()
      .then((response) => {
        setCurrentUserId(response.data.id);
      })
      .catch((error) => {
        console.error('Error fetching current user details:', error);
      });
  }, []);

  useEffect(() => {
    loadBalances()
      .then((response) => {
        setBalances(response);
        console.log(balances);
      })
      .catch((error) => {
        console.error('Error fetching balances', error);
      });
  }, []);

  const loadBalances = async () => {
    try {
      const response = await getBalances(data.id);
      console.log(response);
      return response.data; // Assuming the response has a 'data' property containing the balances
    } catch (error) {
      console.error("Error", error);
      return []; // Return an empty array in case of an error
    }
  };

  const images = {
    'travel.png': travelImage,
    'home.png': homeImage,
    'couple.png': coupleImage,
    'food.png': foodImage,
    'other.png': otherImage,
  };

  return (
    <Box
      onClick={onOpen}
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      _hover={{ transform: "scale(1.02)", shadow: hoverShadow }}
      transition="0.3s"
      backgroundColor={colorMode === 'light' ? 'white' : 'gray.700'}
      maxW="300px"
      position="relative"
    >
      <Box
        position="relative"
        width="300px"
        height="200px"
        _after={{
          content: '""',
          display: 'block',
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundImage: 'linear-gradient(200deg, transparent, black)',
          zIndex: '1',
        }}
      >
        <Image
          src={images[data.image_name]}
          alt={data.event_type}
          width="300px"
          height="200px"
          objectFit="cover"
        />
      </Box>

      <Box p="4">
        <Box d="flex" alignItems="baseline" mb={2}>
          <Heading size="md">{data.name}</Heading>
        </Box>
        <Box>
          <Text as="span" fontWeight="bold">Created by:</Text> {creatorName} {currentUserId === data.creator && '(You)'}
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent maxH="500px">
          <ModalHeader fontSize="lg">{data.name}</ModalHeader>
          <ModalCloseButton />
          <Box
            position="relative"
            width="100%"
            height="200px"
            _after={{
              content: '""',
              display: 'block',
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundImage: 'linear-gradient(200deg, transparent, black)',
              zIndex: '1',
            }}
          >
            <Image
              src={images[data.image_name]}
              alt={data.event_type}
              width="100%"
              height="200px"
              objectFit="cover"
            />
          </Box>
          <ModalBody overflowY="auto" css={{
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'gray',
              borderRadius: '24px',
            },
            '&::-webkit-scrollbar-thumb:hover': {
              background: '#888',
            },
          }}>
            <Box
              position="absolute"
              bottom="0"
              left="0"
              width="100%"
              height="50px"
              backgroundImage={`linear-gradient(to top, ${modalBgColor}, transparent)`}
              zIndex="2"
              pointerEvents="none"
            />
            <Box mb={4} mt={2}>
              <Heading size="sm">Description</Heading>
              <Text fontSize="sm">{data.description}</Text>
            </Box>
            <Box mb={4}>
              <Heading size="sm">Created by</Heading>
              <Text fontSize="sm">{creatorName}</Text>
            </Box>
            <Box mb={4}>
              <Heading size="sm">Creation date</Heading>
              <Text fontSize="sm">{new Date(data.date).toLocaleDateString()}</Text>
            </Box>
            <Box mb={4}>
              <Heading size="sm" mb={2}>Participants</Heading>
              <Wrap>
                {data.participants.map((participant, index) => (
                  <Tag key={index} size="sm" colorScheme="green">{participant.nickname}</Tag>
                ))}
              </Wrap>
            </Box>
            {/* New section to display balances */}
            <Box mb={4}>
              <Heading size="sm">Balances</Heading>
              {balances.map((balance, index) => (
                <Box key={index} mb={2} display="flex" alignItems="center">
                  <Text
                    size="me"
                  >
                    {balance.user_name}: {balance.balance}
                  </Text>
                  <Button
                    size="xs"
                    colorScheme="blue"
                    ml="auto"
                    //funcion que haga algo
                  >
                    Pay
                  </Button>
                </Box>
              ))}
            </Box>
            <Box display="flex" justifyContent="space-between" mb={4}>
              <Button size="md" colorScheme="green" onClick={() => handleActivitiesClick(data)}>
                Activities
              </Button>
              <Box display="flex">
                <Box mr={4}>
                  <UpdateEventModal
                    isOpen={isOpen}
                    onClose={onClose}
                    refreshEvents={refreshEvents}
                    contacts={contacts}
                    event={data}
                    index={index}
                  />
                </Box>
                <Box>
                  <DeleteEventModal
                    isOpen={isOpen}
                    onClose={onClose}
                    deleteEvents={() => deleteEvents(index)}
                    event={data}
                    index={index}
                  />
                </Box>
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Event;
