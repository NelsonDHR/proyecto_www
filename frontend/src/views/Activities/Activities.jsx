import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  SimpleGrid,
  Heading,
  Text,
  Flex,
  Stack,
  Center,
} from "@chakra-ui/react";
import { getAllActivities } from "../../api/activity.api";
import { useDisclosure } from "@chakra-ui/hooks";
import AddActivityModal from "./AddActivityModal";
import UpdateActivityModal from "./UpdateActivityModal";
import DeleteActivityModal from "./DeletActivityModal";
import { useParams } from "react-router-dom";

const Activity = ({ event }) => {
  const [activity, setActivity] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { eventId } = useParams();

  useEffect(() => {
    async function loadActivity(event) {
      const res = await getAllActivities(event);
      setActivity(res.data);
    }
    loadActivity(event);
    //console.log("Dentro actividad", event)
  }, [event]);

  const updateActivity = (newActivity) => {
    setActivity([...activity, newActivity]);
  };

  const deleteActivity = (deleteIndex) => {
    const updatedActivity = [...activity];
    updatedActivity.splice(deleteIndex, 1); // Remove the deleted event from the array
    setActivity(updatedActivity);
  }

  const refreshActivity = (newActivity, index) => {
    const updateActivity = [...activity];
    updateActivity[index] = newActivity;
    setActivity(updateActivity);
  };

  return (
    <Flex
      alignItems="center"
      justifyContent="center"
      height="100vh"
      position="relative"
    >
      <SimpleGrid spacing={4} columns={{ base: 1, sm: 2, md: 3, lg: 5 }}>
        {activity.map((activity, index) => (
          <Card key={activity.id}>
            <Center>
              <CardHeader>
                <Heading size="md">{activity.name}</Heading>
              </CardHeader>
            </Center>
            <Center>
              <CardBody>
                <Text>{activity.description}</Text>
              </CardBody>
            </Center>
            <Center>
              <CardFooter>
                <Stack direction="column" spacing={2}>
                  <UpdateActivityModal
                    isOpen={isOpen}
                    onClose={onClose}
                    refreshActivity={refreshActivity}
                    activity={activity}
                    index={index}
                  />
                  <DeleteActivityModal
                    isOpen={isOpen}
                    onClose={onClose}
                    deleteActivity={(index) => deleteActivity(index)}
                    activity={activity}
                    index={index}
                    updateActivity={updateActivity}
                  />
                </Stack>
              </CardFooter>
            </Center>
          </Card>
        ))}
      </SimpleGrid>
      <AddActivityModal
        isOpen={isOpen}
        onClose={onClose}
        updateActivity={updateActivity}
        event={event}
      />
    </Flex>
  );
};

export default Activity;
