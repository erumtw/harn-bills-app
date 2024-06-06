import {
  View,
  Text,
  Alert,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import MemberAddList from '../../components/MemberAddList';
import { useGlobalContext } from '../../contexts/GlobalContext';
import ManualAddForm from '../../components/ManualAddForm';
import AddFromContactModal from '../../components/AddFromContactModal';
import AddItemsField from '../../components/AddItemsField';
import ItemCreateCard from '../../components/ItemCreateCard';
import { postBill } from '../../firebase/services';

const Create = ({ navigation }) => {
  const { user } = useGlobalContext();
  const [itemVisible, setItemVisible] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [isModalContact, setModalContact] = useState(false);
  const [isManualAdd, setManualAdd] = useState(false);
  const [form, setForm] = useState({
    bill_name: '',
    members: [{ membername: user.username, memberPhone: user.phone }],
    member_name: '',
    member_phone: '',
    items: [],
    item_title: '',
    item_price: 0,
    item_divider: [],
  });

  // console.log(form);

  const clearForm = () =>
    setForm({
      bill_name: '',
      members: [{ membername: user.username, memberPhone: user.phone }],
      member_name: '',
      member_phone: '',
      items: [],
      item_title: '',
      item_price: 0,
      item_divider: [],
    });

  const onSubmit = async () => {
    if (form.bill_name === '' || form.items.length === 0) {
      Alert.alert(
        'Please fill all necessary form',
        "Bill name or items can't be empty",
      );
      return;
    }

    try {
      setLoading(true);

      const newBill = await postBill(form);

      console.log('Bill created successfully:', newBill);

      navigation.push('group', { bill: newBill });
    } catch (error) {
      console.log('Error creating bill:', error);
    } finally {
      clearForm();
      setLoading(false);
    }
  };

  const renderContent = () => {
    return (
      <View className="flex w-full p-5">
        <TouchableOpacity className="items-end" onPress={clearForm}>
          <Text className="text-paragraph text-sm ">reset</Text>
        </TouchableOpacity>
        <Text className="text-center text-headline text-3xl font-bold mt-3">
          Create Bill
        </Text>
        <View>
          <FormField
            title="Bill Name"
            handleChange={(e) => setForm({ ...form, bill_name: e })}
            placeholder="Enter Bill Name"
            value={form.bill_name}
          />
        </View>
        <Text className="text-lg text-headline font-semibold mb-2 mt-5">
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
                {/* <MultipleSelectList /> */}
              </View>
            </TouchableOpacity>
          </View>
          {isManualAdd && <ManualAddForm setForm={setForm} form={form} />}
          {isModalContact && (
            <AddFromContactModal
              setForm={setForm}
              form={form}
              modalVisible={isModalContact}
              setModalVisible={setModalContact}
            />
          )}
          {console.log('members:', form.members)}
        </View>
        {/* <View className="w-full h-[1px] bg-gray-700 my-2 rounded-lg " /> */}
        <Text className="text- text-center text-paragraph my-1 font-medium">
          Members
        </Text>
        <MemberAddList form={form} setForm={setForm} />
        {/* Add Items Sections */}
        <Text className="text-lg text-headline font-semibold mb-2 mt-5">
          Add Items
        </Text>
        <AddItemsField
          setForm={setForm}
          form={form}
          itemVisible={itemVisible}
          setItemVisible={setItemVisible}
        />
        {itemVisible && (
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
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="h-full">
      {isLoading ? (
        <View className="h-full">
          <ActivityIndicator
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            size="large"
          />
        </View>
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
