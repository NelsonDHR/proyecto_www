import React, { useState, useEffect } from "react";
import { RxActivityLog } from "react-icons/rx";
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Modal,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  Image,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Text,
} from "@chakra-ui/react";
import decoration from "../../assets/activities/decoration.jpg";
import drinking from "../../assets/activities/drinking.jpg";
import planning from "../../assets/activities/planning.jpg";
import shopping from "../../assets/activities/shopping.jpg";
import tickets from "../../assets/activities/tickets.jpg";
import transportation from "../../assets/activities/transportation.jpg";
import { createActivity } from "../../api/activity.api";
import { getEventParticipants } from "../../api/event.api";

const AddActivityModal = ({ updateActivities, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [participants, setParticipants] = useState([]);
  const [selectedParticipants, setSelectedParticipants] = useState({});
  const [editedValues, setEditedValues] = useState({});
  const [paymentType, setPaymentType] = useState('FV');
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [activityData, setActivityData] = useState({
    event: props.event.id,
    name: "",
    description: "",
    image: null,
    image_name: "",
    value: "",
    payment_type: "FV",
    is_equitable: true,
    is_active: true,
    participants: [],
  });

  const imageNames = [decoration, drinking, planning, shopping, tickets, transportation];
  const imageFileNames = ["decoration.jpg", "drinking.jpg", "planning.jpg", "shopping.jpg", "tickets.jpg", "transportation.jpg"];

  // Handle Functions

  /* This function handles changes in the form inputs.
  It updates the activityData state with the new input values.
  If the input that changed was the "value" input, it also recalculates 
  the cost per participant and updates the selectedParticipants state. */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setActivityData({
      ...activityData,
      [name]: value,
    });

    if (name === "value") {
      const costPerParticipant = value / Object.keys(selectedParticipants).length;
      const updatedParticipants = Object.fromEntries(
        Object.entries(selectedParticipants).map(([id, participant]) => [
          id,
          { ...participant, cost: participant.isSelected ? costPerParticipant : 0 },
        ])
      );
      setSelectedParticipants(updatedParticipants);
    }
  };

  /* This function handles changes in the cost input for 
  each participant when the advanced mode is enabled.
  It updates the editedValues state with the new cost value 
  for the given participant ID. */

  const handleCostChange = (id, value) => {
    if (isAdvanced) {
      setEditedValues(prev => ({ ...prev, [id]: value }));
    }
  };

  /* This function handles changes in the selection of participants.
  It updates the selectedParticipants state to reflect the new selection.
  It also recalculates the cost or percentage per participant based on the 
  new selection and updates the cost for each participant in selectedParticipants.*/

  const handleParticipantsChange = (participantId) => {
    setSelectedParticipants((prev) => {
      const updatedParticipants = {
        ...prev,
        [participantId]: {
          ...prev[participantId],
          isSelected: !prev[participantId]?.isSelected,
        },
      };

      const selectedCount = Object.values(updatedParticipants).filter(p => p.isSelected).length;
      const costOrPercentagePerParticipant = paymentType === 'FV' ? activityData.value / selectedCount : 100 / selectedCount;

      for (const id in updatedParticipants) {
        if (updatedParticipants[id].isSelected) {
          updatedParticipants[id].cost = costOrPercentagePerParticipant;
        } else {
          updatedParticipants[id].cost = 0;
        }
      }

      return updatedParticipants;
    });
  };

  /* This function handles the submission of the form.
  It creates a new activity with the data from the form and the selected 
  participants, and then updates the activities state with the new activity. */

  const handleSubmit = async () => {
    try {
      const participants = Object.entries(selectedParticipants)
        .filter(([id, participant]) => participant.isSelected)
        .map(([id, participant]) => {
          // Dependiendo del tipo de pago, envía value_to_pay o percentage_to_pay
          if (paymentType === 'FV') {
            return {
              id,
              value_to_pay: isAdvanced ? editedValues[id] : participant.cost,
            };
          } else {
            return {
              id,
              percentage_to_pay: isAdvanced ? editedValues[id] : participant.cost,
            };
          }
        });

      const newActivityData = {
        ...activityData,
        payment_type: paymentType,
        is_equitable: !isAdvanced,
        participants,
      };

      const newActivity = await createActivity(newActivityData);
      updateActivities(newActivity.data);
      onClose();
    } catch (error) {
      console.error("Error al crear la actividad:", error);
    }
  };

  // Use Effects

  /* This effect runs once when the component mounts.
  It fetches the participants for the event and sets the participants 
  and selectedParticipants states with the fetched data. */

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const participants = await getEventParticipants(props.event.id);
        setParticipants(participants.data);

        const initialSelectedParticipants = participants.data.reduce((acc, participant) => {
          acc[participant.id] = { isSelected: true, cost: activityData.value / participants.data.length };
          return acc;
        }, {});
        setSelectedParticipants(initialSelectedParticipants);

      } catch (error) {
        console.error("Error loading participants:", error);
      }
    };

    loadParticipants();
  }, []);

  /* This effect runs whenever the paymentType or activityData.value changes.
  It recalculates the cost or percentage per participant based on the new values 
  and updates the cost for each participant in selectedParticipants. */

  useEffect(() => {
    setSelectedParticipants((prev) => {
      const updatedParticipants = { ...prev };

      const selectedCount = Object.values(updatedParticipants).filter(p => p.isSelected).length;
      const costOrPercentagePerParticipant = paymentType === 'FV' ? activityData.value / selectedCount : 100 / selectedCount;

      for (const id in updatedParticipants) {
        if (updatedParticipants[id].isSelected) {
          updatedParticipants[id].cost = costOrPercentagePerParticipant;
        } else {
          updatedParticipants[id].cost = 0;
        }
      }

      return updatedParticipants;
    });

  }, [paymentType, activityData.value]);

  return (
    <>
      <Button
        position="fixed"
        bottom="2rem"
        right="2rem"
        style={{ zIndex: 9999 }}
        colorScheme="teal"
        size="lg"
        borderRadius="full"
        p={6}
        onClick={onOpen}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        _hover={{
          bg: "teal.400",
          color: "white",
          transform: "scale(1.1)",
          transition: "all 0.2s ease-in-out",
        }}
        _focus={{
          boxShadow: "none",
        }}
        width={isHovered ? "150px" : "40px"}
      >
        <Icon as={RxActivityLog} />
        {isHovered && (
          <Text ml={2} fontSize={17.5}>
            Add Activity
          </Text>
        )}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="auto">
          <ModalHeader pb={4}>Create Activity</ModalHeader>
          <ModalCloseButton />

          <Box
            position="relative"
            width="100%"
            height="100px"
            _after={{
              content: '""',
              display: 'block',
              position: 'absolute',
              top: '0',
              left: '0',
              width: '100%',
              height: '100%',
              backgroundImage: 'linear-gradient(200deg, transparent, black)',
              zIndex: '1',
            }}
          >
            <Carousel
              showThumbs={false}
              showStatus={false}
              dynamicHeight={false}
              infiniteLoop={true}
              onChange={(index) => setActivityData({ ...activityData, image_name: imageFileNames[index] })}
            >
              {imageNames.map((imageName, index) => (
                <div key={index}>
                  <Image
                    src={imageName}
                    alt={`Activity ${index + 1}`}
                    width="100%"
                    height="100px"
                    objectFit="cover"
                  />
                </div>
              ))}
            </Carousel>
          </Box>

          <ModalBody
            maxH="400px"
            overflowY="scroll"
            css={{
              "&::-webkit-scrollbar": {
                width: "4px",
              },
              "&::-webkit-scrollbar-track": {
                width: "6px",
              },
              "&::-webkit-scrollbar-thumb": {
                background: "gray",
                borderRadius: "24px",
              },
            }}
          >

            <FormControl mb={4}>
              <FormLabel>Name of the activity</FormLabel>
              <Input
                type="text"
                name="name"
                value={activityData.name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Activity description</FormLabel>
              <Input
                type="text"
                name="description"
                value={activityData.description}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Value of the activity</FormLabel>
              <Input
                type="number"
                name="value"
                value={activityData.value}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Type of payment</FormLabel>
              <RadioGroup value={paymentType} onChange={setPaymentType}>
                <Stack direction="row">
                  <Radio value="FV">Fixed value</Radio>
                  <Radio value="PR">Percentage</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>

            <FormControl mb={4}>
              <Flex justify="space-between" align="center" mb={4}>
                <FormLabel>Participants</FormLabel>
                <HStack spacing="24px">
                  <Switch isChecked={isAdvanced} onChange={(e) => setIsAdvanced(e.target.checked)} />
                  <FormLabel>Advanced</FormLabel>
                </HStack>
              </Flex>
              {participants.map((participant) => (
                <Flex justify="space-between" align="center" key={participant.id} mt={2}>
                  <Checkbox
                    isChecked={selectedParticipants[participant.id]?.isSelected}
                    onChange={() => handleParticipantsChange(participant.id)}
                    mb={2}
                  >
                    {participant.nickname}
                  </Checkbox>
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={isAdvanced ? (editedValues[participant.id] || '') : (selectedParticipants[participant.id]?.isSelected ? selectedParticipants[participant.id].cost.toFixed(2) : 0)}
                    onChange={(e) => handleCostChange(participant.id, e.target.value)}
                    disabled={!isAdvanced || !selectedParticipants[participant.id]?.isSelected}
                    width="150px"
                  />
                </Flex>
              ))}
            </FormControl>

          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddActivityModal;
