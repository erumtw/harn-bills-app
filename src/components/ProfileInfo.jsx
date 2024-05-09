import { View, Text } from 'react-native';
import React from 'react';

const ProfileInfo = ({ title, subtitle, otherStyles}) => {
  return (
    <View className={`items-center ${otherStyles}`}>
      <Text className="text-lg text-gray-300">{title}</Text>
      <Text className="text-xl text-white">{subtitle}</Text>
    </View>
  );
};

export default ProfileInfo;
