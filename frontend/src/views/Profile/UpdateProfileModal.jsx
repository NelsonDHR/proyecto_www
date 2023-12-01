import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useColorMode
} from "@chakra-ui/react";

const UpdateProfileModal = ({ isOpen, onClose, dataUser, handleUpdate, handleChange }) => {
  const { colorMode } = useColorMode();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent margin="auto">
        <ModalHeader pb={4}>Edit Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={4}>
            <FormLabel>First name</FormLabel>
            <Input
              bg={colorMode === "light" ? "white" : "gray.700"}
              color={colorMode === "light" ? "gray.800" : "white"}
              type="text"
              name="first_name"
              value={dataUser.first_name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Last name</FormLabel>
            <Input
              bg={colorMode === "light" ? "white" : "gray.700"}
              color={colorMode === "light" ? "gray.800" : "white"}
              type="text"
              name="last_name"
              value={dataUser.last_name}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Email</FormLabel>
            <Input
              bg={colorMode === "light" ? "white" : "gray.700"}
              color={colorMode === "light" ? "gray.800" : "white"}
              type="text"
              name="email"
              value={dataUser.email}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl mb={4}>
            <FormLabel>Nickname</FormLabel>
            <Input
              bg={colorMode === "light" ? "white" : "gray.700"}
              color={colorMode === "light" ? "gray.800" : "white"}
              type="text"
              name="nickname"
              value={dataUser.nickname}
              onChange={handleChange}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              bg={colorMode === "light" ? "white" : "gray.700"}
              color={colorMode === "light" ? "gray.800" : "white"}
              type="text"
              name="password"
              value={dataUser.password}
              onChange={handleChange}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="green" onClick={handleUpdate}>
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default UpdateProfileModal;