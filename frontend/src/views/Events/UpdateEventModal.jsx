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

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <Button onClick={onOpen}>Editar evento</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Evento</ModalHeader>
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
{/*             <FormControl>
              <FormLabel>Participante actividad</FormLabel>
              <Input
                type="number"
                name="participants"
                value={activityData.participants}
                onChange={handleChange}
              />
            </FormControl> */}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="green" onClick={handleSubmit}>
              Actualizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateEventModal;