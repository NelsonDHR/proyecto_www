import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, CardFooter, SimpleGrid, Heading, Button, Text, Flex } from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { getAllEvents } from '../../api/event.api';
import { useDisclosure } from "@chakra-ui/hooks";
import AddEventModal from './AddEventModal';

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

  return (
    <Flex alignItems="center" justifyContent="center" height="100vh" position="relative">
      <SimpleGrid spacing={4} columns={{ base: 1, sm: 2, md: 3, lg: 5 }}>
        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <Heading size='md'>{event.name}</Heading>
            </CardHeader>
            <CardBody>
              <Text>{event.description}</Text>
            </CardBody>
            <CardFooter>
              <Button>Ver actividades</Button>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
      <AddEventModal isOpen={isOpen} onClose={onClose} updateEvents={updateEvents} />
    </Flex>
  );
};

export default Events;
