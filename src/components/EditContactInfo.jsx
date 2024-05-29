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
import icons from '../constants/icons';
import { useGlobalContext } from '../contexts/GlobalContext.js';
import {
  deleteContact,
  postContactData,
  uploadImage,
} from '../firebase/services.js';
import { launchImageLibrary } from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

export const EditContactInfo = ({
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
      <View className="flex-1 justify-end items-center ">
        <View className="h-full w-full justify-start items-center rounded-t-2xl  bg-primary p-10">
          <TouchableOpacity onPress={onDelete}>
            <Text className="text-sm text-red-600">Delete Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onImageEdit}
            className="mt-5 mb-2 items-center justify-center rounded-full"
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
            <Text className="mb-5 text-sm text-stroke underline">
              Edit Image
            </Text>
          </TouchableOpacity>
          <FormField
            title="Contact Name"
            handleChange={(e) => setContactForm({ ...contactForm, name: e })}
            placeholder="Enter Contact Name"
            value={contactForm.name}
            otherStyles={`mb-2`}
          />
          <FormField
            title="Contact Phone-number"
            handleChange={(e) => setContactForm({ ...contactForm, phone: e })}
            placeholder="Enter Contact Phone-number"
            value={contactForm.phone}
          />
          <View className="flex-row gap-x-6">
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
        </View>
      </View>
    </Modal>
  );
};

export default EditContactInfo;
