import React, { useState, useEffect } from 'react';
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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Center,
  VStack,
  TagLabel,
  Tag,
  TagCloseButton
} from "@chakra-ui/react";
import { CalendarIcon } from '@chakra-ui/icons';
import { getAllContacts } from '../../api/contacts.api'; 
import { createEvent } from '../../api/event.api';

const AddEventModal = ({ updateEvents, ...props }) => {
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
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    // Cargar contactos cuando se abre el modal
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await getAllContacts();
      setContacts(response.data);
      console.log(contacts)
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({
      ...eventData,
      [name]: value,
    });
    console.log(eventData)
  };

  const handleContactsChange = (selectedContacts) => {
    const uniqueContacts = Array.from(new Set(selectedContacts));
    setEventData((prevData) => ({
      ...prevData,
      participants: uniqueContacts,
    }));
  };
  const handleRemoveContact = (contactId) => {
    setEventData((prevData) => ({
      ...prevData,
      participants: prevData.participants.filter((id) => id !== contactId),
    }));
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
        width={isHovered ? "150px" : "40px"}
      >
        <CalendarIcon />
        {isHovered && <Text ml={2} fontSize={17.5}>Add Event</Text>}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="auto">
          <ModalHeader pb={4}>Create Event</ModalHeader>
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
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddEventModal;
