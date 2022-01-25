import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, Dimensions, TouchableOpacity} from 'react-native';

import Share from 'react-native-share';

import {store} from 'universal-library/redux/store';
import {setFilesUploadingStatus} from 'universal-library/redux/actions/misc';

import Icon from 'react-native-vector-icons/FontAwesome5';

import colors from 'android_res/colors';

import BottomSheetModal from './modals/BottomSheetModal';
import {AppIcons} from 'android_res/svg/IconSet';

import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import encryptChoosedFiles from 'android_library/functions/encryptChoosedFiles';
import {addAnchor} from 'universal-library/redux/actions/anchors';

const CreationBottomSheet = ({currentMenuIndex, setIsCreateFolderModalVisible, setIsModalEmptyVisible, setIsGroupCreateModal, isVisible, setIsVisible, navigation}) => {
	const bottomSheetElements = [
		{
			title: 'Создать группу',
			iconName: 'add_group',
			onPress: () => {
				setIsGroupCreateModal(true);
			},
		},
		{
			title: 'Добавить фото/видео',
			iconName: 'add_image',
			onPress: () => {
				DocumentPicker.pickMultiple({
					type: ['video/*', 'image/*'],
				})
					.then(async (results) => {
						const arrayOfChoosedFiles = [];
						const choosedFilesAmount = results.length;
						const writeEmpty = async (current, amount) => {
							if (current < amount) {
								const extension = results[current].name.match(/\.[^/.]+$/)[0].replace(/./, '');
								const isExists = await RNFetchBlob.fs.exists(`/storage/emulated/0/Android/quantguard/${results[current].name}`);
								if (isExists === false) {
									const newAnchor = {
										name: results[current].name,
										path: `/storage/emulated/0/Android/quantguard/${results[current].name}`,
										isDir: false,
										isAnchor: true,
										status: '',
										ctime: 0,
										size: 0,
										type: extension,
										typePriority: 10,
										isChoosed: false,
										id: 'QGQGQGQGQGQGQGQGQGQGQGQGQGQGQG',
									};
									// return RNFetchBlob.fs.writeFile(`/storage/emulated/0/Android/quantguard/${results[current].name}`, JSON.stringify({fileId: 'QGQGQGQGQGQGQGQGQGQGQGQGQGQGQG'}), 'utf8').then(() => {
									store.dispatch(addAnchor(newAnchor));
								}
								store.dispatch(setFilesUploadingStatus(`/storage/emulated/0/Android/quantguard/${results[current].name}`, 0));
								arrayOfChoosedFiles.push(results[current]);
								writeEmpty(current + 1, amount);

								// });
							} else {
								return;
							}
						};
						writeEmpty(0, choosedFilesAmount).then(() => {
							encryptChoosedFiles(arrayOfChoosedFiles);
						});
					})
					.catch((e) => {
						console.log(e.message);
					});
			},
		},

		{
			title: 'Добавить файл',
			iconName: 'add_file',
			onPress: () => {
				DocumentPicker.pickMultiple({
					type: [DocumentPicker.types.pdf, DocumentPicker.types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.docx, DocumentPicker.types.doc],
				})
					.then(async (results) => {
						const arrayOfChoosedFiles = [];
						const choosedFilesAmount = results.length;
						const writeEmpty = async (current, amount) => {
							if (current < amount) {
								const extension = results[current].name.match(/\.[^/.]+$/)[0].replace(/./, '');
								const isExists = await RNFetchBlob.fs.exists(`/storage/emulated/0/Android/quantguard/${results[current].name}`);
								if (isExists === false) {
									const newAnchor = {
										name: results[current].name,
										path: `/storage/emulated/0/Android/quantguard/${results[current].name}`,
										isDir: false,
										isAnchor: true,
										status: '',
										ctime: 0,
										size: 0,
										type: extension,
										typePriority: 10,
										isChoosed: false,
										id: 'QGQGQGQGQGQGQGQGQGQGQGQGQGQGQG',
									};
									// return RNFetchBlob.fs.writeFile(`/storage/emulated/0/Android/quantguard/${results[current].name}`, JSON.stringify({fileId: 'QGQGQGQGQGQGQGQGQGQGQGQGQGQGQG'}), 'utf8').then(() => {
									store.dispatch(addAnchor(newAnchor));
								}
								store.dispatch(setFilesUploadingStatus(`/storage/emulated/0/Android/quantguard/${results[current].name}`, 0));
								arrayOfChoosedFiles.push(results[current]);
								writeEmpty(current + 1, amount);

								// });
							} else {
								return;
							}
						};
						writeEmpty(0, choosedFilesAmount).then(() => {
							encryptChoosedFiles(arrayOfChoosedFiles);
						});
					})
					.catch((e) => {
						console.log(e);
					});
			},
		},
		{
			title: 'Создать папку',
			iconName: 'add_folder',
			onPress: () => {
				setIsCreateFolderModalVisible(true);
			},
		},
		{
			title: 'Пустой модал',
			iconName: '',
			onPress: () => {
				setIsModalEmptyVisible(true);
			},
		},
	];

	useEffect(() => {
		return () => {};
	}, []);

	const renderBottomSheetElements = bottomSheetElements.map((item, i) => (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={() => {
				item.onPress();
				setIsVisible(false);
			}}
			key={item.title + item.iconName}>
			<View style={{alignSelf: 'flex-end', backgroundColor: 'white', width: Dimensions.get('window').width, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, paddingLeft: 16, paddingRight: 16, alignItems: 'center'}}>
				<View style={{marginRight: 24, width: 24, height: 24, flexDirection: 'column', alignItems: 'center'}}>
					<AppIcons name={item.iconName} width={24} height={24} isActive={item.isActive !== undefined ? item.isActive : false}></AppIcons>
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
			<BottomSheetModal anchors={['1']} menuItems={renderBottomSheetElements} isVisible={isVisible} setIsVisible={setIsVisible} currentMenuIndex={currentMenuIndex} isHeaderNeeded={false}></BottomSheetModal>
			{/* <DeletionModal message={'Вы действитльно хотите удалить выбранные файлы?'} item={anchors[currentMenuIndex]} isVisible={isDeletionModalVisible} setIsVisible={setIsDeletionModalVisible} setCurrentMenuIndex={setCurrentMenuIndex}></DeletionModal>
			<RenameModal item={anchors[currentMenuIndex]} isVisible={isRenameModalVisible} setIsVisible={setIsRenameModalVisible} setCurrentMenuIndex={setCurrentMenuIndex}></RenameModal>
			<AnchorHistoryModal item={anchors[currentMenuIndex]} isVisible={isAnchorHistoryModalVisible} setIsVisible={setIsAnchorHistoryModalVisible}></AnchorHistoryModal>
			<RelocateIntoFolderModal item={anchors[currentMenuIndex]} isVisible={isRelocateIntoFolderModalVisible} setIsVisible={setIsRelocateIntoFolderModalVisible} setCurrentMenuIndex={setCurrentMenuIndex}></RelocateIntoFolderModal>
			<AccessTunningModal item={anchors[currentMenuIndex]} isVisible={isAccessTunningModalVisible} setIsVisible={setIsAccessTunningModalVisible} setCurrentMenuIndex={setCurrentMenuIndex}></AccessTunningModal> */}
		</SafeAreaView>
	);
};

export default CreationBottomSheet;
