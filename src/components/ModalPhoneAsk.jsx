import { View, Text, Modal, TouchableHighlight, Alert } from 'react-native';
import React from 'react';
import FormField from './FormField';
import { useState } from 'react';
import { getUserId, updatePhoneNumber } from '../firebase/services';
import { useGlobalContext } from '../contexts/GlobalContext';

const ModalPhoneAsk = ({ isPhoneNull, setIsPhoneNull, onRefresh }) => {
  const { user, setUser } = useGlobalContext();

  const [phone, setPhone] = useState('');

  const closeModal = () => setIsPhoneNull(false);

  const onSubmit = async () => {
    try {
      if (
        phone === '' ||
        phone.replace(/\D/g, '').length !== 10 ||
        isNaN(phone)
      ) {
        Alert.alert(
          'Invalid Form',
          'Phone number can not be empty, and phone-number must be digit of 10 length',
        );
        return;
      }

      // check if phone number is already exist?
      const isPhoneExist = await getUserId(phone);
      if (isPhoneExist) {
        Alert.alert('Already in used', 'This phone number is already in used');
        return;
      } else {
        const updatedUser = await updatePhoneNumber(user, phone);
        setUser(updatedUser);
        console.log('updatedUser: ', user);
        closeModal();
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      onRefresh();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isPhoneNull}
      onRequestClose={closeModal}
    >
      <View className="h-full justify-center items-center px-5 bg-[#00000080]">
        <View className="w-full justify-center items-start bg-primary p-8 rounded-xl">
          <Text className="font-semibold text-lg text-headline">
            Please Enter Your Phone Number
          </Text>
          <FormField
            title="phone-number"
            handleChange={(e) => setPhone(e)}
            value={phone}
            otherStyles="mt-5"
          />
          <TouchableHighlight
            onPress={onSubmit}
            className="w-full bg-secondary mt-5 py-2 rounded-lg items-center"
          >
            <Text className="text-base font-semibold text-primary">Submit</Text>
          </TouchableHighlight>
        </View>
      </View>
    </Modal>
  );
};

export default ModalPhoneAsk;
