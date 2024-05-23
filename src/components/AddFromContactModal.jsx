import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React from 'react';

const AddFromContactModal = ({ modalVisible, setModalVisible, setForm, form }) => (
  <Modal
    animationType="slide"
    transparent={true}
    visible={modalVisible}
    onRequestClose={() => setModalVisible(false)}
  >
    <View className="flex-1 justify-end items-center ">
      <View className="bg-secondary h-3/4 w-full justify-center items-center rounded-t-2xl">
        <Text>Hi</Text>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default AddFromContactModal;
