import React from "react";
import {
  Box,
  useColorMode,
  FormControl,
  FormLabel,
  Input,
  Button,
  Heading,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "../../components/Navbar";
import Events from "../Events/Events";
import Contatcs from "../Contacts/Contacts";

const Profile = () => {
  const { colorMode } = useColorMode();
  const defaultData = {
    email: "email mockup",
    first_name: "firstName mockup",
    second_name: "secondName mockup",
    password: "password mockup",
    nickname: "nickname mockup",
  };

  const [selectedOption, setSelectedOption] = useState("profile");
  const [isEditable, setIsEditable] = useState(false);
  const [dataUser, setDataUser] = useState(defaultData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataUser({
      ...dataUser,
      [name]: value,
    });
    console.log(dataUser);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleUpdate = () => {
    //Enviar actualización a la bd, uso de API.
    setIsEditable(false)
  }

  const handleCancel = () => {
    setIsEditable(false);
    setDataUser(defaultData)
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      bg={colorMode === "light" ? "gray.200" : "gray.800"}
    >
      <Navbar
        selectedOption={selectedOption}
        handleOptionClick={handleOptionClick}
      />
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        flex="1" // Para ocupar el espacio restante en el contenedor principal
      >
        <Heading as="h1" size="lg" mb="6">
          Hey you! This is your profile.
        </Heading>
        <Box w="80%" maxW="400px">
          <FormControl>
            <FormLabel>First name</FormLabel>
            <Input
              bg={colorMode === "light" ? "white" : "gray.700"}
              color={colorMode === "light" ? "gray.800" : "white"}
              type="text"
              name="first_name"
              value={dataUser.first_name}
              isReadOnly={!isEditable}
              onChange={handleChange}
            />
          </FormControl>
        </Box>
        <Box w="80%" maxW="400px">
          <FormControl>
            <FormLabel>Second name</FormLabel>
            <Input
              bg={colorMode === "light" ? "white" : "gray.700"}
              color={colorMode === "light" ? "gray.800" : "white"}
              type="text"
              name="second_name"
              value={dataUser.second_name}
              isReadOnly={!isEditable}
              onChange={handleChange}
            />
          </FormControl>
        </Box>
        <Box w="80%" maxW="400px">
          <FormControl>
            <FormLabel>Email</FormLabel>
            <Input
              bg={colorMode === "light" ? "white" : "gray.700"}
              color={colorMode === "light" ? "gray.800" : "white"}
              type="text"
              name="email"
              value={dataUser.email}
              isReadOnly={!isEditable}
              onChange={handleChange}
            />
          </FormControl>
        </Box>
        <Box w="80%" maxW="400px">
          <FormControl>
            <FormLabel>Nickname</FormLabel>
            <Input
              bg={colorMode === "light" ? "white" : "gray.700"}
              color={colorMode === "light" ? "gray.800" : "white"}
              type="text"
              name="nickname"
              value={dataUser.nickname}
              isReadOnly={!isEditable}
              onChange={handleChange}
            />
          </FormControl>
        </Box>
        <Box w="80%" maxW="400px">
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              bg={colorMode === "light" ? "white" : "gray.700"}
              color={colorMode === "light" ? "gray.800" : "white"}
              type="text"
              name="password"
              value={dataUser.password}
              isReadOnly={!isEditable}
              onChange={handleChange}
            />
          </FormControl>
        </Box>
        {isEditable ? (
          <Flex>
            <Button mt="4" mr="2" colorScheme="green" onClick={handleUpdate}>
              Update
            </Button>
            <Button mt="4" colorScheme="red" onClick={handleCancel}>
              Cancel
            </Button>
          </Flex>
        ) : (
          <Button mt="4" colorScheme="green" onClick={handleEdit}>
            Edit
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default Profile;
