import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  ScrollView,
} from 'react-native';
import React, { useRef } from 'react';
import ViewShot, { captureRef } from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Logo } from './Logo';
import { useGlobalContext } from '../contexts/GlobalContext';

const BillReceipt = ({
  bill,
  items,
  members,
  isModalExportVisible,
  setModalExportVisible,
}) => {
  const viewRef = useRef(null);
  const closeModal = () => setModalExportVisible(false);
  const { user } = useGlobalContext();
  const getPermissionAndroid = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Image Download Permission',
          message: 'Your permission is required to save images to your device',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      }
      Alert.alert(
        '',
        'Your permission is required to save images to your device',
        [{ text: 'OK', onPress: () => {} }],
        { cancelable: false },
      );
      return false;
    } catch (err) {
      console.log('Error requesting permission:', err);
      return false;
    }
  };

  const downloadImage = async () => {
    try {
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });

      const image = await CameraRoll.saveAsset(uri, { type: 'photo' });
      if (image) {
        Alert.alert(
          '',
          'Image saved successfully.',
          [{ text: 'OK', onPress: () => {} }],
          { cancelable: false },
        );
      }
    } catch (error) {
      console.log('Error saving image:', error);
    }
  };

  const getDividedPrice = (member) => {
    let dividedPrice = 0;
    items.forEach((item) => {
      if (
        item.divider.find((dividerPhone) => dividerPhone === member.memberPhone)
      ) {
        const temp = item.price / item.divider.length;
        dividedPrice += temp;
      }
    });
    return parseFloat(dividedPrice).toFixed(1);
  };

  const getTotalPrice = () => {
    let totalPrice = 0;
    items.forEach((item) => {
      totalPrice += item.price;
    });
    return parseFloat(totalPrice).toFixed(1);
  };

  const renderItems = () => {
    return items.map((item) => (
      <View key={item.id}>
        <View className="flex-row w-full justify-between items-end pl-4 pr-1">
          <Text className="text-base text-headline font-normal">
            {item.title}{' '}
          </Text>
          <Text className="text-base text-headline font-normal">
            ${parseFloat(item.price / item.divider.length).toFixed(1)}
          </Text>
        </View>
        <View className="flex-row w-full justify-end items-end pl-4 pr-1 mb-2">
          <Text className="text-base text-headline ml-5">
            ${item.price} / {item.divider.length}
          </Text>
        </View>
      </View>
    ));
  };

  const header = () => {
    return (
      <View className="items-center w-full">
        <Logo blackwhite={true} />
        <View className="w-full border-y-2 border-dotted border-headline" />
        <Text className="text-xl text-headline font-semibold  my-1">
          RECEIPT
        </Text>
        <View className="border-y-2 border-dotted w-full border-headline " />

        <View className="flex-row w-full justify-between items-center mt-2 mb-1 px-1">
          <Text className="text-lg text-headline font-semibold">
            {bill.bill_name}
          </Text>
          <Text className="text-lg text-headline font-semibold">
            {bill.date_Create}
          </Text>
        </View>
        <View className="flex-row w-full justify-between items-center mt-1 mb-2 px-1">
          <Text className="text-base text-headline ">
            From: {user.username}
          </Text>
          <Text className="text-base text-headline ">
            To: {members.length === 1 ? members[0].membername : 'everyone'}
          </Text>
        </View>
        <View className="border-t-2 border-dotted w-full border-headline border-spacing-6 mb-3" />
      </View>
    );
  };

  const renderMembers = () => {
    return members.map((member) => {
      const dividedPrice = getDividedPrice(member);
      return (
        <View
          key={member.memberPhone}
          className="flex-row w-full justify-between items-center pr-1"
        >
          <Text className="text-base text-headline font-normal">
            {member.membername[0].toUpperCase()}
            {member.membername.slice(1)}
          </Text>
          <Text className="text-base text-headline font-normal">
            ${parseFloat(dividedPrice).toFixed(1)}
          </Text>
        </View>
      );
    });
  };

  const footer = () => {
    let TotalPrice;
    if (members.length === 1) {
      TotalPrice = getDividedPrice(members[0]);
    } else {
      TotalPrice = getTotalPrice();
    }

    return (
      <>
        <View className="w-full border-t-2 border-dotted my-2" />
        <Text className="text-lg text-headline font-semibold px-1 w-full">
          MEMBERS
        </Text>
        <View className="flex justify-between items-end ml-3">
          {renderMembers()}
        </View>

        <View className="w-full flex-row items-end justify-between pl-1">
          <Text className="text-lg text-headline font-semibold">TOTAL</Text>
          <Text className="text-lg text-headline font-semibold">
            ${TotalPrice}{' '}
          </Text>
        </View>

        <View className="w-full border-t-2 border-dotted my-2" />
        <Text className="text-center text-base font-semibold text-headline">
          *********** THANK YOU ***********
        </Text>
      </>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalExportVisible}
      onRequestClose={closeModal}
    >
      <View className="h-full w-full bg-primary p-3">
        <View className="flex-row justify-between px-2 ">
          <TouchableOpacity onPress={closeModal}>
            <Text className="text-base  text-paragraph">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={downloadImage}>
            <Text className="text-base  text-paragraph">Save image</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-1 px-4 pb-5 pt-2">
          <View className="w-full justify-center items-center  bg-[#42414117] p-2">
            <ScrollView className="w-full bg-third px-2 ">
              <View
                ref={viewRef}
                collapsable={false}
                className="w-full justify-start items-center  bg-third px-5 pt-3 pb-8"
              >
                {header()}
                {renderItems()}
                {footer()}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BillReceipt;
