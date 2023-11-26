import React, { useEffect, useState, useRef } from "react";
import { Box, Flex, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { WarningIcon } from '@chakra-ui/icons';

import { getAllContacts } from "../../api/contacts.api";
import { getAllEvents } from "../../api/event.api";
import Event from "./Event";
import AddEventModal from "./AddEventModal";

const EventsView = ({ selectedOption, handleOptionClick, handleActivityEvent }) => {
  const [events, setEvents] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contacts, setContacts] = useState([]);
  const lastEventRef = useRef(null);

  useEffect(() => {
    async function loadEvents() {
      const res = await getAllEvents();
      setEvents(res.data);
    }
    loadEvents();
    loadContacts();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      lastEventRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [events]);

  const updateEvents = async () => {
    const res = await getAllEvents();
    setEvents(res.data);
  };

  const refreshEvents = (newEvent, index) => {
    const updatedEvents = [...events];
    console.log(newEvent)
    updatedEvents[index] = newEvent;
    setEvents(updatedEvents);
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
  }

  return (
    <Flex height="100vh" p={2} overflowY="auto" overflowX="hidden" position="relative" css={{
      '&::-webkit-scrollbar': {
        width: '10px',
      },
      '&::-webkit-scrollbar-track': {
        width: '10px',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'gray',
        borderRadius: '24px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: '#888', // Cambia esto al color que prefieras
      }
    }}>
      <Flex position="relative" width="100%" justifyContent="center">
        {events.length > 0 ? (
          <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" width="100%">
            <VStack width="100%" align="stretch">
              <SimpleGrid p={4} gap={6} gridTemplateColumns={`repeat(auto-fill, minmax(250px, 1fr))`} m={2}>
                {events.map((event, index) => (
                  <div key={event.id} ref={index === events.length - 1 ? lastEventRef : null}>
                    <Event data={event} index={index} refreshEvents={refreshEvents} deleteEvents={deleteEvents} contacts={contacts} handleActivitiesClick={handleActivitiesClick} />
                  </div>
                ))}
              </SimpleGrid>
            </VStack>
          </Flex>
        ) : (
          <Flex direction="column" alignItems="center" justifyContent="center" height="100%" width="100%">
            <Icon as={WarningIcon} boxSize={6} color="yellow.400" />
            <Text fontSize="xl" mt={2}>You don't have events yet.</Text>
          </Flex>
        )}
      </Flex>
      <AddEventModal
        isOpen={isOpen}
        onClose={onClose}
        updateEvents={updateEvents}
      />
    </Flex>
  )
};

export default EventsView;
