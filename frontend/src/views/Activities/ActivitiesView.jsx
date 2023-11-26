import React, { useEffect, useState, useRef } from "react";
import { Flex, Icon, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { WarningIcon } from '@chakra-ui/icons';
import { getAllActivities } from "../../api/activity.api";
import AddActivityModal from "./AddActivityModal";
import { getAllContacts } from "../../api/contacts.api";
import Activity from "./Activity";

const ActivitiesView = ({ event }) => {
  const [activities, setActivities] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [contacts, setContacts] = useState([]);
  const lastEventRef = useRef(null);

  useEffect(() => {
    async function loadActivities(event) {
      const res = await getAllActivities(event.id);
      console.log("loadactivities", res.data)
      setActivities(res.data);
    }
    loadActivities(event);
    loadContacts()
  }, [event]);

  useEffect(() => {
    if (activities.length > 0) {
      lastEventRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activities]);

  const updateActivities = (newActivity) => {
    setActivities([...activities, newActivity]);
  };

  const deleteActivities = (deleteIndex) => {
    const updatedActivities = [...activities];
    updatedActivities.splice(deleteIndex, 1); // Remove the deleted event from the array
    setActivities(updatedActivities);
  }

  const refreshActivities = (newActivity, index) => {
    const updatedActivities = [...activities];
    updatedActivities[index] = newActivity;
    updatedActivities[index].participants = newActivity.participants;
    setActivities(updatedActivities);
  };

  const loadContacts = async () => {
    try {
      const response = await getAllContacts();
      setContacts(response.data);
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

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
        {activities.length > 0 ? (
          <Flex direction="column" justifyContent="flex-start" alignItems="flex-start" width="100%">
            <VStack width="100%" align="stretch">
              <SimpleGrid p={4} gap={6} gridTemplateColumns={`repeat(auto-fill, minmax(250px, 1fr))`} m={2}>
                {activities.map((activity, index) => (
                  <div key={activity.id} ref={index === activities.length - 1 ? lastEventRef : null}>
                    <Activity data={activity} index={index} refreshActivities={refreshActivities} deleteActivities={deleteActivities} contacts={contacts}/>
                  </div>
                ))}
              </SimpleGrid>
            </VStack>
          </Flex>
        ) : (
          <Flex direction="column" alignItems="center" justifyContent="center" height="100%" width="100%">
            <Icon as={WarningIcon} boxSize={6} color="yellow.400" />
            <Text fontSize="xl" mt={2}>You don't have activities for {event.name} yet.</Text>
          </Flex>
        )}
      </Flex>
      <AddActivityModal
        isOpen={isOpen}
        onClose={onClose}
        updateActivities={updateActivities}
        event={event}
      />
    </Flex>
  );
};

export default ActivitiesView;
