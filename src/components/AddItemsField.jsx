import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import AddDivider from './AddDivider';
import CustomButton from './CustomButton';

const AddItemsField = ({ form, setForm, setItemVisible, itemVisible }) => {
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


  return (
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
  );
};

export default AddItemsField;
