import React, { useState } from 'react';
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text
} from "@chakra-ui/react";
import { addContact } from '../../api/contacts.api'; // Asegúrate de tener esta función en tu API
import { AddIcon, PlusSquareIcon } from '@chakra-ui/icons';

const AddContactModal = ({ updateContacts, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      // Llama a la función de la API para agregar el contacto
      await addContact({ email });
      // Actualiza la lista de contactos en el componente padre
      updateContacts();
      // Cierra el modal después de que se haya enviado el contacto
      onClose();
    } catch (error) {
      console.error("Error al agregar el contacto:", error);
      // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
    }
  };

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Button
        position="absolute"
        bottom="2rem"
        right="2rem"
        colorScheme="teal"
        size="lg"
        borderRadius="full"
        p={6}
        onClick={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        _hover={{
          bg: "teal.400",
          color: "white",
          transform: "scale(1.1)",
          transition: "all 0.2s ease-in-out",
        }}
        _focus={{
          boxShadow: "none",
        }}
        width={isHovered ? "160px" : "40px"}
      >
        {isHovered ? <PlusSquareIcon /> : <AddIcon />}
        {isHovered && <Text ml={2} fontSize={17.5}>Add Contact</Text>}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Contacto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Correo electrónico del contacto</FormLabel>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="green" onClick={handleSubmit}>
              Agregar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddContactModal;