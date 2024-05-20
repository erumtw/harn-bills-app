import { View, Text } from 'react-native';
import React from 'react';

const ProfileInfo = ({ title, subtitle, otherStyles}) => {
  return (
    <View className={`items-center ${otherStyles}`}>
      <Text className="text-lg text-headline font-semibold">{title}</Text>
      <Text className="text-xl text-highlight font-medium">{subtitle}</Text>
    </View>
  );
};

export default ProfileInfo;
