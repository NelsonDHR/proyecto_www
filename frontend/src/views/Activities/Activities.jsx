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
} from "@chakra-ui/react";
import { getAllActivities } from "../../api/activity.api";
import { useDisclosure } from "@chakra-ui/hooks";
import AddActivityModal from "./AddActivityModal";
import UpdateActivityModal from "./UpdateActivityModal";
import { useParams } from "react-router-dom";

const Activity = () => {
  const [activity, setActivity] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { eventId } = useParams();

  useEffect(() => {
    async function loadActivity() {
      const res = await getAllActivities(eventId);
      setActivity(res.data);
    }
    loadActivity();
  }, [eventId]);

  const updateActivity = (newActivity) => {
    setActivity([...activity, newActivity]);
  };

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
            <CardHeader>
              <Heading size="md">{activity.name}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{activity.description}</Text>
            </CardBody>
            <CardFooter>
              <UpdateActivityModal
                isOpen={isOpen}
                onClose={onClose}
                refreshActivity={refreshActivity}
                activity={activity}
                index={index}
              />
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
      <AddActivityModal
        isOpen={isOpen}
        onClose={onClose}
        updateActivity={updateActivity}
      />
    </Flex>
  );
};

export default Activity;