import React from 'react';
import { Box, Avatar, Text, Button, Flex, Spacer, useColorMode, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { deleteContact } from '../../api/contacts.api';

const Contact = ({ contact, updateContacts }) => {
  const { colorMode } = useColorMode();
  const toast = useToast();

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
        <Avatar src={contact.avatar} />
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