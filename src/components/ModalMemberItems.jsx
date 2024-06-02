import { View, Text, TouchableOpacity, Modal, FlatList } from 'react-native';
import React, { useState } from 'react';
import ItemCard from './ItemCard';
import BillReceipt from './BillReceipt';

const ModalMemberItems = ({
  member,
  billState,
  isModalFilterMemberItemVisible,
  setModalFilterMemberItemVisible,
  items,
}) => {
  const [isModalExportVisible, setModalExportVisible] = useState();

  const closeModal = () => setModalFilterMemberItemVisible(false);
  const memberItem = items.filter((item) => {
    return item.divider.find((e) => e === member.memberPhone);
  });

  const getDividedPrice = () => {
    let dividedPrice = 0;
    items.forEach((item) => {
      const temp = item.price / item.divider.length;
      // console.log(temp);
      dividedPrice += temp;
    });
    return dividedPrice;
  };
  const dividedPrice = getDividedPrice();

  const onExport = () => setModalExportVisible(true);

  const header = () => {
    return (
      <>
        <View className="flex-row justify-between">
          <TouchableOpacity onPress={closeModal}>
            <Text className="text-base  text-paragraph">Close</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onExport}>
            <Text className="text-base  text-paragraph">Export</Text>
          </TouchableOpacity>
        </View>
        <View className="w-full items-start justify-center">
          <Text className="font-bold text-2xl text-headline mt-3">
            Member name
          </Text>
          <Text className="font-bold text-2xl text-secondary">
            {member.membername}
          </Text>

          <Text className="font-bold text-2xl text-headline mt-3">
            Bill name
          </Text>
          <Text className="font-bold text-2xl text-secondary">
            {billState.bill_name}
          </Text>

          <Text className="font-bold text-2xl text-headline mt-3">Status</Text>
          <Text className="font-bold text-2xl text-secondary">
            {member.isPaid ? 'Paid' : 'Not Paid'}
          </Text>

          <Text className="font-bold text-2xl text-headline mt-3">
            Divided price
          </Text>
          <Text className="font-bold text-2xl text-secondary">
            ${parseFloat(dividedPrice).toFixed(1)}
          </Text>

          <Text className="font-bold text-2xl text-headline my-3">
            Divided items
          </Text>
        </View>
      </>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isModalFilterMemberItemVisible}
      onRequestClose={closeModal}
    >
      <View className="h-full w-full bg-primary">
        <View className="p-5">
          <View className="h-full w-full justify-start items-center rounded-t-2xl  bg-primary">
            <FlatList
              data={memberItem}
              renderItem={({ item }) => (
                <ItemCard item={item} bill={billState} />
              )}
              ListHeaderComponent={header}
            />
          </View>
        </View>
      </View>
      {isModalExportVisible && (
        <BillReceipt
          bill={billState}
          items={memberItem}
          members={[member]}
          isModalExportVisible={isModalExportVisible}
          setModalExportVisible={setModalExportVisible}
        />
      )}
    </Modal>
  );
};

export default ModalMemberItems;
