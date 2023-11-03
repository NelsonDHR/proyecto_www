// Contact.jsx
import React from 'react';
import { Box, Avatar, Text, Button, Flex, Spacer, useColorMode, useToast } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { deleteContact } from '../../api/contacts.api'; // Asegúrate de tener esta función en tu API

const Contact = ({ contact, updateContacts }) => {
  const { colorMode } = useColorMode();

  const toast = useToast();

  const handleDelete = async () => {
    try {
      // Llama a la función de la API para eliminar el contacto
      await deleteContact({ email: contact.email });
      // Actualiza la lista de contactos en el componente padre
      updateContacts();
      // Muestra un mensaje de éxito
      toast({
        title: "Contacto eliminado.",
        description: `Has eliminado a ${contact.nickname} de tus contactos.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error al eliminar el contacto:", error);
      // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
      toast({
        title: "Error al eliminar el contacto.",
        description: "Ha ocurrido un error al intentar eliminar el contacto. Por favor, inténtalo de nuevo.",
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
          Eliminar
        </Button>
      </Flex>
    </Box>
  );
};

export default Contact;