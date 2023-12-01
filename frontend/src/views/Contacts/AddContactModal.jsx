import React, { useEffect, useState } from 'react';
import { IoMdContact } from "react-icons/io";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from "@chakra-ui/react";
import { addContact } from '../../api/contacts.api';
import { getUser } from '../../api/profile.api';

const AddContactModal = ({ updateContacts, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const toast = useToast();

  useEffect(() => {
    getUser()
      .then((response) => {
        setCurrentUserEmail(response.data.email);
      })
      .catch((error) => {
        console.error('Error fetching current user email:', error);
      });
  }, []);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setEmailError("");
  };  

  const handleSubmit = async () => {
    if (!email) {
      setEmailError("Email is required!");
      return;
    }

    if (email === currentUserEmail) {
      toast({
        title: "Error at adding the contact.",
        description: "You can't add yourself as a contact.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    if (props.contactsList.some((contact) => contact.email === email)) {
      toast({
        title: "Error at adding the contact.",
        description: "You already have this contact.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      await addContact({ email });
      updateContacts();
      toast({
        title: "Contact added.",
        description: `You have added ${email} to your contacts.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error at adding the contact.",
        description: "Check again if the email exists!",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error al agregar el contacto:", error);
    }
  };



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
        width={isHovered ? "160px" : "40px"}
      >
        <Icon as={IoMdContact} boxSize={6} />
        {isHovered && <Text ml={2} fontSize={17.5}>Add Contact</Text>}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="auto">
          <ModalHeader pb={4}>Add Contact</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isInvalid={!!emailError}>
              <FormLabel>Contact's email</FormLabel>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
              />
              {emailError && <FormErrorMessage>{emailError}</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleSubmit}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddContactModal;