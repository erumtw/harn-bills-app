import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  Pressable,
  ActivityIndicator,
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
import { post_bill } from '../../api/constant/services';

const Create = ({ navigation }) => {
  const { user } = useGlobalContext();
  const [itemVisible, setItemVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);

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
      form.item_price === '' ||
      form.item_title === '' ||
      form.item_price === 0 || 
      isNaN(form.item_price)
    ) {
      return Alert.alert(
        'Invalid Input!',
        'item name, divider, price can not be empty, or price can not be 0 and must be number',
      );
    }

    const newItem = {
      title: form.item_title,
      price: parseFloat(form.item_price).toFixed(1),
      divider: form.item_divider,
    };

    let updated_items = form.items;
    updated_items.push(newItem);

    // console.log('updatedItem', updated_items);
    try {
      setForm({ ...form, items: updated_items });
    } catch (error) {
    } finally {
      setForm({ ...form, item_title: '', item_price: '', item_divider: [] });
    }
    // console.log('items: ', form.items);
  };

  const onSubmit = async () => {
    try {
      if (form.group_name === '' || form.items.length === 0) {
        return Alert.alert(
          'Please fill all nessesary form',
          "bill name or items can't be empty",
        );
      }

      setLoading(true);
      const newBill = await post_bill({
        is_all_paid: false,
        group_name: form.group_name,
        items: form.items,
        members: form.members,
      });

      console.log(newBill);

      navigation.navigate('group', { bill: newBill });
    } catch (error) {
      console.log(error);
    } finally {
      setForm({
        group_name: '',
        members: [user.username],
        member_name: '',
        items: [],
        item_title: '',
        item_price: 0,
        item_divider: [],
      });

      setLoading(false);
    }
  };

  const renderContent = () => {
    return (
      <View className="flex w-full p-5">
        <Pressable
          className="items-end"
          onPress={() => {
            setForm({
              group_name: '',
              members: [user.username],
              member_name: '',
              items: [],
              item_title: '',
              item_price: 0,
              item_divider: [],
            });
          }}
        >
          <Text className="text-gray-300 text-sm">reset</Text>
        </Pressable>
        <Text className="text-center text-secondary-100 text-3xl font-bold mt-3">
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
        </View>
        <Pressable
          className="items-center  justify-center mt-2"
          onPress={() => setItemVisible(!itemVisible)}
        >
          <Text className="text-gray-500">
            {!itemVisible ? 'show items' : 'hide items'}
          </Text>
        </Pressable>
        {itemVisible ? (
          <FlatList
            data={form.items}
            renderItem={({ item }) => <ItemCard item={item} />}
            className="mt-2"
          />
        ) : (
          <></>
        )}
        <View className="w-full h-0.5 bg-black-200 my-5 rounded-lg" />
        <CustomButton
          title="Submit"
          itemsStyles="justify-center"
          containerStyles="h-[45px]"
          handlePress={onSubmit}
        />
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList data={[1]} renderItem={renderContent} />
      )}
    </SafeAreaView>
  );
};

export default Create;
