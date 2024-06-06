import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, { useState } from 'react';
import FormField from './FormField.jsx';
import icons from '../constants/icons.js';
import { useGlobalContext } from '../contexts/GlobalContext.js';
import {
  deleteContact,
  postContactData,
} from '../firebase/services.js';
import { launchImageLibrary } from 'react-native-image-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

export const ModalEditContactInfo = ({
  contact,
  isModalVisible,
  setModalVisible,
  setContactData,
}) => {
  const { user, setUser } = useGlobalContext();
  const [contactForm, setContactForm] = useState({
    img: contact.img,
    name: contact.name,
    phone: contact.phone,
  });
  console.log('contact: ', contact);
  console.log('contactForm', contactForm);

  const isChange = () => {
    return (
      contactForm.name === contact.name &&
      contactForm.phone === contact.phone &&
      contactForm.img === contact.img
    );
  };

  const closeModal = () => setModalVisible(false);

  const onSubmit = async () => {
    try {
      if (
        contactForm.name === '' ||
        contactForm.phone === '' ||
        contactForm.phone.replace(/\D/g, '').length !== 10 ||
        contactForm.phone === user.phone ||
        user.contacts.some(
          (c) =>
            c.phone === contactForm.phone &&
            c.name !== contactForm.name &&
            c.name !== contact.name,
        )
      ) {
        Alert.alert(
          'Invalid Form',
          'field can not be empty or duplicated, and phone-number must be digit of 10 length',
        );
        return;
      }

      const updateUserData = await postContactData(user, contactForm, contact);
      // console.log('updateUserData:', updateUserData);
      setUser(updateUserData);
      setContactData(updateUserData.contacts);
      closeModal();
    } catch (error) {
      console.log(error.message);
    }
  };

  const onImageEdit = async () => {
    try {
      const options = {
        title: 'Select Image',
        mediaType: 'photo',
        storageOptions: {
          skipBackup: true, // do not backup to iCloud
          path: 'images', // store camera images under Pictures/images for android and Documents/images for iOS
        },
      };

      await launchImageLibrary(options, (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else if (response.customButton) {
          console.log('User tapped custom button: ', response.customButton);
        } else {
          const source = response.assets[0];
          setContactForm({ ...contactForm, img: source.uri });
          console.log(source);
        }
      });
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  const onDelete = async () => {
    try {
      Alert.alert(
        'Delete Contact',
        'Are you sure you want to delete this contact?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            onPress: async () => {
              const updatedUserInfo = await deleteContact(user, contact);
              setUser(updatedUserInfo);
              setContactData(updatedUserInfo.contacts);
              closeModal();
            },
            style: 'destructive',
          },
        ],
        { cancelable: false },
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalVisible}
      onRequestClose={closeModal}
    >
      <View className="h-full justify-end items-center">
        <View className="h-full w-full justify-center items-center rounded-t-2xl  bg-primary py-14 px-10">
          <View className="flex-row w-full justify-between ">
            <TouchableOpacity onPress={closeModal}>
              <View className="rounded-lg py-1 px-3 mt-6 mb-2">
                <Text className="text-lg font-bold text-stroke">Cancle</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSubmit} disabled={isChange()}>
              <View
                className={`rounded-lg py-1 px-3 mt-6 mb-2 bg-secondary ${
                  isChange() && 'opacity-80'
                }`}
              >
                <Text className="text-lg font-bold text-primary">Done</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View className="h-full w-full justify-start items-center">
            <TouchableOpacity
              onPress={onImageEdit}
              className="mt-10 mb-2 items-center justify-center rounded-full"
            >
              <View className="w-24 h-24 ">
                <Image
                  source={
                    contactForm.img ? { uri: contactForm.img } : icons.profile
                  }
                  className="h-full w-full rounded-full"
                  tintColor={contactForm.img === '' ? '#ff8e3c' : null}
                  resizeMode="cover"
                />
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onImageEdit}
              className="items-center justify-center"
            >
              <Text className="mb-8 text-sm text-stroke">
                Edit Image
              </Text>
            </TouchableOpacity>
            <FormField
            title="Contact Name"
              handleChange={(e) => setContactForm({ ...contactForm, name: e })}
              placeholder="Enter Contact Name"
              value={contactForm.name}
              otherStyles={`mb-5`}
            />
            <FormField
              title="Contact Phone-number"
              handleChange={(e) => setContactForm({ ...contactForm, phone: e })}
              placeholder="Enter Contact Phone-number"
              value={contactForm.phone}
            />
          </View>
          <TouchableOpacity onPress={onDelete} className="items-center content-end justify-center mb-3" >
            <MaterialCommunityIcons name="account-minus" color="#dc2626" size={20}/>
            <Text className="text-sm text-red-600">Delete Contact</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ModalEditContactInfo;
