import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';

const CustomButton = ({
  handlePress,
  title,
  isSubmit,
  containerStyles,
  icon,
}) => {
  const [submitting, setSubmitting] = useState(isSubmit);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={submitting}
      className={`min-h-[55px] px-5 bg-secondary rounded-lg justify-center ${containerStyles} ${
        submitting ? 'opacity-50' : ''
      }`}
    >
      <View className="flex-row items-center justify-between w-full">
        <Text className="font-semibold text-lg text-primary ">{title}</Text>
        {icon && <Image source={icon} className="h-6 w-6" />}
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;
