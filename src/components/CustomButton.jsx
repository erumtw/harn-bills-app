import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';

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

        {icon ? <Image source={icon} className="h-7 w-7" tintColor="#111827"/> : <></>}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
