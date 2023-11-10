import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Image,
  Input,
  Link,
  Spinner,
  Text,
  useColorMode,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import man1 from '../../assets/avatars/man-1.png';
import man2 from '../../assets/avatars/man-2.png';
import man3 from '../../assets/avatars/man-3.png';
import woman1 from '../../assets/avatars/woman-1.png';
import woman2 from '../../assets/avatars/woman-2.png';
import woman3 from '../../assets/avatars/woman-3.png';
import bear from '../../assets/avatars/bear.png';
import cat from '../../assets/avatars/cat.png';
import panda from '../../assets/avatars/panda.png';
import ToggleColorMode from '../../components/ToggleColorMode';

import { signUp } from '../../api/auth.api';

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  nickname: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const avatars = [
  { id: 1, src: man1 },
  { id: 2, src: man2 },
  { id: 3, src: man3 },
  { id: 4, src: bear },
  { id: 5, src: panda },
  { id: 6, src: cat },
  { id: 7, src: woman1 },
  { id: 8, src: woman2 },
  { id: 9, src: woman3 },
];

const SignUp = () => {
  const { colorMode } = useColorMode();
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigateTo = useNavigate();

  useEffect(() => {
    let timeoutId;
    if (isSuccess) {
      timeoutId = setTimeout(() => {
        setIsLoading(true);
        setMessage('Redirecting to login...');
        timeoutId = setTimeout(() => {
          navigateTo('/log-in');
        }, 3000);
      }, 2000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isSuccess, navigateTo]);

  const handleSubmit = async (values, actions) => {
    try {
      const formData = new FormData();
      formData.append('email', values.email);
      formData.append('first_name', values.firstName);
      formData.append('last_name', values.lastName);
      formData.append('password', values.password);
      formData.append('nickname', values.nickname);
      formData.append('avatar_name', values.avatarName);

      const response = await signUp(formData);
      setIsSuccess(true);
      setMessage('User created!');
      console.log(response.data);
    } catch (error) {
      setIsSuccess(false);
      setMessage('Could not creat the user!');
      console.error('Error al crear el usuario:', error.response.data);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
    >
      <ToggleColorMode position="absolute" />
      {isLoading ? (
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Text fontSize="xl">{message}</Text>
          <Spinner size="xl" mt="4" />
        </Box>
      ) : (
        <Box
          w="400px"
          h="525px"
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          boxShadow="md"
          rounded="md"
          p="6"
          border="1px solid"
          borderColor={colorMode === 'light' ? 'gray.200' : 'gray.600'}
        >
          <Heading as="h1" size="lg" mb="2" textAlign="center">
            Sign Up
          </Heading>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            maxHeight="390px"
            overflow="auto"
            width="100%"
            css={{
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'gray',
                borderRadius: '24px',
              }
            }}>
            <Formik
              initialValues={{
                firstName: '',
                lastName: '',
                nickname: '',
                email: '',
                password: '',
                selectedAvatar: avatars[0].id,
                avatarName: avatars[0].src.split('/').pop(),
              }}
              validationSchema={SignUpSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, setFieldValue, values }) => (
                <Form>
                  <Grid templateColumns="repeat(3, 1fr)" gap={4} m="4">
                    {avatars.map((avatar) => (
                      <GridItem key={avatar.id}>
                        <Box
                          borderWidth="2px"
                          borderColor={
                            values.selectedAvatar === avatar.id
                              ? 'blue.500'
                              : colorMode === 'light'
                                ? 'gray.200'
                                : 'gray.600'
                          }
                          borderRadius="full"
                          overflow="hidden"
                          cursor="pointer"
                          boxSize="50px"
                          onClick={() => {
                            setFieldValue('avatarName', avatar.src.split('/').pop());
                            setFieldValue('selectedAvatar', avatar.id);
                          }}
                          ml="2"
                          mr="2"
                        >
                          <Image src={avatar.src} alt={`Avatar ${avatar.id}`} />
                        </Box>
                      </GridItem>
                    ))}
                  </Grid>
                  <Field name="firstName">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.firstName && form.touched.firstName
                        }
                        mb="4"
                        overflow="auto"
                      >
                        <FormLabel htmlFor="firstName">First Name</FormLabel>
                        <Input
                          {...field}
                          id="firstName"
                          placeholder="First Name"
                          bg={colorMode === 'light' ? 'white' : 'gray.700'}
                          color={colorMode === 'light' ? 'gray.800' : 'white'}
                        />
                        <FormErrorMessage>
                          {form.errors.firstName}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="lastName">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.lastName && form.touched.lastName}
                        mb="4"
                        overflow="auto"
                      >
                        <FormLabel htmlFor="lastName">Last Name</FormLabel>
                        <Input
                          {...field}
                          id="lastName"
                          placeholder="Last Name"
                          bg={colorMode === 'light' ? 'white' : 'gray.700'}
                          color={colorMode === 'light' ? 'gray.800' : 'white'}
                        />
                        <FormErrorMessage>
                          {form.errors.lastName}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="nickname">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.nickname && form.touched.nickname}
                        mb="4"
                        overflow="auto"
                      >
                        <FormLabel htmlFor="nickname">Nickname</FormLabel>
                        <Input
                          {...field}
                          id="nickname"
                          placeholder="Nickname"
                          bg={colorMode === 'light' ? 'white' : 'gray.700'}
                          color={colorMode === 'light' ? 'gray.800' : 'white'}
                        />
                        <FormErrorMessage>
                          {form.errors.nickname}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                        mb="4"
                        overflow="auto"
                      >
                        <FormLabel htmlFor="email">Email</FormLabel>
                        <Input
                          {...field}
                          id="email"
                          placeholder="Email"
                          bg={colorMode === 'light' ? 'white' : 'gray.700'}
                          color={colorMode === 'light' ? 'gray.800' : 'white'}
                        />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="password">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.password && form.touched.password
                        }
                        mb="4"
                        overflow="auto"
                      >
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <Input
                          {...field}
                          id="password"
                          placeholder="Password"
                          type="password"
                          bg={colorMode === 'light' ? 'white' : 'gray.700'}
                          color={colorMode === 'light' ? 'gray.800' : 'white'}
                        />
                        <FormErrorMessage>
                          {form.errors.password}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Button
                    type="submit"
                    colorScheme="blue"
                    isLoading={isSubmitting}
                    mb="4"
                  >
                    Sign Up
                  </Button>
                </Form>
              )}
            </Formik>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            m={6}
          >
            <Link onClick={() => navigateTo('/log-in')}>Already have an account? Log in here.</Link>
          </Box>
        </Box>
      )}
      <Box
        bg={isSuccess ? 'green.100' : 'red.100'}
        color={isSuccess ? 'green.800' : 'red.800'}
        p="2"
        mt="6"
        mb="0"
        rounded="md"
        border="1px solid"
        borderColor={isSuccess ? 'green.200' : 'red.200'}
        hidden={!message || isLoading}
      >
        {message}
      </Box>
    </Box>
  );
};

export default SignUp;