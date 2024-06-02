import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import icons from '../constants/icons';
import ModalEditContactInfo from './ModalEditContactInfo.jsx';

const ContactCard = ({ contact, setContactData }) => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <View className="flex-row justify-start items-center mb-1 rounded-lg py-2 border-2 border-secondary ">
          <View className="w-14 h-14 ml-3 bg-black-200 rounded-full border-2 border-secondary">
            <Image
              source={contact.img !== '' ? { uri: contact.img } : icons.profile}
              className="w-full h-full rounded-full"
              resizeMode="cover"
              tintColor={contact.img !== '' ? '' : '#ff8e3c'}
            />
          </View>
          <View className="ml-3 items-start justify-between">
            <Text className="font-bold text-xl text-secondary">
              {contact.name}
            </Text>
            <Text className="font-semibold text-sm text-stroke">
              {contact.phone.slice(0, 3)}-{contact.phone.slice(3)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      {isModalVisible && (
        <ModalEditContactInfo
          contact={contact}
          isModalVisible={isModalVisible}
          setModalVisible={setModalVisible}
          setContactData={setContactData}
        />
      )}
    </>
  );
};

export default ContactCard;
