import React, { useState, useEffect } from 'react';
import { Box, Image, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Tag, Text, Wrap, useDisclosure, Button, Heading, useColorMode, useColorModeValue } from '@chakra-ui/react';
import UpdateActivityModal from "./UpdateActivityModal";
import DeleteActivityModal from "./DeleteActivityModal";
import decoration from "../../assets/activities/decoration.jpg";
import drinking from "../../assets/activities/drinking.jpg";
import planning from "../../assets/activities/planning.jpg";
import shopping from "../../assets/activities/shopping.jpg";
import tickets from "../../assets/activities/tickets.jpg";
import transportation from "../../assets/activities/transportation.jpg";
import { getUser, getUserById } from '../../api/profile.api';
import ActivityPay from './ActivityPay';

const Activity = ({ data, index, refreshActivities, deleteActivities, contacts }) => {
  const { colorMode } = useColorMode();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const hoverShadow = useColorModeValue("lg", "dark-lg");
  const modalBgColor = useColorModeValue('white', 'gray.800');
  const [creatorName, setCreatorName] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);


  console.log("activity", data.participation_activities)

  useEffect(() => {
    getUserById(data.creator)
      .then((response) => {
        setCreatorName(response.data.nickname); // o el campo que contenga el nombre o apodo
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

  const images = {
    'decoration.jpg': decoration,
    'drinking.jpg': drinking,
    'planning.jpg': planning,
    'shopping.jpg': shopping,
    'tickets.jpg': tickets,
    'transportation.jpg': transportation,
  };

  console.log("activity", data.image_name)

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

      <Modal isOpen={isOpen} onClose={onClose} >
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
              background: '#888', // Cambia esto al color que prefieras
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
              <Heading size="sm">Value activity</Heading>
              <Text fontSize="sm">{data.value}</Text>
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
                {data.participation_activities.map((participation, index) => (
                  <Tag key={index} size="sm" colorScheme="green">{participation.user.nickname}</Tag>
                ))}
              </Wrap>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={4}>
              <Box>
                <UpdateActivityModal
                  isOpen={isOpen}
                  onClose={onClose}
                  refreshActivities={refreshActivities}
                  contacts={contacts}
                  activity={data}
                  index={index}
                />
              </Box>
              <Box display="flex" alignItems="flex-end">
                <Box mr={4}>
                  <ActivityPay
                    isOpen={isOpen}
                    onClose={onClose}
                    activity={data}
                    index={index}
                  />
                </Box>
                <Box>
                  <DeleteActivityModal
                    isOpen={isOpen}
                    onClose={onClose}
                    deleteActivities={() => deleteActivities(index)}
                    activity={data}
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

export default Activity;