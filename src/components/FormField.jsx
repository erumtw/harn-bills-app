import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

const FormField = ({
  title,
  value,
  placeholder,
  handleChange,
  otherStyles,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  // console.log(showPassword);
  // console.log(value);
  return (
    <View className={`${otherStyles}`}>
      {title ? (
        <Text className="text-base text-gray-200 font-normal mb-2">
          {title}
        </Text>
      ) : (
        <></>
      )}

      <View className="flex-row px-5 h-[50px] w-full border-2 border-black-100 rounded-lg items-center focus:border-secondary-100">
        <TextInput
          className="flex-1 text-white text-base"
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          secureTextEntry={title === 'password' && !showPassword}
        />
        {title === 'password' ? (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            {/* <Entypo
              name={showPassword ? "eye-with-line" : "eye"}
              size={20}
              color="white"
            /> */}
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </View>
  );
};

export default FormField;
