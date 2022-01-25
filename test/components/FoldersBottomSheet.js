import React, {useState} from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';

import RNFS from 'react-native-fs';

import {store} from 'universal-library/redux/store';
import {setFavoriteAnchors, deleteFromFavoriteAnchors} from 'universal-library/redux/actions/anchors';

import Icon from 'react-native-vector-icons/FontAwesome5';

import BottomSheetModal from './modals/BottomSheetModal';
import DeletionModal from './modals/DeletionModal';

import colors from 'android_res/colors';

const FoldersBottomSheet = ({anchors, favoriteAnchors, currentMenuIndex, setCurrentMenuIndex, isVisible, setIsVisible}) => {
	console.log(anchors);
	if (anchors.length == 0 || currentMenuIndex === null) {
		return <></>;
	}

	let favoriteMenuItem = {
		title: 'Добавить в избранное',
		iconName: 'star',
		onPress: () => {
			store.dispatch(setFavoriteAnchors(anchors[currentMenuIndex]));
		},
	};
	if (favoriteAnchors[anchors[currentMenuIndex].name] !== undefined) {
		favoriteMenuItem = {
			title: 'Убрать из избранного',
			color: colors.errorColor,
			iconName: 'star',
			onPress: () => {
				store.dispatch(deleteFromFavoriteAnchors(anchors[currentMenuIndex].name));
			},
		};
	}

	const bottomSheetElements = [
		favoriteMenuItem,
		{
			title: 'Удалить',
			iconName: 'trash',
			color: colors.errorColor,
			onPress: () => {
				setIsDeletionModalVisible(true);
			},
		},
	];

	const renderBottomSheetElements = bottomSheetElements.map((item, i) => (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={() => {
				item.onPress();
				setIsVisible(false);
			}}
			key={item.title}>
			<View style={{alignSelf: 'flex-end', backgroundColor: 'white', width: Dimensions.get('window').width, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, paddingLeft: 16, paddingRight: 16, alignItems: 'center'}}>
				<View style={{marginRight: 24, width: 24, height: 24, flexDirection: 'column', alignItems: 'center'}}>
					<Icon name={item.iconName} size={20} color={item.color ? item.color : colors.accentColor}></Icon>
				</View>
				<Text style={{color: item.color ? item.color : colors.accentColor}}>{item.title}</Text>
			</View>
		</TouchableOpacity>
	));

	const [isDeletionModalVisible, setIsDeletionModalVisible] = useState(false);

	return (
		<>
			<BottomSheetModal anchors={anchors} menuItems={renderBottomSheetElements} isVisible={isVisible} setIsVisible={setIsVisible} currentMenuIndex={currentMenuIndex} setCurrentMenuIndex={setCurrentMenuIndex}></BottomSheetModal>
			<DeletionModal message={'Вы действитльно хотите удалить выбранные файлы?'} item={anchors[currentMenuIndex]} isVisible={isDeletionModalVisible} setIsVisible={setIsDeletionModalVisible} setCurrentMenuIndex={setCurrentMenuIndex}></DeletionModal>
		</>
	);
};

export default FoldersBottomSheet;
