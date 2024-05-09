import {
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  FlatList,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import icons from '../../constants/icons';
import AddMember from '../../components/AddMember';
import { useGlobalContext } from '../../contexts/GlobalContext';
import AddDivider from '../../components/AddDivider';
import ItemCard from '../../components/ItemCard';

const Create = ({ navigation }) => {
  const { user } = useGlobalContext();

  const [form, setForm] = useState({
    group_name: '',
    members: [user.username],
    member_name: '',
    items: [],
    item_title: '',
    item_price: 0,
    item_divider: [],
  });

  console.log(form);

  const addItem = () => {
    if (
      form.item_divider.length === 0 ||
      form.item_price === 0 ||
      form.item_title === ''
    ) {
      Alert.alert('Please Enter All item form!');
    }

    const newItem = {
      title: form.item_title,
      price: form.item_price,
      divider: form.item_divider,
    };

    let updated_items = form.items;
    updated_items.push(newItem);

    // console.log('updatedItem', updated_items);
    setForm({ ...form, items: updated_items });
    // console.log('items: ', form.items);
  };

  const renderContent = () => {
    return (
      <View className="flex w-full p-5">
        <Text className="text-center text-secondary-100 text-3xl font-bold mt-5">Create Bill</Text>

        <View>
          <FormField
            title="Bill Name"
            handleChange={(e) => setForm({ ...form, group_name: e })}
            placeholder="Enter Bill Name"
            value={form.group_name}
          />
        </View>

        <Text className="text-base text-gray-200 font-normal mb-2 mt-5">
          Add Members
        </Text>
        <View className="border-2 border-black-100 rounded-lg p-2">
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
                  setForm({
                    ...form,
                    members: [...form.members, form.member_name],
                  });
                }
              }}
            />
            {console.log(form.members)}
          </View>
          <AddMember form={form} setForm={setForm} />
        </View>

        <Text className="mt-5 text-base text-gray-200 font-normal mb-2">
          Add Items
        </Text>
        <View className="border-2 border-black-100 rounded-lg p-2">
          <View className="flex-row mb-2">
            <View className="flex-[60%] flex-row mr-1 px-3 h-[50px] border-2 border-black-100 rounded-lg items-center focus:border-secondary-100">
              <TextInput
                className="flex-1 text-white text-base"
                value={form.item_title}
                onChangeText={(e) => setForm({ ...form, item_title: e })}
                placeholder="Enter Item Name"
                placeholderTextColor="#7b7b8b"
              />
            </View>
            <View className="flex-1 flex-row px-3 h-[50px] border-2 border-black-100 rounded-lg items-center focus:border-secondary-100">
              <TextInput
                className="flex-1 text-white text-base"
                value={form.item_price}
                onChangeText={(e) => setForm({ ...form, item_price: e })}
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
        </View>

        {/* <FlatList
          data={form.items}
          renderItem={({ item }) => <ItemCard item={item} />}
          className="mt-2"
        /> */}
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full">
      <ScrollView>{renderContent()}</ScrollView>
    </SafeAreaView>
  );
};

export default Create;
