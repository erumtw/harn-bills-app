import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import icons from '../constants/icons';

const ContactCard = ({ contact }) => {
  return (
    <TouchableOpacity onPress={() => {}}>
      <View className="flex-row justify-start items-center mb-1 rounded-lg py-1 border-2 border-secondary ">
        <View className="w-12 h-12 ml-3 bg-black-200 rounded-full">
          <Image
            source={contact.img || icons.profile}
            className="w-full h-full"
            resizeMode="contain"
            tintColor={!contact.img ? '#ff8e3c' : ''}
          />
        </View>
        <View className="ml-3">
          <Text className="font-bold text-xl text-gray-700">
            {contact.name}
          </Text>
          <Text className="font-bold text-sm text-gray-500">
            {contact.phone}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ContactCard;
