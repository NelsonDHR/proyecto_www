import React, { useEffect, useState } from "react";
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
  Flex,
} from "@chakra-ui/react";
import Header from "../../components/Header";
import Modal_Basic from "../../components/Modal";
///import DynamicForm from "../../components/ActivityForm";
import FormActivity from "./FormActivities";
import { getAllActivities } from "../../api/activity.api";

const Activities = () => {
  const [activity, setActivity] = useState([]);
  const form = <FormActivity ></FormActivity>;

  useEffect(() => {
    async function loadActivity() {
      const res = await getAllActivities();
      setActivity(res.data);
    }
    loadActivity();
  }, []);

  const updateActivity = (newActivity) => {
    setActivity([...activity, newActivity]);
  };

  return (
    <>
      <Header text="Actividades del evento..."></Header>
      <SimpleGrid
        spacing={5}
        columns={{ base: 1, sm: 2, md: 3, lg: 5 }}
        justifyContent="center"
      >
        {activity.map((activity) => (
          <Card key={activity.id}>
            <CardHeader>
              <Heading size="md">{activity.name}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{activity.description}</Text>
            </CardBody>
            <CardFooter>
              <Button>Ver detalles</Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>

      <Modal_Basic
        title="Creación de Actividad"
        componente={form}
      ></Modal_Basic>
    </>
  );
};

export default Activities;
