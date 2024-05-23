import {
  View,
  Text,
  TextInput,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import icons from '../../constants/icons';
import MemberAddList from '../../components/MemberAddList';
import { useGlobalContext } from '../../contexts/GlobalContext';
import AddDivider from '../../components/AddDivider';
import ItemCard from '../../components/ItemCard';
import { post_bill } from '../../api/constant/services';
import ManualAddForm from '../../components/ManualAddForm';
import AddFromContactModal from '../../components/AddFromContactModal';
import AddItemsField from '../../components/AddItemsField';
import ItemCreateCard from '../../components/ItemCreateCard';

const Create = ({ navigation }) => {
  const { user } = useGlobalContext();
  const [itemVisible, setItemVisible] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isModalContact, setModalContact] = useState(false);
  const [isManualAdd, setManualAdd] = useState(false);

  const [form, setForm] = useState({
    group_name: '',
    members: [user.username],
    member_name: '',
    member_phone: '',
    items: [],
    item_title: '',
    item_price: 0,
    item_divider: [],
  });

  // console.log(form);

  // const addItem = () => {
  //   if (
  //     form.item_divider.length === 0 ||
  //     form.item_price === '' ||
  //     form.item_title === '' ||
  //     form.item_price === 0 ||
  //     isNaN(form.item_price)
  //   ) {
  //     return Alert.alert(
  //       'Invalid Input!',
  //       'item name, divider, price can not be empty, or price can not be 0 and must be number',
  //     );
  //   }

  //   const newItem = {
  //     title: form.item_title,
  //     price: parseFloat(form.item_price).toFixed(1),
  //     divider: form.item_divider,
  //   };

  //   let updated_items = form.items;
  //   updated_items.push(newItem);

  //   // console.log('updatedItem', updated_items);
  //   try {
  //     setForm({ ...form, items: updated_items });
  //   } catch (error) {
  //   } finally {
  //     setForm({ ...form, item_title: '', item_price: '', item_divider: [] });
  //   }
  //   // console.log('items: ', form.items);
  // };

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
        member_phone: '',
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
        <TouchableOpacity
          className="items-end"
          onPress={() => {
            setForm({
              group_name: '',
              members: [user.username],
              member_name: '',
              member_phone: '',
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
        <View className="flex-1 border-2 border-stroke rounded-lg p-2">
          <View className="flex-row w-full justify-center mb-2">
            <TouchableOpacity
              onPress={() => setManualAdd(!isManualAdd)}
              className="w-1/2"
            >
              <View className=" bg-secondary py-2 px-3 justify-center items-center rounded-lg mr-2">
                <Text className="text-paragraph font-semibold">
                  Add By Manual
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalContact(!isModalContact)}
              className="w-1/2"
            >
              <View className="bg-secondary py-2 px-3 justify-center items-center rounded-lg">
                <Text className="text-paragraph font-semibold">
                  Add From Contacts
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <>{isManualAdd && <ManualAddForm setForm={setForm} form={form} />}</>
          {isModalContact && (
            <AddFromContactModal
              setForm={setForm}
              form={form}
              modalVisible={isModalContact}
              setModalVisible={setModalContact}
            />
          )}
          <View className="w-full h-[1px] bg-gray-700 my-2 rounded-lg " />
          <Text className="text-sm text-center text-paragraph mb-1 ">
            members
          </Text>
          <MemberAddList form={form} setForm={setForm} />
          {console.log('members:', form.members)}
        </View>
        <Text className="text-base text-headline font-semibold mb-2 mt-5">
          Add Items
        </Text>
        {/* <View className="border-2 border-stroke rounded-lg p-2">
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
        </View> */}
        <AddItemsField
          setForm={setForm}
          form={form}
          itemVisible={itemVisible}
          setItemVisible={setItemVisible}
        />
        <View className="w-full h-[1px] bg-gray-700 my-2 rounded-lg" />
        {itemVisible ? (
          <FlatList
            data={form.items}
            renderItem={({ item }) => (
              <ItemCreateCard item={item} setForm={setForm} form={form} />
            )}
            ListEmptyComponent={() => (
              <Text className="text-paragraph text-center">
                add some items!
              </Text>
            )}
            className="mt-2"
          />
        ) : (
          <></>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full">
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={[1]}
          renderItem={renderContent}
          ListFooterComponent={() => (
            <View className="w-full px-5 justify-end mb-2">
              <CustomButton
                title="Submit"
                itemsStyles="justify-center"
                containerStyles="h-[45px]"
                handlePress={onSubmit}
              />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
};

export default Create;
