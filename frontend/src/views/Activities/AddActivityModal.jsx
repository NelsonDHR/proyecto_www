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
import { createActivity } from "../../api/activity.api";
import { AddIcon, CalendarIcon } from "@chakra-ui/icons";

const AddActivityModal = ({ updateActivity, ...props }) => {
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
      // Llama a la función de la API para crear el activityo
      const newActivity = await createActivity(activityData);
      // Actualiza la lista de activities en el componente padre
      updateActivity(newActivity.data);
      // Cierra el modal después de que se haya enviado el Activity
      onClose();
    } catch (error) {
      console.error("Error al crear la actividad:", error);
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
        width={isHovered ? "150px" : "40px"}
      >
        {isHovered ? <CalendarIcon /> : <AddIcon />}
        {isHovered && (
          <Text ml={2} fontSize={17.5}>
            Add Activity
          </Text>
        )}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Crear Actividad</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
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

export default AddActivityModal;
