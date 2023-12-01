// ContactsView.jsx
import React, { useEffect, useState } from 'react';
import { Text, Icon, Flex, VStack } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import Contact from './Contact';
import AddContactModal from './AddContactModal';
import { getAllContacts } from '../../api/contacts.api';

const ContactsView = () => {
  const [contacts, setContacts] = useState([]);

  const updateContacts = async () => {
    const response = await getAllContacts();
    setContacts(response.data);
  };

  useEffect(() => {
    updateContacts();
  }, []);

  return (
    <Flex height="100vh" p={4} overflowY="auto" overflowX="hidden" position="relative" css={{
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
        <VStack width="100%" spacing={4} align="stretch">
          {contacts.length > 0 ? (
            contacts.map((contact) => <Contact key={contact.id} contact={contact} updateContacts={updateContacts} />)
          ) : (
            <Flex direction="column" alignItems="center" justifyContent="center" height="100%">
              <Icon as={WarningIcon} boxSize={6} color="yellow.400" />
              <Text fontSize="xl" mt={2}>You don't have contacts yet.</Text>
            </Flex>
          )}
        </VStack>
      </Flex>
      <AddContactModal contactsList={contacts} updateContacts={updateContacts} />
    </Flex>
  );
};

export default ContactsView;