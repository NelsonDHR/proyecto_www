import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  nickname: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().required("Required"),
  avatar: Yup.mixed().required("Required"),
});

const SignUp = () => {
  const [avatar, setAvatar] = useState(null);
  const toast = useToast();

  const handleAvatarChange = (event) => {
    setAvatar(event.target.files[0]);
  };

  const handleSubmit = async (values) => {
    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("nickname", values.nickname);
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("avatar", avatar);

    try {
      const response = await axios.post("/api/signup", formData);
      console.log(response.data);
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred.",
        description: "Unable to create your account.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: "",
        lastName: "",
        nickname: "",
        email: "",
        password: "",
        avatar: null,
      }}
      validationSchema={SignUpSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <VStack spacing={4}>
            <FormControl
              isInvalid={errors.firstName && touched.firstName}
              isRequired
            >
              <FormLabel>First Name</FormLabel>
              <Input
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormControl>
            <FormControl
              isInvalid={errors.lastName && touched.lastName}
              isRequired
            >
              <FormLabel>Last Name</FormLabel>
              <Input
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormControl>
            <FormControl
              isInvalid={errors.nickname && touched.nickname}
              isRequired
            >
              <FormLabel>Nickname</FormLabel>
              <Input
                name="nickname"
                value={values.nickname}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormControl>
            <FormControl isInvalid={errors.email && touched.email} isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormControl>
            <FormControl
              isInvalid={errors.password && touched.password}
              isRequired
            >
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </FormControl>
            <FormControl isInvalid={errors.avatar && touched.avatar} isRequired>
              <FormLabel>Avatar</FormLabel>
              <Input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleAvatarChange}
                onBlur={handleBlur}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue">
              Sign Up
            </Button>
          </VStack>
        </Form>
      )}
    </Formik>
  );
};

export default SignUp;
