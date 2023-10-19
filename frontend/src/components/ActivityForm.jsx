import React, { useState } from "react";
import { ChakraProvider, Input, Button, VStack } from "@chakra-ui/react";

const DynamicForm = ({ numberOfInputs, placeholder }) => {
  const [formValues, setFormValues] = useState(Array(numberOfInputs).fill(""));

  const handleInputChange = (index, value) => {
    const newFormValues = [...formValues];
    newFormValues[index] = value;
    setFormValues(newFormValues);
  };

  const handleSubmit = () => {
    // Manejar la lógica de envío del formulario
    console.log(formValues);
  };

  return (
    <VStack spacing={4}>
      {formValues.map((value, index) => (
        <Input
          key={index}
          placeholder={`${placeholder[index]}`}
          value={value}
          onChange={(e) => handleInputChange(index, e.target.value)}
        />
      ))}
      <Button colorScheme="teal" onClick={handleSubmit}>
        Enviar
      </Button>
    </VStack>
  );
};

export default DynamicForm;
