import React, { useEffect, useState } from "react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Modal,
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
  HStack,
} from "@chakra-ui/react";
import { putActivity } from "../../api/activity.api";

const UpdateActivityModal = ({ refreshActivities, activity, contacts, ...props }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [participants, setParticipants] = useState(activity.participation_activities);
  const [selectedParticipants, setSelectedParticipants] = useState(
    activity.participation_activities.reduce((acc, participant) => {
      acc[participant.user.id] = {
        isSelected: true,
        cost: parseFloat(participant.value_to_pay) || parseFloat(participant.percentage_to_pay) || 0,
      };
      return acc;
    }, {})
  );
  const [editedValues, setEditedValues] = useState(
    !activity.is_equitable
      ? activity.participation_activities.reduce((acc, participant) => {
        acc[participant.user.id] = parseFloat(participant.value_to_pay) || parseFloat(participant.percentage_to_pay) || 0;
        return acc;
      }, {})
      : {}
  );
  const [paymentType, setPaymentType] = useState(activity.payment_type);
  const [isAdvanced, setIsAdvanced] = useState(!activity.is_equitable);
  const [formErrors, setFormErrors] = useState({});
  const [activityData, setActivityData] = useState({
    event: activity.event,
    name: activity.name,
    description: activity.description,
    image: null,
    image_name: activity.image_name,
    value: activity.value,
    payment_type: activity.payment_type,
    is_equitable: activity.is_equitable,
    is_active: activity.is_active,
    participants: activity.participants.map(participant => participant.id),
  });


  // Handle Functions

  /* This function handles changes in the form inputs.
  It updates the activityData state with the new input values.
  If the input that changed was the "value" input, it also recalculates 
  the cost per participant and updates the selectedParticipants state. */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
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
      const totalValue = Object.values(editedValues).reduce((total, val) => total + Number(val), 0) - (editedValues[id] || 0) + Number(value);
      console.log("x", totalValue)

      if ((paymentType === 'FV' && totalValue > activityData.value) || (paymentType === 'PR' && totalValue > 100)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          value: paymentType === 'FV' ? "The sum of all participant values cannot exceed the activity value" : "The sum of all percentages cannot exceed 100% and each percentage must be between 0 and 100",
        }));
        return;
      } else if (totalValue <= (paymentType === 'FV' ? activityData.value : 100)) {
        setFormErrors((prevErrors) => ({
          ...prevErrors,
          value: "",
        }));
      }

      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [id]: "",
      }));

      setEditedValues(prev => ({ ...prev, [id]: value }));
    }
  };

  const handlePaymentTypeChange = (newPaymentType) => {
    setPaymentType(newPaymentType);

    setSelectedParticipants((prev) => {
      const updatedParticipants = { ...prev };

      const selectedCount = Object.values(updatedParticipants).filter(p => p.isSelected).length;
      const costOrPercentagePerParticipant = newPaymentType === 'FV' ? activityData.value / selectedCount : 100 / selectedCount;

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
      if (selectedCount === 0) {
        updatedParticipants[participantId].isSelected = true;
        return updatedParticipants;
      }

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

  const handleSubmit = async () => {
    let errors = {};
    if (!activityData.name) errors.name = "Name is required";
    if (!activityData.description) errors.description = "Description is required";
    if (!activityData.value) errors.value = "Value of the activity is required";

    if (isAdvanced) {
      const totalValue = Object.values(editedValues).reduce((total, val) => total + Number(val), 0);
      if ((paymentType === 'FV' && totalValue != activityData.value) || (paymentType === 'PR' && totalValue < 99)) {
        errors.value = paymentType === 'FV' ? "The sum of all participant values must equal the activity value" : "The sum of all percentages must equal 100%";
      }

      const selectedParticipantIds = Object.entries(selectedParticipants)
        .filter(([id, participant]) => participant.isSelected)
        .map(([id]) => id);

      for (const id of selectedParticipantIds) {
        if (!editedValues[id]) {
          errors[id] = "Is required";
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      const participants = Object.entries(selectedParticipants)
        .filter(([id, participant]) => participant.isSelected)
        .map(([id, participant]) => {
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

      const updatedActivityData = {
        ...activityData,
        payment_type: paymentType,
        is_equitable: !isAdvanced,
        participants,
      };

      const updatedActivity = await putActivity(activity.id, updatedActivityData);
      refreshActivities(updatedActivity.data, props.index);
      onClose();
    } catch (error) {
      console.error("Error al actualizar la actividad:", error);
    }
  };

  // Use Effects

  useEffect(() => {
    setParticipants(activity.participation_activities);
  }, []);

  return (
    <>
      <Button onClick={onOpen} colorScheme="blue">Edit Activity</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent margin="auto">
          <ModalHeader pb={4}>Edit Activity</ModalHeader>
          <ModalCloseButton />
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

            <FormControl mb={4} isInvalid={!!formErrors.name}>
              <FormLabel>Name of the activity</FormLabel>
              <Input
                type="text"
                name="name"
                value={activityData.name}
                onChange={handleChange}
              />
              {formErrors.name && <FormErrorMessage>{formErrors.name}</FormErrorMessage>}
            </FormControl>

            <FormControl mb={4} isInvalid={!!formErrors.description}>
              <FormLabel>Activity description</FormLabel>
              <Input
                type="text"
                name="description"
                value={activityData.description}
                onChange={handleChange}
              />
              {formErrors.description && <FormErrorMessage>{formErrors.description}</FormErrorMessage>}
            </FormControl>

            <FormControl mb={4} isInvalid={!!formErrors.value}>
              <FormLabel>Value of the activity</FormLabel>
              <Input
                type="number"
                name="value"
                value={activityData.value}
                onChange={handleChange}
              />
              {formErrors.value && <FormErrorMessage>{formErrors.value}</FormErrorMessage>}
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Type of payment</FormLabel>
              <RadioGroup value={paymentType} onChange={handlePaymentTypeChange}>
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
                  <Switch isChecked={isAdvanced} onChange={(e) => setIsAdvanced(e.target.checked)} disabled={!activityData.value} />
                  <FormLabel>Advanced</FormLabel>
                </HStack>
              </Flex>
              {participants.map((participant) => (
                <Flex justify="space-between" align="center" key={participant.user.id} mt={2}>
                  <Checkbox
                    isChecked={selectedParticipants[participant.user.id]?.isSelected}
                    onChange={() => handleParticipantsChange(participant.user.id)}
                    mb={2}
                  >
                    {participant.user.nickname}
                  </Checkbox>
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={isAdvanced ? (editedValues[participant.user.id] || '') : (selectedParticipants[participant.user.id]?.isSelected ? selectedParticipants[participant.user.id].cost.toFixed(2) : 0)}
                    onChange={(e) => handleCostChange(participant.user.id, e.target.value)}
                    disabled={!isAdvanced || !selectedParticipants[participant.user.id]?.isSelected}
                    width="150px"
                    isInvalid={!!formErrors[participant.user.id]}
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
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateActivityModal;
