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
} from "@chakra-ui/react";
import { putActivity } from "../../api/activity.api";

const UpdateActivityModal = ({ refreshActivity, activity,  ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [activityData, setActivityData] = useState({
    creator: activity.creator,
    avatar: null,
    name: activity.name,
    description: activity.description,
    value: activity.value,
    event: activity.event,
    participants: activity.participants,
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
      const newActivity = await putActivity(activity.id, activityData);
      // Actualiza la lista de activities en el componente padre
      refreshActivity(newActivity.data, props.index);
      // Cierra el modal después de que se haya enviado el Activity
      onClose();
    } catch (error) {
      console.error("Error al crear la actividad:", error);
      // Aquí puedes manejar el error, mostrar un mensaje al usuario, etc.
    }
  };

  return (
    <>
      <Button onClick={onOpen}>Edit Activity</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="auto">
          <ModalHeader pb={4}>Edit Activity</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            maxH="400px"
            overflowY="scroll"
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'gray',
                borderRadius: '24px',
              }
            }}>
            <FormControl mb={4}>
              <FormLabel>Creator</FormLabel>
              <Input
                type="text"
                name="creator"
                value={activityData.creator}
                onChange={handleChange}
                readOnly
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Name of the activity</FormLabel>
              <Input
                type="text"
                name="name"
                value={activityData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Event description</FormLabel>
              <Input
                type="text"
                name="description"
                value={activityData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Value of the activity</FormLabel>
              <Input
                type="number"
                name="value"
                value={activityData.value}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Event of the activity</FormLabel>
              <Input
                type="number"
                name="event"
                value={activityData.event}
                onChange={handleChange}
                readOnly
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Participants of the activity</FormLabel>
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

export default UpdateActivityModal;
