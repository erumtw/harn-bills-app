import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { TextInput } from 'react-native';

const FormField = ({
  title,
  value,
  placeholder,
  handleChange,
  otherStyles,
  editable,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  // console.log(showPassword);
  // console.log(value);
  return (
    <View className={`${otherStyles}`}>
      {title ? (
        <Text className="text-lg text-headline font-semibold mb-2">
          {title}
        </Text>
      ) : (
        <></>
      )}

      <View className="flex-row px-5 h-[50px] w-full border-2 border-stroke rounded-lg items-center focus:border-highlight bg-primary">
        <TextInput
          className={`flex-1 text-paragraph text-sm font-medium ${
            editable === false ? 'opacity-40' : 'opacity-100'
          } `}
          value={value}
          onChangeText={handleChange}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          secureTextEntry={title === 'password' && !showPassword}
          editable={editable}
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
