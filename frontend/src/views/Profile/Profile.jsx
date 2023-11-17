import React from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useColorMode,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { getUser, updateUser, deleteUser } from "../../api/profile.api";
import DeleteAccountModal from "./DeleteAccountModal";

const Profile = ({ onAccountDeletion }) => {
  const colorMode = useColorMode();
  const toast = useToast();

  const cancelRef = React.useRef();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const [isEditable, setIsEditable] = useState(false);
  const [defaultData, setDefaultData] = useState({
    email: "",
    first_name: "",
    last_name: "",
    nickname: "",
    //password: "password mockup",
  });
  const [dataUser, setDataUser] = useState(defaultData);

  useEffect(() => {
    async function loadUser() {
      const res = await getUser();
      setDataUser(res.data);
      setDefaultData(res.data);
    }
    loadUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataUser({
      ...dataUser,
      [name]: value,
    });
    console.log(dataUser);
  };

  const handleDelete = async () => {
    // Close confirmation modal
    onClose();
    try {
      const response = await deleteUser();
      localStorage.removeItem("token");
      setIsDeleting(true);
      console.log(response.data);
      onAccountDeletion(); // Redirect function
    } catch (error) {
      setIsDeleting(false);
      console.error('Error al eliminar la cuenta:', error.response.data);
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleUpdate = async () => {
    // Enviar actualización a la bd, uso de API.
    setIsEditable(false);
    try {
      const response = await updateUser(dataUser);
      console.log(response);
      toast({
        title: "Changes saved.",
        description: `You have succesfully updated your profile.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error at updating profile.",
        description: "An error occurred while trying to update your profile. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error al actualizar usuario:", error);
    }
  };

  const handleCancel = () => {
    setIsEditable(false);
    setDataUser(defaultData);
  };

  return (
    <Flex direction="column" alignItems="center" justifyContent="flex-start" height="100vh" p={4}>
      <Heading as="h1" size="lg" mt={2} mb={2}>
        {defaultData.nickname}'s Profile
      </Heading>
      <Box w="80%" maxW="400px" mb={4}>
        <FormControl mb={4}>
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
        <FormControl mb={4}>
          <FormLabel>Last name</FormLabel>
          <Input
            bg={colorMode === "light" ? "white" : "gray.700"}
            color={colorMode === "light" ? "gray.800" : "white"}
            type="text"
            name="last_name"
            value={dataUser.last_name}
            isReadOnly={!isEditable}
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
            isReadOnly={!isEditable}
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
            isReadOnly={!isEditable}
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
            isReadOnly={!isEditable}
            onChange={handleChange}
          />
        </FormControl>
        {isEditable ? (
          <Flex mt={6}>
            <Button mr={2} colorScheme="green" onClick={handleUpdate}>
              Update
            </Button>
            <Button colorScheme="red" onClick={handleCancel}>
              Cancel
            </Button>
          </Flex>
        ) : (
          <Flex mt={6}>
            <Button colorScheme="green" onClick={handleEdit}>
              Edit Profile
            </Button>
            <Button ml={4} colorScheme="red" onClick={() => setIsOpen(true)}>
              Delete Account
            </Button>
            <DeleteAccountModal isOpen={isOpen} onClose={onClose} handleDelete={handleDelete} cancelRef={cancelRef} />
          </Flex>
        )}
      </Box>
    </Flex>
  );
};

export default Profile;