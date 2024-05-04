import { View, Text } from 'react-native';
import React from 'react';

const Group = ({ route }) => {
  const { billId } = route.params;
  return (
    <View>
      <Text>{billId}</Text>
    </View>
  );
};

export default Group;
