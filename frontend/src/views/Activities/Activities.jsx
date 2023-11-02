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
  Flex,
  Box,
  useColorMode,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { getAllActivities } from "../../api/activity.api";
import { useDisclosure } from "@chakra-ui/hooks";
import AddActivityModal from "./AddActivityModal";
import UpdateActivityModal from "./UpdateActivityModal";
import Navbar from "../../components/Navbar";

const Activity = () => {
  const { colorMode } = useColorMode();
  const [activity, setActivity] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedOption, setSelectedOption] = useState("activities");

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

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

  const refreshActivity = (newActivity, index) => {
    const updateActivity = [...activity];
    updateActivity[index] = newActivity;
    setActivity(updateActivity);
  };
  //console.log(activity)

  return (
    <Box
      w="100vw"
      h="100vh"
      display="flex"
      flexDirection="column"
      overflow="hidden"
      bg={colorMode === "light" ? "gray.200" : "gray.800"}
    >
      <Navbar
        selectedOption={selectedOption}
        handleOptionClick={handleOptionClick}
      />
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
    </Box>
  );
};

export default Activity;
