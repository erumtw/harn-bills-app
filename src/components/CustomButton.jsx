import {View, Text, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';

const CustomButton = ({
  handlePress,
  title,
  isSubmit,
  containerStyles,
}) => {
  const [submitting, setSubmitting] = useState(isSubmit);

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={submitting}
      className={`min-h-[62px]  bg-secondary rounded-lg justify-center items-center ${containerStyles} ${
        submitting ? 'opacity-50' : ''
      }`}>
      <Text className="font-psemibold text-lg">{title}</Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
