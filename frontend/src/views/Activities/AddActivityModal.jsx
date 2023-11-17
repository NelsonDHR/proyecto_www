import React, { useState, useEffect } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Icon,
  Text,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Center,
  VStack,
  TagLabel,
  Tag,
  TagCloseButton,
} from "@chakra-ui/react";
import { createActivity } from "../../api/activity.api";
import { RxActivityLog } from "react-icons/rx";
import { getAllContacts } from "../../api/contacts.api";

const AddActivityModal = ({ updateActivity, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contacts, setContacts] = useState([]);
  const [activityData, setActivityData] = useState({
    creator: "",
    avatar: null,
    name: "",
    description: "",
    value: "",
    event: props.event.id,
    participants: [],
    is_active: true,
  });

  useEffect(() => {
    // Cargar contactos cuando se abre el modal
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await getAllContacts();
      setContacts(response.data);
      console.log(contacts);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };
  const handleContactsChange = (selectedContacts) => {
    const uniqueContacts = Array.from(new Set(selectedContacts));
    setActivityData((prevData) => ({
      ...prevData,
      participants: uniqueContacts,
    }));
  };
  const handleRemoveContact = (contactId) => {
    setActivityData((prevData) => ({
      ...prevData,
      participants: prevData.participants.filter((id) => id !== contactId),
    }));
  };

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
      // console.log("DATA", activityData)
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
        <Icon as={RxActivityLog} />
        {isHovered && (
          <Text ml={2} fontSize={17.5}>
            Add Activity
          </Text>
        )}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="auto">
          <ModalHeader pb={4}>Create Activity</ModalHeader>
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
              <FormLabel>Participants</FormLabel>
              <Center>
                <Menu>
                  <MenuButton as={Button}>Select participants</MenuButton>
                  <MenuList>
                    {contacts.map((contact) => (
                      <MenuItem
                        key={contact.id}
                        onClick={() =>
                          handleContactsChange([
                            ...activityData.participants,
                            contact.id,
                          ])
                        }
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
                  <TagLabel>
                    {
                      contacts.find((contact) => contact.id === contactId)
                        ?.nickname
                    }
                  </TagLabel>
                  <TagCloseButton
                    onClick={() => handleRemoveContact(contactId)}
                  />
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

export default AddActivityModal;
