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
  FormErrorMessage,
  Input,
  Select,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Center,
  TagLabel,
  Tag,
  TagCloseButton,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { CalendarIcon } from '@chakra-ui/icons';
import { getAllContacts } from '../../api/contacts.api';
import { createEvent } from '../../api/event.api';
import { getUser } from '../../api/profile.api';

const AddEventModal = ({ updateEvents, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contacts, setContacts] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isHovered, setIsHovered] = useState(false);
  const [eventData, setEventData] = useState({
    description: "",
    event_type: "",
    image: null,
    image_name: "",
    is_active: true,
    name: "",
    participants: []
  });

  const eventTypeToImageName = {
    "TR": "travel.png",
    "HM": "home.png",
    "CP": "couple.png",
    "FD": "food.png",
    "OT": "other.png"
  };

  const loadContacts = async () => {
    try {
      const response = await getAllContacts();
      const user = await getUser();
      setContacts([user.data, ...response.data]);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

  // Handle Functions

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
    if (name === "event_type") {
      setEventData({
        ...eventData,
        [name]: value,
        image_name: eventTypeToImageName[value],
      });
    } else {
      setEventData({
        ...eventData,
        [name]: value,
      });
    }
  };

  const handleContactsChange = (selectedContacts) => {
    const uniqueContacts = Array.from(new Set([eventData.participants[0], ...selectedContacts]));
    setEventData((prevData) => ({
      ...prevData,
      participants: uniqueContacts,
    }));
  };

  const handleRemoveContact = (contactId) => {
    if (contactId !== eventData.participants[0]) {
      setEventData((prevData) => ({
        ...prevData,
        participants: prevData.participants.filter((id) => id !== contactId),
      }));
    }
  };

  const handleSubmit = async () => {
    let errors = {};
    if (!eventData.name) errors.name = "Name is required";
    if (!eventData.description) errors.description = "Description is required";
    if (!eventData.event_type) errors.event_type = "Event type is required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const newEvent = await createEvent(eventData);
      console.log("Evento creado:", newEvent)
      updateEvents();
      onClose();
    } catch (error) {
      console.error("Error al crear el evento:", error);
    }
  };

  // Use Effects

  useEffect(() => {
    loadContacts();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setEventData(prevData => ({
        ...prevData,
        participants: [user.data.id]
      }));
    };
    fetchUser();
  }, []);

  return (
    <>
      <Button
        position="fixed"
        bottom="2rem"
        right="2rem"
        style={{ zIndex: 9999 }}
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
            <FormControl mb={4} isInvalid={!!formErrors.name}>
              <FormLabel>Name of the event</FormLabel>
              <Input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleChange}
              />
              {formErrors.name && <FormErrorMessage>{formErrors.name}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={4} isInvalid={!!formErrors.description}>
              <FormLabel>Description of the event</FormLabel>
              <Input
                type="text"
                name="description"
                value={eventData.description}
                onChange={handleChange}
              />
              {formErrors.description && <FormErrorMessage>{formErrors.description}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={4} isInvalid={!!formErrors.event_type}>
              <FormLabel>Type of event</FormLabel>
              <Select
                name="event_type"
                value={eventData.event_type}
                onChange={handleChange}
              >
                <option value="">Select a type of event</option>
                <option value="TR">Travel</option>
                <option value="HM">Home</option>
                <option value="CP">Couple</option>
                <option value="FD">Food</option>
                <option value="OT">Other</option>
              </Select>
              {formErrors.event_type && <FormErrorMessage>{formErrors.event_type}</FormErrorMessage>}
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
            <Wrap spacing={2}>
              {eventData.participants.map((contactId) => (
                <WrapItem key={contactId}>
                  <Tag size="lg" colorScheme="teal">
                    <TagLabel>{contacts.find((contact) => contact.id === contactId)?.nickname}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveContact(contactId)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
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
