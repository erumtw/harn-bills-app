import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, { useState } from 'react';
import FormField from './FormField.jsx';
import icons from '../constants/icons.js';
import { useGlobalContext } from '../contexts/GlobalContext.js';
import { launchImageLibrary } from 'react-native-image-picker';
import { updateProfile } from '../firebase/services.js';

const ModalEditProfile = ({
  isModalEditProfileVisible,
  setModalEditProfileVisible,
}) => {
  const { user, setUser } = useGlobalContext();
  const [profileForm, setProfileForm] = useState({
    image: user.image,
    phone: user.phone,
    username: user.username,
  });
  const [isLoading, setLoading] = useState(false);

  const isChange = () => {
    console.log('user: ', user);
    console.log('profileForm', profileForm);
    return (
      profileForm.image === user.image &&
      profileForm.username === user.username &&
      profileForm.phone === user.phone
    );
  };

  const closeModal = () => setModalEditProfileVisible(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      if (
        profileForm.username === '' ||
        profileForm.phone === '' ||
        profileForm.phone.replace(/\D/g, '').length !== 10
      ) {
        Alert.alert(
          'Invalid Form',
          'Fields cannot be empty or duplicated, and phone number must be 10 digits long',
        );
        return;
      }

      const updateUserData = await updateProfile(user, profileForm);
      console.log('updateUserData:', updateUserData);
      setUser(updateUserData);
      closeModal();
    } catch (error) {
      console.error('Error updating profile:', error.message);
    } finally {
      setLoading(false);
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
          setProfileForm({ ...profileForm, image: source.uri });
          // console.log(source);
        }
      });
      console.log(
        'isImageChange: ',
        profileForm.image === user.image,
        isChange(),
      );
    } catch (error) {
      console.error('ImagePicker Error:', error);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalEditProfileVisible}
      onRequestClose={closeModal}
    >
      <View className="h-full justify-center items-center ">
        <View className="h-full w-full justify-start items-center rounded-t-2xl  bg-primary py-3 px-10">
          {isLoading ? (
            <View className="h-full w-full items-center justify-start">
              <ActivityIndicator style={{ flex: 1 }} />
            </View>
          ) : (
            <>
              <View className="flex-row w-full justify-between ">
                <TouchableOpacity onPress={closeModal}>
                  <View className="rounded-lg py-1 px-3 mt-6 mb-2">
                    <Text className="text-lg font-bold text-stroke">
                      Cancle
                    </Text>
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

              <View className="w-full justify-start items-center mt-10">
                <TouchableOpacity
                  onPress={onImageEdit}
                  className="w-24 h-24 rounded-full"
                >
                  <Image
                    source={
                      profileForm.image === ''
                        ? icons.profile
                        : { uri: profileForm.image }
                    }
                    className="w-full h-full rounded-full"
                    resizeMode="cover"
                    tintColor={profileForm.image === '' ? '#ff8e3c' : null}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={onImageEdit}
                  className="items-center justify-center"
                >
                  <Text className="mb-8 mt-2 text-sm text-stroke">
                    Edit Image
                  </Text>
                </TouchableOpacity>

                <View className="w-full">
                  <FormField
                    editable={false}
                    title={`username`}
                    value={profileForm.username}
                    otherStyles={`mb-5`}
                  />
                  <FormField
                    editable={false}
                    title={`phone-number`}
                    value={profileForm.phone}
                  />
                </View>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default ModalEditProfile;
