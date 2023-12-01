import React, { useEffect, useState } from "react";
import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  ModalFooter,
  Tag,
  TagLabel,
  TagCloseButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Center,
  Wrap,
  WrapItem,
  useToast,
} from "@chakra-ui/react";
import { putEvent } from "../../api/event.api";

const UpdateEventModal = ({ refreshEvents, event, contacts, updateEvents, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [eventData, setEventData] = useState({
    description: event.description,
    event_type: event.event_type,
    image: event.image,
    image_name: event.image_name,
    is_active: true,
    name: event.name,
    participants: event.participants.map(participant => participant.id)
  });

  const [participants, setParticipants] = useState(event.participants);
  const [allParticipants, setAllParticipants] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const toast = useToast();

  useEffect(() => {

    setParticipants(event.participants);

    const combinedList = [...contacts, ...event.participants];
    const uniqueList = Array.from(new Set(combinedList.map(a => a.id)))
      .map(id => {
        return combinedList.find(a => a.id === id)
      });

    setAllParticipants(uniqueList);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
    setEventData({
      ...eventData,
      [name]: value,
    });
  };

  const handleParticipantsChange = (selectedParticipants) => {
    const uniqueParticipants = Array.from(new Set([eventData.participants[0], ...selectedParticipants]));
    setEventData((prevData) => ({
      ...prevData,
      participants: uniqueParticipants,
    }));
  };

  const handleRemoveParticipants = (participantId) => {
    if (participantId !== eventData.participants[0]) {
      setEventData((prevData) => ({
        ...prevData,
        participants: prevData.participants.filter((id) => id !== participantId),
      }));
    }
  };

  const handleSubmit = async () => {
    let errors = {};
    if (!eventData.name) errors.name = "Name is required";
    if (!eventData.description) errors.description = "Description is required";
    if (!eventData.event_type) errors.event_type = "Event type is required";
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    try {
      const newEvent = await putEvent(event.id, eventData);
      refreshEvents(newEvent.data, props.index);
      console.log("Evento actualizado:", eventData);
      onClose();
    } catch (error) {
      console.error("Error al actualizar el evento:", error);
      if (error.response && error.response.data.error === "Can't update the event because it has activities.") {
        toast({
          title: "Error updating the event",
          description: "You can't update an event that has activities!",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">Edit Event</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="auto">
          <ModalHeader pb={4}>Edit Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4} isInvalid={!!formErrors.name}>
              <FormLabel>Name of the event</FormLabel>
              <Input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleChange}
              />
              {formErrors.name && <FormErrorMessage>{formErrors.name}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={4} isInvalid={!!formErrors.description}>
              <FormLabel>Description of the event</FormLabel>
              <Input
                type="text"
                name="description"
                value={eventData.description}
                onChange={handleChange}
              />
              {formErrors.description && <FormErrorMessage>{formErrors.description}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={4} isInvalid={!!formErrors.event_type}>
              <FormLabel>Type of event</FormLabel>
              <Select
                name="event_type"
                value={eventData.event_type}
                onChange={handleChange}
              >
                <option value="">Select a type of event</option>
                <option value="TR">Travel</option>
                <option value="HM">Home</option>
                <option value="PR">Couple</option>
                <option value="FD">Food</option>
                <option value="OT">Other</option>
              </Select>
              {formErrors.event_type && <FormErrorMessage>{formErrors.event_type}</FormErrorMessage>}
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Participants</FormLabel>
              <Center>
                <Menu>
                  <MenuButton as={Button}>
                    Select participants
                  </MenuButton>
                  <MenuList>
                    {allParticipants.map((participant) => (
                      <MenuItem
                        key={participant.id}
                        onClick={() => handleParticipantsChange([...eventData.participants, participant.id])}
                      >
                        {participant.nickname}
                      </MenuItem>
                    ))}
                  </MenuList>
                </Menu>
              </Center>
            </FormControl>
            <Wrap spacing={2}>
              {eventData.participants.map((participantId) => (
                <WrapItem key={participantId}>
                  <Tag size="lg" colorScheme="teal">
                    <TagLabel>{allParticipants.find((participant) => participant.id === participantId)?.nickname}</TagLabel>
                    <TagCloseButton onClick={() => handleRemoveParticipants(participantId)} />
                  </Tag>
                </WrapItem>
              ))}
            </Wrap>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleSubmit}>
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateEventModal;

