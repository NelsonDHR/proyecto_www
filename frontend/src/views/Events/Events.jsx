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
  Stack,
  Center,
  useColorMode,
} from "@chakra-ui/react";
import { getAllEvents } from "../../api/event.api";
import { useDisclosure } from "@chakra-ui/hooks";
import AddEventModal from "./AddEventModal";
import UpdateEventModal from "./UpdateEventModal";
import { getAllContacts } from "../../api/contacts.api";
import DeleteEventModal from "./DeleteEventModal";

const Events = ({selectedOption, handleOptionClick, handleActivityEvent}) => {
  const [events, setEvents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    async function loadEvents() {
      const res = await getAllEvents();
      setEvents(res.data);
    }
    loadEvents();
    loadContacts();
  }, []);

  const updateEvents = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const refreshEvents = (newEvent, index) => {
    const updateEvent = [...events];
    updateEvent[index] = newEvent;
    setEvents(updateEvent);
  };
  
  const deleteEvents = (deletedIndex) => {
    const updatedEvents = [...events];
    updatedEvents.splice(deletedIndex, 1); // Remove the deleted event from the array
    setEvents(updatedEvents);
  };

  const loadContacts = async () => {
    try {
      const response = await getAllContacts();
      setContacts(response.data);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

  const handleActivitiesClick = (event) => {
    handleOptionClick('activities')
    handleActivityEvent(event)
    //console.log("event", event)
  }

  return (
      <Flex
        alignItems="center"
        justifyContent="center"
        height="100vh"
        position="relative"
      >
        <SimpleGrid spacing={4} columns={{ base: 1, sm: 2, md: 3, lg: 5 }}>
          {events.map((event, index) => (
            <Card key={event.id}>
              <Center>
                <CardHeader>
                  <Heading size="md">{event.name}</Heading>
                </CardHeader>
              </Center>
              <CardBody>
                <Text>{event.description}</Text>
              </CardBody>
              <Center>
                <CardFooter>
                  <Stack direction="column" spacing={2}>
                      <Button size="md" onClick={() => handleActivitiesClick(event)}>
                        Activities
                      </Button>
                    <UpdateEventModal
                      isOpen={isOpen}
                      onClose={onClose}
                      refreshEvents={refreshEvents}
                      contacts={contacts}
                      event={event}
                      index={index}
                    />
                      <DeleteEventModal
                      isOpen={isOpen}
                      onClose={onClose}
                      deleteEvents={(index) => deleteEvents(index)}
                      event={event}
                      index={index}
                      updateEvents={updateEvents}
                      />
                     
                  </Stack>
                </CardFooter>
              </Center>
            </Card>
          ))}
        </SimpleGrid>
        <AddEventModal
          isOpen={isOpen}
          onClose={onClose}
          updateEvents={updateEvents}
        />
      </Flex>
  );
};

export default Events;
