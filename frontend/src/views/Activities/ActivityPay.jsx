// PaymentFormModal.jsx
import React, { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Input,
  Button,
  useDisclosure,
  Center,
  useEditableStyles
} from '@chakra-ui/react';
import { pay } from '../../api/payment.api';

const ActivityPay = ({activity}) => {
  
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [paymentData, setPaymentData] = useState({
    participation_activity: activity.id,
    value: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(paymentData)
    setPaymentData({
      ...paymentData,
      [name]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const paymentInfo = await pay(paymentData);
      console.log(paymentInfo)
      onClose();
    } catch (error) {
      console.error("Error al pagar:", error);
    }
  };
  

  return (
    <>
    <Button colorScheme="teal" onClick={onOpen}>Pay</Button>
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Payment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form>
            <label>
              Amount:
              <Input
                type="number"
                name="value"
                onChange={handleChange}
              />
            </label>
            <Center marginTop="4">
            <Button type="button" colorScheme='teal' onClick={handleSubmit}>
              Pay
            </Button>
            </Center>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
    </>
  );
};

export default ActivityPay;
