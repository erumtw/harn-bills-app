import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useGlobalContext } from '../contexts/GlobalContext';
import icons from '../constants/icons';

const AddMember = ({ form, setForm }) => {
  const { user } = useGlobalContext();
  console.log(user);
  console.log(form.members);

  const handleDelete = (item) => {
    const updatedMembers = form.members.filter((member) => member !== item);

    const updated_divider_list = form.item_divider.filter((e) => e !== item);

    setForm({
      ...form,
      members: updatedMembers,
      item_divider: updated_divider_list,
    });
  };

  return (
    <FlatList
      horizontal
      data={form.members}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <View className="px-3 py-1 mb-2 border-2 border-gray-700 rounded-lg justify-center items-center mr-2 flex-row">
          {/* {console.log("item", item)} */}
          <Text className="font-sm text-base text-secondary">
            {item === user.username
              ? 'You'
              : `${item[0].toUpperCase()}${item.slice(1)}`}
          </Text>
          {item !== user.username ? (
            <TouchableOpacity
              onPress={() => {
                handleDelete(item);
              }}
              className="ml-1 items-center justify-center"
            >
              <Image
                source={icons.trash_bin}
                className="w-4 h-4"
                tintColor="gray"
              />
            </TouchableOpacity>
          ) : (
            <></>
          )}
        </View>
      )}
    />
  );
};

export default AddMember;