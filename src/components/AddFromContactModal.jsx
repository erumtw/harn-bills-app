import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import React, { useState } from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';
// import ContactCard from './ContactCard';
import icons from '../constants/icons';

const AddFromContactModal = ({
  modalVisible,
  setModalVisible,
  setForm,
  form,
}) => {
  const { user } = useGlobalContext();
  let memberList = form.members;

  const handlePress = (contact) => {
    console.log('isMember', isMember(contact));
    if (isMember(contact)) {
      memberList = memberList.filter((e) => e.memberPhone !== contact.phone);
      console.log('memberList filter', memberList);
    } else {
      if (user.phone != contact.phone) {
        memberList.push({
          membername: contact.name,
          memberPhone: contact.phone,
        });
      }
    }
    const updatedMember = [...memberList];
    console.log(updatedMember);
    setForm({ ...form, members: updatedMember });
  };

  const isMember = (contact) => {
    return memberList.find((e) => e.memberPhone === contact.phone);
  };

  const closeModal = () => setModalVisible(false)

  const renderContact = ({ item: contact }) => {
    return (
      <TouchableOpacity
        className={`flex-row w-full px-12 py-1`}
        onPress={() => handlePress(contact)}
      >
        <View
          className={`flex-row w-full h-14 px-3 justify-between items-center bg-primary border-2 rounded-lg  
          ${isMember(contact) ? 'border-secondary' : 'border-secondary'}`}
        >
          <View className="flex-row items-center justify-center">
            <Image
              source={contact.img === '' ? icons.profile : { uri: contact.img }}
              className="h-10 w-10 rounded-full mr-3"
              tintColor={contact.img === '' ? '#ff8e3c' : null}
            />
            <Text
              className={`text-xl ${
                isMember(contact) ? 'text-secondary' : 'text-gray-600'
              }`}
            >
              {contact.name}
            </Text>
          </View>
          {isMember(contact) ? (
            <Image
              source={icons.plus_2}
              className="h-5 w-5"
              tintColor="#ff8e3c"
            />
          ) : (
            <View className="border-2 border-stroke h-5 w-5 rounded-full" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
    >
      <View className="h-full w-full justify-end items-center">
        <View className="bg-secondary h-1/2 w-full justify-center items-center rounded-t-3xl">
          <TouchableOpacity onPress={closeModal}>
            <Text className="text-sm my-3 font-semibold text-primary">
              close
            </Text>
          </TouchableOpacity>
          <Text className="text-base mb-1 font-semibold text-primary">
              Your Contacts
            </Text>
          <FlatList data={user.contacts} renderItem={renderContact} />
        </View>
      </View>
    </Modal>
  );
};

export default AddFromContactModal;
