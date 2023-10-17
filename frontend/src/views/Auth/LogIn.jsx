import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Text,
} from "@chakra-ui/react";

function LogIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // handle login logic here
  };

  return (
    <Box p={4}>
      <Heading as="h1" size="xl" mb={4}>
        Log In
      </Heading>
      <Box borderWidth="1px" borderRadius="lg" p={4}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl id="email" isRequired>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormControl>
            <Button type="submit" colorScheme="blue">
              Log In
            </Button>
          </Stack>
        </form>
      </Box>
      <Text mt={4}>
        Don't have an account? <a href="#">Sign up</a>
      </Text>
    </Box>
  );
}

export default LogIn;
