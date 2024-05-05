import { View, Text, Pressable } from 'react-native';
import React from 'react';
import { Link, useNavigation } from '@react-navigation/native';

const BillCard = ({ bill }) => {
  const navigation = useNavigation();
  // console.log(bill.id);
  return (
    <Pressable
      onPress={() => {
        navigation.navigate('group', { bill: bill });
      }}
      className="flex-row justify-between items-center w-full p-3 border-2 border-secondary mb-3 rounded-lg"
    >
      <Text className="text-lg font-semibold text-secondary-200">
        {bill.group_name}
      </Text>
      <View>
        <Text className="text-sm font-semibold text-secondary-200">
          total price
        </Text>
        <Text className="text-sm font-semibold text-secondary-200">
          your split price
        </Text>
      </View>
    </Pressable>
  );
};

export default BillCard;
