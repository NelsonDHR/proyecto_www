import React, { useState } from "react";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Select,
  ModalFooter,
  VStack,
  Tag,
  TagLabel,
  TagCloseButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Center
} from "@chakra-ui/react";
import { putEvent } from "../../api/event.api";

const UpdateEventModal = ({ refreshEvents, event, contacts, updateEvents, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventData, setEventData] = useState({
    event_type: event.event_type,
    avatar: null,
    name: event.name,
    description: event.description,
    is_active: true,
    creator: event.creator,
    participants: event.participants,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
    console.log(eventData)
  };

  const handleRemoveContact = (contactId) => {
    setEventData((prevData) => ({
      ...prevData,
      participants: prevData.participants.filter((id) => id !== contactId),
    }));
  };

  const handleSubmit = async () => {
    try {
      const newEvent = await putEvent(event.id, eventData);
      refreshEvents(newEvent.data, props.index);
      onClose();
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
    }
  };

  const handleContactsChange = (selectedContacts) => {
    const uniqueContacts = Array.from(new Set(selectedContacts));
    setEventData((prevData) => ({
      ...prevData,
      participants: uniqueContacts,
    }));
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
            <FormControl mb={4}>
              <FormLabel>Participants</FormLabel>
              <Center>
              <Menu>
                <MenuButton as={Button}>
                  Select participants
                </MenuButton>
                <MenuList>
                  {contacts.map((contact) => (
                    <MenuItem
                      key={contact.id}
                      onClick={() => handleContactsChange([...eventData.participants, contact.id])}
                    >
                      {contact.nickname}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
              </Center>
            </FormControl>
            <VStack align="flex-start" spacing={2}>
              {eventData.participants.map((contactId) => (
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

export default UpdateEventModal;
