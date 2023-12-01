import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  Spinner,
  Text,
  useColorMode,
  Center
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import ToggleColorMode from '../../components/ToggleColorMode';

import { logIn, signUp } from '../../api/auth.api';

const LogInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LogIn = () => {
  const { colorMode } = useColorMode();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');
  const navigateTo = useNavigate();

  useEffect(() => {
    let timeoutId;
    if (isSuccess) {
      setIsLoading(true);
      setMessage('Redirecting to home...');
      timeoutId = setTimeout(() => {
        navigateTo('/home');
      }, 3000);
    }
    return () => {
      clearTimeout(timeoutId);
    };
  }, [isSuccess, navigateTo]);

  const handleSubmit = async (values, actions) => {
    try {
      const formData = new FormData();
      formData.append('username', values.email);
      formData.append('password', values.password);

      const response = await logIn(formData);
      localStorage.setItem('token', response.data.token);
      setIsSuccess(true);
      console.log(response.data);
    } catch (error) {
      setIsSuccess(false);
      let errorMessage = '';
      if (error.response.data.email) {
        errorMessage = error.response.data.email[0];
      } else if (error.response.data.non_field_errors) {
        errorMessage = error.response.data.non_field_errors[0];
      } else if (error.response.data.detail) {
        errorMessage = error.response.data.detail;
      } else {
        errorMessage = 'An unknown error occurred.';
      }
      setErrorMessage(errorMessage);
      console.error('Error al iniciar sesión:', error.response.data);
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
      bg={colorMode == 'light' ? 'gray.100' : 'gray.900'}
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
          h="400px"
          bg={colorMode == 'light' ? 'white' : 'gray.700'}
          boxShadow="md"
          rounded="md"
          p="6"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Heading as="h1" size="lg" mb="6">
            Log In
          </Heading>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LogInSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <Field name="email">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.email && form.touched.email}
                      mb="4"
                    >
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <Input
                        {...field}
                        id="email"
                        placeholder="Email"
                      />
                      <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="password">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.password && form.touched.password}
                      mb="4"
                    >
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <Input
                        {...field}
                        id="password"
                        placeholder="Password"
                        type="password"
                      />
                      <FormErrorMessage>{form.errors.password}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Center>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isSubmitting}
                  mb="4"
                >
                  Log In
                </Button>
                </Center>
              </Form>
            )}
          </Formik>
          <Link mt="4" onClick={() => navigateTo('/sign-up')}>Don't have an account? Sign up here.</Link>
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
        hidden={!errorMessage || isLoading}
      >
        {errorMessage}
      </Box>
    </Box>
  );
};

export default LogIn;