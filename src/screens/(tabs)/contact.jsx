import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useGlobalContext } from '../../contexts/GlobalContext';
import ContactCard from '../../components/ContactCard';
import icons from '../../constants/icons';
import ModalAddContacts from '../../components/ModalAddContacts';
import CustomButton from '../../components/CustomButton';
import { getUserData } from '../../firebase/services';

const Contact = ({ navigation }) => {
  const { user, setUser } = useGlobalContext();
  const [contactData, setContactData] = useState(user.contacts);
  const [modalAddContact, setModalAddContact] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);

      // const user.id = await getUserId(user.phone);
      const userData = await getUserData(user.id);
      console.log("refreshing:", userData);
      setUser(userData);
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const Header = () => {
    return (
      <>
        <View className="h-[100px] mb-12">
          <Text className="text-gray-700 text-3xl font-bold">Contacts</Text>
          <View className="mt-2">
            <CustomButton
              title="Add New Contact"
              containerStyles="w-full mt-5 items-start h-[55px]"
              icon={icons.add_user}
              handlePress={() => setModalAddContact(!modalAddContact)}
              itemsStyles="justify-between"
            />
          </View>
        </View>
        <Text className="text-base text-gray-700 mb-2">Your contacts list</Text>
      </>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      {isLoading ? (
        <ActivityIndicator style={{ flex: 1 }} />
      ) : (
        <>
          <View className="flex-1 px-5 bg-primary">
            <FlatList
              data={contactData}
              ListHeaderComponent={Header}
              renderItem={({ item: contact }) => (
                <ContactCard contact={contact} />
              )}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          </View>
          {/* <TouchableOpacity
        className="absolute bottom-5 right-4 shadow-xl"
        onPress={() => setModalAddContact(!modalAddContact)}
      >
        <View>
          <Image
            source={icons.add_user}
            className=" w-11 h-11 "
            tintColor={`#ff8e3c`}
          />
        </View>
      </TouchableOpacity> */}

          {modalAddContact && (
            <ModalAddContacts
              modalAddContact={modalAddContact}
              setModalAddContact={setModalAddContact}
              setContactData={setContactData}
            />
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default Contact;
