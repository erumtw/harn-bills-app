import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';
import icons from '../constants/icons';

const AddDivider = ({ form, setForm }) => {
  const { user } = useGlobalContext();
  // console.log('yo!', form.members);
  console.log('divider: ', form.item_divider);

  let divider_list = form.item_divider;
  // console.log('divider_list: ', divider_list);

  const haldlePress = (member) => {
    if (divider_list.find((e) => e == member)) {
      // delete member
      divider_list = divider_list.filter((e) => e !== member);
    } else {
      divider_list.push(member);
    }

    setForm({ ...form, item_divider: divider_list });
  };

  const addAllDivider = () => {
    divider_list = form.members;
    setForm({ ...form, item_divider: divider_list });
  };

  return (
    <FlatList
      horizontal
      data={form.members}
      ListHeaderComponent={() => (
        <TouchableOpacity
          onPress={addAllDivider}
          className="px-3 py-1 mb-2 border-2 border-gray-700 rounded-lg justify-center items-center mr-2 "
        >
          <Text className="font-sm text-base text-secondary">ALL</Text>
        </TouchableOpacity>
      )}
      renderItem={({item}) => (
        <TouchableOpacity
          onPress={() => haldlePress(item)}
          className={`px-2 py-1 mb-2 border-2 rounded-lg  mr-2 ${
            form.item_divider.find((i) => i === item)
              ? 'border-secondary'
              : 'border-gray-700'
          }`}
        >
          <View className="flex-row justify-center items-center">
            <Text
              className={`font-sm text-base mr-2 ${
                form.item_divider.find((i) => i === item)
                  ? 'text-secondary'
                  : 'text-gray-700'
              }`}
            >
              {item === user.username
                ? 'You'
                : `${item[0].toUpperCase()}${item.slice(1)}`}
            </Text>
            <Image
              source={icons.plus}
              className="w-4 h-4"
              tintColor={`${
                form.item_divider.find((i) => i === item)
                  ? '#FF9C01'
                  : '#6b7280'
              }`}
            />
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default AddDivider;
