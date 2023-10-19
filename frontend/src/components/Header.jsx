import React from "react";
import { Box } from "@chakra-ui/react";

const Header = ({ text }) => {
  return (
    <Box
      as="header"
      bg="blue.800"
      color="white"
      p={4}
      textAlign="center"
      fontWeight="bold"
      textTransform={"uppercase"}
    >
        {text}
    </Box>
  );
};

export default Header;