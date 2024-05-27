import { View, Text, Modal, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import { useGlobalContext } from '../contexts/GlobalContext.js';
import FormField from './FormField.jsx';
import { updateContact } from '../firebase/services.js';

const ModalAddContacts = ({
  modalAddContact,
  setModalAddContact,
  setContactData,
}) => {
  const { user, setUser } = useGlobalContext();
  const [form, setForm] = useState({
    name: '',
    phone: '',
  });



  const onSubmit = async () => {
    try {
      if (
        form.name === '' ||
        form.phone === '' ||
        form.phone.replace(/\D/g, '').length !== 10 ||
        user.contacts.find(
          (contact) =>
            form.phone === contact.phone || form.phone === user.phone,
        )
      ) {
        Alert.alert(
          'Invalid Form',
          'field can not be empty or duplicated, and phone-number must be digit of 10 length',
        );
        return;
      }
      const updatedUser = await updateContact(user, form);
      console.log(updatedUser);
      setUser(updatedUser);
      setContactData(updatedUser.contacts);
      setModalAddContact(false);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalAddContact}
      onRequestClose={() => setModalAddContact(false)}
    >
      <View className="flex-1 justify-end items-center ">
        <View className="h-[350px]  w-full justify-start items-center rounded-t-2xl  bg-secondary p-10">
          <FormField
            title="Contact Name"
            handleChange={(e) => setForm({ ...form, name: e })}
            placeholder="Enter Contact Name"
            value={form.name}
            otherStyles={`mb-2`}
          />
          <FormField
            title="Contact Phone-number"
            handleChange={(e) => setForm({ ...form, phone: e })}
            placeholder="Enter Contact Phone-number"
            value={form.phone}
          />
          <TouchableOpacity onPress={onSubmit}>
            <View className="rounded-lg py-1 px-3 mt-6 mb-2 bg-primary">
              <Text className="text-base font-bold text-stroke">
                Add Contact
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setModalAddContact(false)}>
            <Text className="text-sm text-stroke">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalAddContacts;
