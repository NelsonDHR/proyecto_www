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
  VStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Center,
} from "@chakra-ui/react";
import { putActivity } from "../../api/activity.api";

const UpdateActivityModal = ({ refreshActivity, activity, contacts, ...props }) => {
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

  const handleRemoveContact = (contactId) => {
    setActivityData((prevData) => ({
      ...prevData,
      participants: prevData.participants.filter((id) => id !== contactId),
    }));
  };

  const handleContactsChange = (selectedContacts) => {
    const uniqueContacts = Array.from(new Set(selectedContacts));
    setActivityData((prevData) => ({
      ...prevData,
      participants: uniqueContacts,
    }));
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
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "gray",
                borderRadius: "24px",
              },
            }}
          >
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
              <FormLabel>Activity description</FormLabel>
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
              <FormLabel>Participants of the activity</FormLabel>
              <Center>
              <Menu>
                <MenuButton as={Button}>
                  Select participants
                </MenuButton>
                <MenuList>
                  {contacts.map((contact) => (
                    <MenuItem
                      key={contact.id}
                      onClick={() => handleContactsChange([...activityData.participants, contact.id])}
                    >
                      {contact.nickname}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              </Center>
            </FormControl>
            <VStack align="flex-start" spacing={2}>
              {activityData.participants.map((contactId) => (
                <Tag key={contactId} size="lg" colorScheme="teal">
                  <TagLabel>{contacts.find((contact) => contact.id === contactId)?.nickname}</TagLabel>
                  <TagCloseButton onClick={() => handleRemoveContact(contactId)} />
                </Tag>
              ))}
            </VStack> 
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
