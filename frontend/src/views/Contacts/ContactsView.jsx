// ContactsView.jsx
import React, { useEffect, useState } from 'react';
import { Text, Box, Icon, Flex, VStack } from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import Contact from './Contact';
import AddContactModal from './AddContactModal';
import { getAllContacts } from '../../api/contacts.api';
import Navbar from '../../components/Navbar';

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
    <Box>
      <Navbar />
      <Flex direction="column" alignItems="center" justifyContent="flex-start" height="100vh" p={4}>
        <VStack width="100%" spacing={4} align="stretch">
          {contacts.length > 0 ? (
            contacts.map((contact) => <Contact key={contact.id} contact={contact} updateContacts={updateContacts} />)
          ) : (
            <Flex direction="column" alignItems="center" justifyContent="center" height="100%">
              <Icon as={WarningIcon} boxSize={6} color="yellow.400" />
              <Text fontSize="xl" mt={2}>No tienes contactos aún.</Text>
            </Flex>
          )}
        </VStack>
        <AddContactModal updateContacts={updateContacts} />
      </Flex>
    </Box>
  );
};

export default ContactsView;