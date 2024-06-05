import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const CustomButton = ({
  handlePress,
  title,
  isSubmit,
  containerStyles,
  itemsStyles,
  icon,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={isSubmit}
      className={`px-5 bg-highlight rounded-lg  justify-center ${containerStyles} ${
        isSubmit ? 'opacity-50' : ''
      }`}
    >
      <View className={`flex-row items-center w-full ${itemsStyles}`}>
        {title ? (
          <Text className="font-semibold text-lg text-gray-900">{title}</Text>
        ) : (
          <></>
        )}

        {icon ? <MaterialCommunityIcons name={icon} color="#111827" size={30}/> : <></>}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
