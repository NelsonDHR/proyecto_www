import React from 'react';
import { Box, Avatar, Text, Button, Flex, Spacer, useColorMode, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import man1 from '../../assets/avatars/man-1.png';
import man2 from '../../assets/avatars/man-2.png';
import man3 from '../../assets/avatars/man-3.png';
import woman1 from '../../assets/avatars/woman-1.png';
import woman2 from '../../assets/avatars/woman-2.png';
import woman3 from '../../assets/avatars/woman-3.png';
import bear from '../../assets/avatars/bear.png';
import cat from '../../assets/avatars/cat.png';
import panda from '../../assets/avatars/panda.png';
import { deleteContact } from '../../api/contacts.api';

const Contact = ({ contact, updateContacts }) => {
  const { colorMode } = useColorMode();
  const toast = useToast();

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

  const handleDelete = async () => {
    try {
      await deleteContact({ email: contact.email });
      updateContacts();
      toast({
        title: "Contact deleted.",
        description: `You have deleted ${contact.nickname} from your contacts.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al eliminar el contacto:", error);
      toast({
        title: "Error at deleting the contact.",
        description: "An error occurred while trying to delete the contact. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box borderRadius="lg" overflow="hidden" boxShadow="sm" p={3} mb={1} bg={colorMode === 'light' ? 'white' : 'gray.700'}>
      <Flex alignItems="center">
        <Avatar src={contact ? avatarImages[contact.avatar_name] : "https://bit.ly/dan-abramov"} />
        <Box ml={4}>
          <Text fontSize="lg" fontWeight="bold">{contact.nickname}</Text>
          <Text fontSize="sm" color="gray.500">{contact.email}</Text>
        </Box>
        <Spacer />
        <Button leftIcon={<DeleteIcon />} colorScheme="red" variant="outline" onClick={handleDelete}>
          Delete
        </Button>
      </Flex>
    </Box>
  );
};

export default Contact;