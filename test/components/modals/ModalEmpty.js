import React, {useState, useEffect} from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import GroupCreateModal from 'android_library/components/modals/GroupCreateModal';
import ModalEmpty from 'android_library/components/modals/ModalEmpty';

import Icon from 'react-native-vector-icons/FontAwesome5';
import IconSpec from 'react-native-vector-icons/FontAwesome';
import {AppIcons} from 'android_res/svg/IconSet';

import colors from 'android_res/colors';
import {View, Text} from 'react-native';

import RNBottomActionSheet from 'react-native-bottom-action-sheet';
import {TouchableOpacity} from 'react-native-gesture-handler';

import CreateFolderModal from 'android_library/components/modals/CreateFolderModal';

import CreationBottomSheet from 'android_library/components/CreationBottomSheet';

const B = () => {
	return <></>;
};
const A = () => {
	return (
		<>
			<NDA></NDA>
		</>
	);
};

const SheetView = RNBottomActionSheet.SheetView;
const MainNav = ({navigation}) => {
	const color = colors.accentColor;
	const [isCreateBtnTapped, setIsCreateBtnTapped] = useState(false);
	const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);
	const [isModalEmptyVisible, setIsModalEmptyVisible] = useState(false);
	const [isGroupCreateModal, setIsGroupCreateModal] = useState(false);

	return (
		<>
			<View style={{flexDirection: 'row'}}>
				{/* <TouchableOpacity onPress={()=>{
					navigation.nav('MainTab')
				}}>
					<AppIcons name={'files_screen'} width={30} height={30}></AppIcons>
				</TouchableOpacity>

				<AppIcons name={'B'} width={30} height={30}></AppIcons>
				<AppIcons name={'favorites_screen'} width={30} height={30}></AppIcons>
				<AppIcons name={'accessed_screen'} width={30} height={30}></AppIcons>
				<AppIcons name={'options_screen'} width={30} height={30}></AppIcons> */}
			</View>
		</>
	);
};

export default MainNav;
