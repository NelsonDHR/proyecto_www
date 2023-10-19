import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Heading,
  Button,
  Text,
  Box,
} from "@chakra-ui/react";
import Header from "../../components/Header";
import Modal_Basic from "../../components/Modal";
import DynamicForm from "../../components/ActivityForm";

const Activities = () => {
  const form = (
    <DynamicForm
      numberOfInputs={7}
      placeholder={[
        "Creador actividad",
        "Avatar actividad",
        "Nombre de la actividad",
        "Descripción de la actividad",
        "Valor actividad",
        "Evento al que pertenece la actividad",
        "Participantes de la actividad",
      ]}
    ></DynamicForm>
  );
  return (
    <>
      <Header text="Actividades del evento..."></Header>
      <SimpleGrid
        spacing={4}
        templateColumns="repeat(auto-fill, minmax(200px, 1fr))"
      >
        <Card>
          <CardHeader>
            <Heading size="md"> Customer dashboard</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              View a summary of all your customers over the last month.
            </Text>
          </CardBody>
          <CardFooter>
            <Button>View here</Button>
          </CardFooter>
        </Card>
      </SimpleGrid>
      <Modal_Basic
        title="Creación de Actividad"
        componente={form}
      ></Modal_Basic>
    </>
  );
};

export default Activities;
