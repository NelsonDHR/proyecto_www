import React, { useState } from "react";
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
  Text,
} from "@chakra-ui/react";
import { AddIcon, CalendarIcon } from "@chakra-ui/icons";
import { putEvent } from "../../api/event.api";

const UpdateEventModal = ({ refreshEvents, event,  ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventData, setEventData] = useState({
    event_type: event.event_type,
    avatar: null,
    name: event.name,
    description: event.description,
    is_active: true,
    creator: event.creator,
    participants: event.participants
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
    console.log(eventData);
  };

  const handleSubmit = async () => {
    try {
      // Llama a la función de la API para crear el event
      const newEvent = await putEvent(event.id, eventData);
      // Actualiza la lista de activities en el componente padre
      refreshEvents(newEvent.data, props.index);
      // Cierra el modal después de que se haya enviado el Event
      onClose();
    } catch (error) {
      console.error("Error al crear la actividad:", error);
      // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Edit Event</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="auto">
          <ModalHeader pb={4}>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Name of the event</FormLabel>
              <Input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Description of the event</FormLabel>
              <Input
                type="text"
                name="description"
                value={eventData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Type of event</FormLabel>
              <Select
                name="event_type"
                value={eventData.event_type}
                onChange={handleChange}
              >
                <option value="">Select a type of event</option>
                <option value="TR">Travel</option>
                <option value="HM">Home</option>
                <option value="PR">Couple</option>
                <option value="FD">Food</option>
                <option value="OT">Other</option>
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleSubmit}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateEventModal;