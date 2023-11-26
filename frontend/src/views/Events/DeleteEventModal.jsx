// DeleteEventModal.jsx
import React from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Button,
  Text,
} from "@chakra-ui/react";
import { inactivateEvent } from "../../api/event.api";
import { useDisclosure } from "@chakra-ui/hooks";



const DeleteEventModal = ({ deleteEvents, event, index, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleSubmit = async () => {
    console.log(event)
    try {
      await inactivateEvent(event.id);
      deleteEvents(index);
      onClose();
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  return (
    <>
    <Button colorScheme="red" onClick={onOpen}>Delete</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent margin="auto">
        <ModalHeader pb={4}>Confirm Delete</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Are you sure you want to delete this event?</Text>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleSubmit}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
    </>
  );
};

export default DeleteEventModal;
