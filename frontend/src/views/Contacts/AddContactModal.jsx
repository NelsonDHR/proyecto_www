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
  Select,
  Text
} from "@chakra-ui/react";
import { createEvent } from '../../api/event.api';
import { AddIcon, PlusSquareIcon } from '@chakra-ui/icons';

const AddContactModal = ({ updateEvents, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventData, setEventData] = useState({
    event_type: "",
    avatar: null,
    name: "",
    description: "",
    is_active: true,
    creator: 1,
    participants: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
    console.log(eventData)
  };

  const handleSubmit = async () => {
    try {
      // Llama a la función de la API para crear el evento
      const newEvent = await createEvent(eventData);
      // Actualiza la lista de eventos en el componente padre
      updateEvents(newEvent.data);
      // Cierra el modal después de que se haya enviado el evento
      onClose();
    } catch (error) {
      console.error("Error al crear el evento:", error);
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
          <ModalHeader>Crear Evento</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nombre del evento</FormLabel>
              <Input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Descripción del evento</FormLabel>
              <Input
                type="text"
                name="description"
                value={eventData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Tipo de Evento</FormLabel>
              <Select
                name="event_type"
                value={eventData.event_type}
                onChange={handleChange}
              >
                <option value="">Selecciona un tipo de evento</option>
                <option value="TR">Viaje</option>
                <option value="HM">Hogar</option>
                <option value="PR">Pareja</option>
                <option value="FD">Comida</option>
                <option value="OT">Otro</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="green" onClick={handleSubmit}>
              Crear
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddContactModal;
