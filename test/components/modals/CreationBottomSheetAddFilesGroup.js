import React, {useEffect, useState} from 'react';
import {SafeAreaView, View, Text, Dimensions, TouchableOpacity} from 'react-native';

import Share from 'react-native-share';

import {store} from 'universal-library/redux/store';
import {setFilesUploadingStatus} from 'universal-library/redux/actions/misc';
import {connect} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome5';

import colors from 'android_res/colors';

import BottomSheetModal from './BottomSheetModal';
import {AppIcons} from 'android_res/svg/IconSet';

import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import encryptChoosedFiles from 'android_library/functions/encryptChoosedFiles';
import {addAnchor} from 'universal-library/redux/actions/anchors';
import axios from 'axios';
import {config} from '../../../../app_config';
import encryptChoosedFilesInGroup from '../../functions/encryptChoosedFilesInGroup';

const mapStateToProps = ({anchorsState, miscState, intentsState}) => ({
	fileProcessingStatus: intentsState.fileProcessingStatus,
	isOpenedFromOutside: intentsState.isOpenedFromOutside,
	anchors: anchorsState.anchors,
	anchorsObject: anchorsState.anchorsObject,
	anchorsSendedFromUsers: anchorsState.anchorsSendedFromUsers,
	favoriteAnchors: anchorsState.favoriteAnchors,
	activeFilesStructure: miscState.activeFilesStructure,
	localNotifications: miscState.localNotifications,
	persistedFiles: miscState.persistedFiles,
	filesUploadingStatus: miscState.filesUploadingStatus,
	isAnchorChoosingActive: anchorsState.isAnchorChoosingActive,
	choosedAnchors: anchorsState.choosedAnchors,
	dirsForEncrypt: anchorsState.dirsForEncrypt,
	isTaskStarted: intentsState.isTaskStarted,
	intentFileUri: intentsState.intentFileUri,
});
const mapDispatchToProps = (dispatch) => {
	return {
		setAnchors: (anchors) => dispatch({type: 'SET_ANCHORS', payload: anchors}),
		setIsOpenedFromOutside: (bool) => dispatch({type: 'SET_IS_OPENED_FROM_OUTSIDE', payload: bool}),

		addAnchor: (anchor) => dispatch({type: 'ADD_ANCHOR', payload: anchor}),
		deleteAnchors: () => dispatch(deleteAnchors()),
		addAnchors: (anchors) => dispatch(addAnchors(anchors)),
	};
};

const CreationBottomSheetAddFilesGroup = ({currentMenuIndex, newGroupId, addAnchor, addAnchors, setAnchors, anchors, isVisible, setIsVisible}) => {
	const bottomSheetElements = [
		{
			title: 'Добавить фото/видео',
			iconName: 'add_image',
			onPress: async () => {
				DocumentPicker.pickMultiple({
					type: ['video/*', 'image/*'],
				}).then(async (results) => {
					await encryptChoosedFilesInGroup(results, addAnchor, async () => {
						console.log('store.getState().groupState', store.getState().groupState);
						// getGroup/${groupData.groupId}
						await axios.put(`${config.url}/updateGroup`, {updateGroupInfo: {anchors: store.getState().groupState.anchors}, groupId: newGroupId});
						console.log('файл записан');
					});
				});
			},
		},
		{
			title: 'Добавить файл',
			iconName: 'add_file',
			onPress: async () => {
				DocumentPicker.pickMultiple({
					type: [DocumentPicker.types.pdf, DocumentPicker.types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.docx, DocumentPicker.types.doc],
				}).then(async (results) => {
					await encryptChoosedFilesInGroup(results, addAnchor, async () => {
						console.log('store.getState().groupState', store.getState().groupState);
						// getGroup/${groupData.groupId}
						await axios.put(`${config.url}/updateGroup`, {updateGroupInfo: {anchors: store.getState().groupState.anchors}, groupId: newGroupId});
						console.log('файл записан');
					});
				});
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
			<View style={{alignSelf: 'flex-end', backgroundColor: 'white', width: Dimensions.get('window').width, height: 60, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, paddingLeft: 16, paddingRight: 16, alignItems: 'center'}}>
				<View style={{marginRight: 24, width: 24, height: 24, alignItems: 'center'}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(CreationBottomSheetAddFilesGroup);
