import React, { useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select, // Importa el componente Select
  VStack,
} from "@chakra-ui/react";
import { createActivity } from "../../api/activity.api";

const AddEventModal = ({ updateEvents, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activityData, setActivityData] = useState({
    creator: "",
    avatar: null,
    name: "",
    description: "",
    value: "",
    event: "",
    participants: "",
    is_active: true,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData({
      ...activityData,
      [name]: value,
    });
    console.log(activityData);
  };

  const handleSubmit = async () => {
    try {
      // Llama a la función de la API para crear el evento
      const newActivity = await createActivity(activityData);
      // Actualiza la lista de eventos en el componente padre
      //updateActivity(newActivity.data);
      // Cierra el modal después de que se haya enviado el evento
      onClose();
    } catch (error) {
      console.error("Error al crear la actividad:", error);
      // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
    }
  };

  return (
    <VStack spacing={4}>
      <FormControl>
        <FormLabel>Creador actividad</FormLabel>
        <Input
          type="text"
          name="creator"
          value={activityData.creator}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Nombre de la actividad</FormLabel>
        <Input
          type="text"
          name="name"
          value={activityData.name}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Descripción del evento</FormLabel>
        <Input
          type="text"
          name="description"
          value={activityData.description}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Valor actividad</FormLabel>
        <Input
          type="number"
          name="value"
          value={activityData.value}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Evento al que pertenece la actividad</FormLabel>
        <Input
          type="number"
          name="event"
          value={activityData.event}
          onChange={handleChange}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Participante actividad</FormLabel>
        <Input
          type="number"
          name="participants"
          value={activityData.participants}
          onChange={handleChange}
        />
      </FormControl>
      <Button colorScheme="green" onClick={handleSubmit}>
        Crear
      </Button>
    </VStack>
  );
};

export default AddEventModal;
