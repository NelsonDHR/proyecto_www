import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, SimpleGrid, Heading, Button, Text, Flex, Stack,Center } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { getAllEvents } from '../../api/event.api';
import { useDisclosure } from "@chakra-ui/hooks";
import AddEventModal from './AddEventModal';
import UpdateEventModal from './UpdateEventModal';

const Events = () => {
  const [events, setEvents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    async function loadEvents() {
      const res = await getAllEvents();
      setEvents(res.data);
    }
    loadEvents();
  }, []);

  const updateEvents = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  const refreshEvents = (newEvent, index) => {
    const updateEvent = [...events]
    updateEvent[index] = newEvent
    setEvents(updateEvent)
  };

  return (
    <Flex alignItems="center" justifyContent="center" height="100vh" position="relative">
      <SimpleGrid spacing={4} columns={{ base: 1, sm: 2, md: 3, lg: 5 }}>
        {events.map((event,index) => (
          <Card key={event.id}>
            <Center>
              <CardHeader>
                <Heading size='md'>{event.name}</Heading>
              </CardHeader>
            </Center>
            <CardBody>
              <Text>{event.description}</Text>
            </CardBody>
            <Center>
              <CardFooter>
                <Stack direction="column" spacing={2}>
                  <Button size="md">
                    Ver actividades
                  </Button>
                  <UpdateEventModal isOpen={isOpen} onClose={onClose} refreshEvents={refreshEvents} event={event} index={index} />
                </Stack>
              </CardFooter>
            </Center>
          </Card>
        ))}
      </SimpleGrid>
      <AddEventModal isOpen={isOpen} onClose={onClose} updateEvents={updateEvents} />
    </Flex>
  );
};

export default Events;
