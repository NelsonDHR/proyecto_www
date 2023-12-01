import React, { useState, useEffect } from "react";
import {
  Avatar,
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
import man1 from '../../assets/avatars/man-1.png';
import man2 from '../../assets/avatars/man-2.png';
import man3 from '../../assets/avatars/man-3.png';
import woman1 from '../../assets/avatars/woman-1.png';
import woman2 from '../../assets/avatars/woman-2.png';
import woman3 from '../../assets/avatars/woman-3.png';
import bear from '../../assets/avatars/bear.png';
import cat from '../../assets/avatars/cat.png';
import panda from '../../assets/avatars/panda.png';
import { getUser, updateUser, deleteUser } from "../../api/profile.api";
import UpdateProfileModal from "./UpdateProfileModal";
import DeleteAccountModal from "./DeleteAccountModal";

const Profile = ({ onAccountDeletion }) => {
  const { colorMode } = useColorMode();
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
  });
  const [dataUser, setDataUser] = useState(defaultData);

  const avatarImages = {
    'man-1.png': man1,
    'man-2.png': man2,
    'man-3.png': man3,
    'woman-1.png': woman1,
    'woman-2.png': woman2,
    'woman-3.png': woman3,
    'bear.png': bear,
    'cat.png': cat,
    'panda.png': panda,
  };

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
    onClose();
    try {
      const response = await deleteUser();
      console.log(response.data);
      localStorage.removeItem("token");
      setIsDeleting(true);
      onAccountDeletion();
    } catch (error) {
      setIsDeleting(false);
      console.error('Error al eliminar la cuenta:', error.response.data);
    }
  };

  const handleEdit = () => {
    setIsEditable(true);
  };

  const handleUpdate = async () => {
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
    <Flex direction="column" alignItems="center" justifyContent="center" position="relative" height="100vh" p={4}>
      <Avatar size="2xl" mb={6} src={dataUser ? avatarImages[dataUser.avatar_name] : "https://bit.ly/dan-abramov"} />
      <Heading as="h1" size="lg" mt={2} mb={2}>
        {defaultData.nickname}'s Profile
      </Heading>
      <Flex mt={6}>
        <Button colorScheme="green" onClick={handleEdit}>
          Edit Profile
        </Button>
        <Button ml={4} colorScheme="red" onClick={() => setIsOpen(true)}>
          Delete Account
        </Button>
        <DeleteAccountModal isOpen={isOpen} onClose={onClose} handleDelete={handleDelete} cancelRef={cancelRef} />
        <UpdateProfileModal isOpen={isEditable} onClose={handleCancel} handleUpdate={handleUpdate} dataUser={dataUser} handleChange={handleChange}/>
      </Flex>
    </Flex>
  );
};

export default Profile;