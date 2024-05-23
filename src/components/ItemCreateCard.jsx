import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';
import icons from '../constants/icons';

const ItemCreateCard = ({ item, setForm, form }) => {
  const { user } = useGlobalContext();
  const divided_price = (item.price / item.divider.length).toFixed(1);

  const handleDelete = () => {
    const updatedItems = form.items.filter((i) => i !== item);
    setForm({ ...form, items: updatedItems });
  };

  return (
    <View className="mx-2 py-2 px-3 border-2 border-gray-700 rounded-lg justify-between items-start mb-2">
      <View className="w-full flex-row justify-between items-center mb-1">
        <Text className="text-lg font-semibold text-secondary">
          {item.title[0].toUpperCase()}
          {item.title.slice(1)}
          <Text className="text-gray-500 text-sm">
            {' '}
            ${item.price}/{item.divider.length}
          </Text>
        </Text>
        <Text className="text-secondary text-lg font-bold">
          ${divided_price}/person
        </Text>
      </View>
      <FlatList
        horizontal
        data={item.divider}
        ListFooterComponent={() => (
          <TouchableOpacity
            onPress={() => {
              handleDelete(item);
            }}
            className="flex-1 ml-1 items-center justify-center"
          >
            <Image
              source={icons.trash_bin}
              className="w-4 h-4"
              tintColor="gray"
            />
          </TouchableOpacity>
        )}
        renderItem={({ item }) => (
          <View
            className={`px-3 py-1 border-2  ${
              item === user.username ? 'border-secondary' : 'border-gray-700'
            } rounded-lg justify-center items-center mr-2`}
          >
            <Text className="font-medium text-sm text-gray-700">
              {item === user.username ? 'You' : item}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

export default ItemCreateCard;
