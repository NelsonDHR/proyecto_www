import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Link,
  useColorMode,
} from '@chakra-ui/react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ToggleColorMode from '../../components/ToggleColorMode';

const LogInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LogIn = () => {
  const { colorMode } = useColorMode();
  const [error, setError] = useState('');
  const navigateTo = useNavigate();

  const handleSubmit = async (values, actions) => {
    try {
      const formData = new FormData();
      formData.append('username', values.email);
      formData.append('password', values.password);

      const response = await axios.post('http://localhost:8000/splitcount/log-in/', formData);
      localStorage.setItem('token', response.data.token);
      navigateTo('/home');
    } catch (error) {
      setError(error.response.data.error);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg={colorMode == 'light' ? 'gray.100' : 'gray.900'}
    >
      <ToggleColorMode position="absolute" />
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
              {error && (
                <Box mb="4" color="red.500">
                  {error}
                </Box>
              )}
              <Button
                type="submit"
                colorScheme="blue"
                isLoading={isSubmitting}
                mb="4"
              >
                Log In
              </Button>
            </Form>
          )}
        </Formik>
        <Link mt="4" href="/sign-up">Don't have an account? Sign up here.</Link>
      </Box>
    </Box>
  );
};

export default LogIn;