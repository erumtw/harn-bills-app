import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import FormField from './FormField';
import CustomButton from './CustomButton';
import AddMember from './AddMember';
import AddDivider from './AddDivider';
import icons from '../constants/icons';

const CreateForm = ({ form, setForm }) => {
  return (
    <View className="flex w-full p-5">
      <TouchableOpacity
        className="items-end"
        onPress={() => {
          setForm({
            group_name: '',
            members: [user.username],
            member_name: '',
            items: [],
            item_title: '',
            item_price: '',
            item_divider: [],
          });
        }}
      >
        <Text className="text-paragraph text-sm ">reset</Text>
      </TouchableOpacity>
      <Text className="text-center text-headline text-3xl font-bold mt-3">
        Create Bill
      </Text>
      <View>
        <FormField
          title="Bill Name"
          handleChange={(e) => setForm({ ...form, group_name: e })}
          placeholder="Enter Bill Name"
          value={form.group_name}
        />
      </View>
      <Text className="text-base text-headline font-semibold mb-2 mt-5">
        Add Members
      </Text>
      <View className="border-2 border-stroke rounded-lg p-2">
        <View className="flex-row w-full items-center mb-2">
          <FormField
            otherStyles="flex-1"
            placeholder="Enter Member Name"
            value={form.member_name}
            handleChange={(e) => setForm({ ...form, member_name: e })}
          />
          <CustomButton
            containerStyles="h-[49px] ml-1"
            icon={icons.plus_2}
            handlePress={() => {
              if (
                !form.members.find((member) => member === form.member_name) &&
                form.member_name !== ''
              ) {
                try {
                  const updated_member = form.members;
                  updated_member.push(form.member_name);

                  setForm({
                    ...form,
                    members: updated_member,
                  });
                } catch (error) {
                  console.log(error);
                } finally {
                  setForm({ ...form, member_name: '' });
                }
              }
            }}
          />
          {console.log(form.members)}
        </View>

        <AddMember form={form} setForm={setForm} />
      </View>
      <Text className="text-base text-headline font-semibold mb-2 mt-5">
        Add Items
      </Text>
      <View className="border-2 border-stroke rounded-lg p-2">
        <View className="flex-row mb-2">
          <View className="flex-[60%] flex-row mr-1 px-3 h-[50px] border-2 border-stroke rounded-lg items-center focus:border-secondary-100">
            <TextInput
              className="flex-1 text-paragraph text-sm font-medium"
              value={form.item_title}
              onChangeText={(e) => setForm({ ...form, item_title: e })}
              placeholder="Enter Item Name"
              placeholderTextColor="#7b7b8b"
            />
          </View>
          <View className="flex-1 flex-row px-3 h-[50px] border-2 border-stroke rounded-lg items-center focus:border-secondary-100">
            <TextInput
              className="flex-1 text-paragraph text-sm font-medium"
              value={form.item_price}
              onChangeText={(e) => {
                setForm({ ...form, item_price: parseFloat(e) });
              }}
              placeholder="Price"
              placeholderTextColor="#7b7b8b"
            />
          </View>
        </View>

        <AddDivider form={form} setForm={setForm} />

        <CustomButton
          title="Add Item"
          handlePress={addItem}
          containerStyles="h-[40px]"
          itemsStyles="justify-center"
        />
        {console.log('items ', form.items)}
        <TouchableOpacity
          className="items-center  justify-center mt-2"
          onPress={() => setItemVisible(!itemVisible)}
        >
          <Text className="text-paragraph font-semibold">
            {!itemVisible ? 'show items' : 'hide items'}
          </Text>
        </TouchableOpacity>
      </View>
      <View className="w-full h-[1px] bg-gray-700 my-2 rounded-lg" />
      {itemVisible ? (
        <FlatList
          data={form.items}
          renderItem={({ item }) => <ItemCard item={item} />}
          ListEmptyComponent={() => (
            <Text className="text-paragraph text-center">add some items!</Text>
          )}
          className="mt-2"
        />
      ) : (
        <></>
      )}
    </View>
  );
};

export default CreateForm;
