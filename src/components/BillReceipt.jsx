import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import React, { useRef } from 'react';
import { captureRef } from 'react-native-view-shot';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { Logo } from './Logo';

const BillReceipt = ({
  bill,
  items,
  members,
  isModalExportVisible,
  setModalExportVisible,
}) => {
  const viewRef = useRef();
  const closeModal = () => setModalExportVisible(false);

  // // get permission on android
  // const getPermissionAndroid = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
  //       {
  //         title: 'Image Download Permission',
  //         message: 'Your permission is required to save images to your device',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       return true;
  //     }
  //     Alert.alert(
  //       '',
  //       'Your permission is required to save images to your device',
  //       [{ text: 'OK', onPress: () => {} }],
  //       { cancelable: false },
  //     );
  //   } catch (err) {
  //     // handle error as you please
  //     console.log('err', err);
  //   }
  // };

  // download image
  const downloadImage = async () => {
    try {
      // react-native-view-shot caputures component
      const uri = await captureRef(viewRef, {
        format: 'png',
        quality: 0.8,
      });

      // if (Platform.OS === 'android') {
      //   const granted = await getPermissionAndroid();
      //   if (!granted) {
      //     return;
      //   }
      // }

      // cameraroll saves image
      const image = CameraRoll.saveAsset(uri, 'photo');
      if (image) {
        Alert.alert(
          '',
          'Image saved successfully.',
          [{ text: 'OK', onPress: () => {} }],
          { cancelable: false },
        );
      }
    } catch (error) {
      console.log('error', error);
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
      // console.log(temp);
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

  const itemsList = ({ item }) => {
    return (
      <>
        <View className="flex-row w-full justify-between items-end pl-4 pr-1">
          <Text className="text-base text-headline font-normal">
            {item.title}{' '}
          </Text>
          <Text className="text-base text-headline font-normal">
            ${parseFloat(item.price / item.divider.length).toFixed(1)}
          </Text>
        </View>
        <View className="flex-row w-full justify-end items-end pl-4 pr-1 mb-2">
          {/* <Text className="text-sm text-headline ml-5">
            - divide {item.divider.length} person
          </Text> */}
          <Text className="text-base text-headline ml-5">
            ${item.price} / {item.divider.length}
          </Text>
        </View>
      </>
    );
  };

  const header = () => {
    return (
      <View className="items-center">
        <Logo blackwhite={true}/>
        <View className="border-y-2 border-dotted w-full border-headline" />
        <Text className="text-xl text-headline font-semibold  my-1">
          Reciept
        </Text>
        <View className="border-y-2 border-dotted w-full border-headline " />

        <View className="flex-row w-full justify-between items-center my-2 px-1">
          <Text className="text-base text-headline font-semibold">
            {bill.bill_name}
          </Text>
          <Text className="text-base text-headline font-semibold">
            {bill.date_Create}
          </Text>
        </View>

        <View className="border-t-2 border-dotted w-full border-headline border-spacing-6 mb-3" />
      </View>
    );
  };

  const renderMember = ({ item: member }) => {
    const dividedPrice = getDividedPrice(member);
    // console.log(member.membername);
    // console.log(members.membername)
    return (
      <View className="flex-row w-full justify-between items-center pr-1">
        <Text className="text-base text-headline font-normal">
          {member.membername[0].toUpperCase()}
          {member.membername.slice(1)}
        </Text>
        <Text className="text-base text-headline font-normal">
          ${parseFloat(dividedPrice).toFixed(1)}
        </Text>
      </View>
    );
  };
  //   console.log("members", members);

  const footer = () => {
    let TotalPrice;
    if (members.length === 1) {
      TotalPrice = getDividedPrice(members[0]);
    } else {
      TotalPrice = getTotalPrice();
    }

    return (
      <>
        <View className="border-t-2 border-dotted my-2" />
        <Text className="text-base text-headline font-semibold px-1">
          MEMBERS
        </Text>
        <View className="flex justify-between items-end ml-3">
          <FlatList data={members} renderItem={renderMember} />
        </View>

        <View className="w-full flex-row items-end justify-between pl-1">
          <Text className="text-base text-headline font-semibold">TOTAL</Text>
          <Text className="text-base text-headline font-semibold">
            ${TotalPrice}{' '}
          </Text>
        </View>

        <View className="border-t-2 border-dotted my-2" />
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
            <View
              className="w-full justify-start items-center  bg-third px-5 py-8"
              ref={viewRef}
            >
              <FlatList
                data={items}
                renderItem={itemsList}
                ListHeaderComponent={header}
                ListFooterComponent={footer}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BillReceipt;
