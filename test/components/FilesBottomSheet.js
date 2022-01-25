import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, Dimensions, TouchableOpacity} from 'react-native';
import RNImageConverter from 'react-native-image-converter';

import Share from 'react-native-share';

import {store} from 'universal-library/redux/store';
import {setFavoriteAnchors, deleteFromFavoriteAnchors} from 'universal-library/redux/actions/anchors';
import RNFS from 'react-native-fs';

import Icon from 'react-native-vector-icons/FontAwesome5';

import colors from 'android_res/colors';

import BottomSheetModal from './modals/BottomSheetModal';
import DeletionModal from './modals/DeletionModal';
import RenameModal from './modals/RenameModal';
import AnchorHistoryModal from './modals/AnchorHistoryModal';
import RelocateIntoFolderModal from './modals/RelocateIntoFolderModal';
import AccessTunningModal from './modals/AccessTunningModal';
import {AppIcons} from 'android_res/svg/IconSet';

const FilesBottomSheet = ({anchors, favoriteAnchors, currentMenuIndex, setCurrentMenuIndex, isVisible, setIsVisible, navigation}) => {
	if (anchors.length == 0 || currentMenuIndex === null) {
		return <></>;
	}

	let favoriteMenuItem = {
		title: 'Добавить в избранное',
		isActive: false,
		iconName: 'favorite_empty',
		onPress: () => {
			store.dispatch(setFavoriteAnchors(anchors[currentMenuIndex]));
		},
	};
	if (favoriteAnchors[anchors[currentMenuIndex].name] !== undefined) {
		favoriteMenuItem = {
			title: 'Убрать из избранного',
			isActive: true,
			iconName: 'favorite_empty',
			onPress: () => {
				store.dispatch(deleteFromFavoriteAnchors(anchors[currentMenuIndex].name));
			},
		};
	}
	const bottomSheetElements = [
		{
			title: 'Открыть',
			iconName: 'open',
			onPress: () => {
				navigation.navigate('Decrypting', {filename: anchors[currentMenuIndex].name, path: anchors[currentMenuIndex].path});
			},
		},
		{
			title: 'Отправить',
			iconName: 'send',
			onPress: () => {
				const extension = anchors[currentMenuIndex].type;
				// const isApplication = /pdf/.test(extension);
				// const isVideo = /mp4/.test(extension);
				// let type;
				// if (isImage) type = 'image';
				// if (isVideo) type = 'video';
				// if (isApplication) type = 'application';
				let url;
				const isJPG = /jpg/i.test(extension);
				if (isJPG) {
					const item = anchors[currentMenuIndex];
					const ext = item.type;
					const newPath = `/storage/emulated/0/Android/quantguard_backups/${item.name.replace('.' + ext, '.png')}`;
					url = `content://${newPath}`;
					RNFS.copyFile(item.path, newPath).then(() => {
						// 	RNFS.writeFile(newPath, newFile, 'base64').then(() => {
						// 		console.log(newFile);
						Share.open({
							url: url,
							// type: `${type}/${extension}`,
							type: 'application/pdf',
							// showAppsToView: true,
							title: 'Поделиться',
							message: 'Файл отправлен из приложения Quant Guard',
						});
						// RNFS.unlink(newPath)

						//4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsND...
						// 	});
						// });
					});
				} else {
					url = `file://${anchors[currentMenuIndex].path}`;
					Share.open({
						url: url,
						// type: `${type}/${extension}`,
						type: 'application/pdf',
						// showAppsToView: true,
						title: 'Поделиться',
						message: 'Файл отправлен из приложения Quant Guard',
					});
				}
			},
		},
		{
			title: 'История открытий',
			iconName: 'history',
			onPress: () => {
				setIsAnchorHistoryModalVisible(true);
			},
		},
		favoriteMenuItem,
		{
			title: 'Переименовать',
			iconName: 'rename',
			onPress: () => {
				setIsRenameModalVisible(true);
				// RNFS.moveFile(anchors[currentMenuIndex].path,)
			},
		},
		{
			title: 'Переместить в папку',
			iconName: 'move_to_folder',
			onPress: () => {
				setIsRelocateIntoFolderModalVisible(true);
			},
		},
		{
			title: 'Удалить',
			isActive: true,
			iconName: 'delete',
			onPress: () => {
				console.log(anchors[currentMenuIndex].path);
				setIsDeletionModalVisible(true);
			},
		},
	];

	useEffect(() => {
		return () => {
			setCurrentMenuIndex(null);
		};
	}, []);

	const renderBottomSheetElements = bottomSheetElements.map((item, i) => (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={() => {
				item.onPress();
				setIsVisible(false);
			}}
			key={i}>
			<View style={{alignSelf: 'flex-end', backgroundColor: 'white', width: Dimensions.get('window').width, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, paddingLeft: 16, paddingRight: 16, alignItems: 'center'}}>
				<View style={{marginRight: 24, width: 24, height: 24, flexDirection: 'column', alignItems: 'center'}}>
					<AppIcons name={item.iconName} width={28} height={28} isActive={item.isActive !== undefined ? item.isActive : false}></AppIcons>
				</View>
				<Text style={{color: item.isActive !== undefined ? (item.isActive ? colors.errorColor : colors.accentColor) : colors.accentColor}}>{item.title}</Text>
			</View>
		</TouchableOpacity>
	));

	const [isAnchorHistoryModalVisible, setIsAnchorHistoryModalVisible] = useState(false);
	const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
	const [isDeletionModalVisible, setIsDeletionModalVisible] = useState(false);
	const [isRelocateIntoFolderModalVisible, setIsRelocateIntoFolderModalVisible] = useState(false);
	const [isAccessTunningModalVisible, setIsAccessTunningModalVisible] = useState(false);

	return (
		<SafeAreaView style={{}}>
			<BottomSheetModal anchors={anchors} menuItems={renderBottomSheetElements} setCurrentMenuIndex={setCurrentMenuIndex} isVisible={isVisible} setIsVisible={setIsVisible} currentMenuIndex={currentMenuIndex}></BottomSheetModal>
			<DeletionModal message={'Вы действитльно хотите удалить выбранные файлы?'} item={anchors[currentMenuIndex]} isVisible={isDeletionModalVisible} setIsVisible={setIsDeletionModalVisible} setCurrentMenuIndex={setCurrentMenuIndex}></DeletionModal>
			<RenameModal item={anchors[currentMenuIndex]} isVisible={isRenameModalVisible} setIsVisible={setIsRenameModalVisible} setCurrentMenuIndex={setCurrentMenuIndex}></RenameModal>
			<AnchorHistoryModal item={anchors[currentMenuIndex]} isVisible={isAnchorHistoryModalVisible} setIsVisible={setIsAnchorHistoryModalVisible}></AnchorHistoryModal>
			<RelocateIntoFolderModal item={anchors[currentMenuIndex]} isVisible={isRelocateIntoFolderModalVisible} setIsVisible={setIsRelocateIntoFolderModalVisible} setCurrentMenuIndex={setCurrentMenuIndex}></RelocateIntoFolderModal>
			<AccessTunningModal item={anchors[currentMenuIndex]} isVisible={isAccessTunningModalVisible} setIsVisible={setIsAccessTunningModalVisible} setCurrentMenuIndex={setCurrentMenuIndex}></AccessTunningModal>
		</SafeAreaView>
	);
};

export default FilesBottomSheet;
