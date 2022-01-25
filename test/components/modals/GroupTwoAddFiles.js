import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Linking, Animated, Modal, Dimensions, TouchableOpacity, Text} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import {connect} from 'react-redux';

import {showZeroLevelDeep, showFirstLevelDeep, showAppFolderContent} from 'android_library/functions/showAcnhorsSubFunctions';
import {sortFiles} from 'android_library/functions/sortFiles';
import {getSortFilterText} from 'android_library/functions/getSortFilterText';

import LoadingStatus from 'universal-library/components/LoadingStatus';
import OpenFileArrowDown from 'universal-library/components/OpenFileArrowDown';

import FilesList from 'android_library/components/FliesList';
import FilesBottomSheet from 'android_library/components/FilesBottomSheet';
import FoldersBottomSheet from 'android_library/components/FoldersBottomSheet';
import Toolbar from 'android_library/components/Toolbar';
import ToolbarNewGroup from 'android_library/components/ToolbarNewGroup';
import DocumentPicker from 'react-native-document-picker';
import mainColors from 'android_res/colors';
import AnimatedSortBar from 'android_library/components/AnimatedSortBar';
import SortChoosingBottomSheet from 'android_library/components/SortChoosingBottomSheet';
import {addManyAnchors, addManyFolders, addOneFolder} from 'android_library/functions/experimental';
import {store} from 'universal-library/redux/store';
import {deleteAnchors} from 'universal-library/redux/actions/anchors';
import BackButton from '../BackButton';
import GroupFilesListModal from './GroupFilesListModal';
import StyledButton from '../StyletButton';
import axios from 'axios';
import {config} from '../../../../app_config';
import encryptChoosedFilesInGroup from '../../functions/encryptChoosedFilesInGroup';
import CreationBottomSheetAddFilesGroup from './CreationBottomSheetAddFilesGroup';

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

const GroupTwoAddFiles = ({
	isVisible,
	setIsVisible,
	fileProcessingStatus,
	intentFileUri,
	filesUploadingStatus,
	persistedFiles,
	isTaskStarted,
	isOpenedFromOutside,
	setIsOpenedFromOutside,
	localNotifications,
	setAnchors,
	anchors,
	anchorsSendedFromUsers,
	anchorsObject,
	favoriteAnchors,
	activeFilesStructure,
	choosedAnchors,
	dirsForEncrypt,
	isAnchorChoosingActive,
	navigation,
	newGroupId,
	choosedContacts,
	renderedChoosedContactsInfoTooltip,
	AdminMember,
	addAnchor,
	addAnchors,
}) => {
	const [sortFilter, setSortFilter] = useState('date');
	const [sortFilterText, setSortFilterText] = useState('По дате добавления');
	const [searchValue, setSearchValue] = useState('');
	const [isFileInProcessing, setIsFileInProcessing] = useState(false);
	const [isFilesBottomSheetVisible, setIsFilesBottomSheetVisible] = useState(false);
	const [choosedDir, setChoosedDir] = useState(undefined);
	const [currentMenuIndex, setCurrentMenuIndex] = useState(null);
	const [scrollY, setScrollY] = useState(new Animated.Value(0));
	const [anchorsToShow, setAnchorsToShow] = useState([]);
	const [isFileEncryptionInProcess, setIsFileEncryptionInProcess] = useState(false);
	const [isSortChoosingBottomSheetVisible, setIsSortChoosingBottomSheetVisible] = useState(false);
	const [isRenderingEnded, setIsRenderingEnded] = useState(false);
	const [isGroupFilesListModalVisible, setIsGroupFilesListModalVisible] = useState(false);
	const [newGroup, setNewGrioup] = useState('');
	const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);
	const [isCreateBtnTapped, setIsCreateBtnTapped] = useState(false);

	const amountOfChoosedFiles = Object.keys(store.getState().anchorsState.choosedAnchors).length; 

	let button;
	if (amountOfChoosedFiles) {
		button = (
			<StyledButton
				title={'Добавить файлы'}
				onPress={async () => {
					// console.log('dddddddddddddddddddddddd', newGroupId , addAnchor);
					console.log('store.getState().groupState', Object.values(store.getState().anchorsState.choosedAnchors));

					// store.getState().anchorsState.choosedAnchors.then(async (results) => {
					// 	await encryptChoosedFilesInGroup(results, addAnchor, async () => {
					// 		console.log('store.getState().groupState', store.getState().groupState);
					// 		// getGroup/${groupData.groupId}
					await axios.put(`${config.url}/updateGroup`, {updateGroupInfo: {anchors: Object.values(store.getState().anchorsState.choosedAnchors)}, groupId: newGroupId});
					console.log('файл записан');
					// });
					// });
				}}></StyledButton>
		);
	} else {
		<View></View>;
	}

	const getGroups = async () => {
		//вынести в функцию отдельную
		try {
			const response = await axios.get(`${config.url}/getGroup/${newGroupId}`);
			let data = response.data;
			console.log('HAHAHAHAHHAHAH00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000AHAHA', data);
			setNewGrioup(data);
		} catch (error) {
			console.log(error, 'Запрос на группу не удалось выполнить');
		}
	};

	const isFocused = useIsFocused();
	useEffect(() => {
		getGroups();

		return () => {};
	}, [fileProcessingStatus, isFocused, isGroupFilesListModalVisible]);

	useEffect(() => {
		try {
			Linking.getInitialURL().then((initialUrl) => {
				console.log(initialUrl, intentFileUri);
				console.log('test', /http:\/\/quantguard/.test(intentFileUri));
				if ((intentFileUri !== '' || initialUrl === intentFileUri) && /http\:\/\/quantguard/.test(intentFileUri) === false) {
					navigation.navigate('Decrypting', {intentFileUri: intentFileUri});
				} else if (initialUrl !== null) {
					navigation.navigate('Decrypting', {initialUrl: initialUrl});
				}
			});
		} catch (e) {
			console.log(e);
		}
		return () => {};
	}, []);

	// useEffect(() => {
	// 	getSortFilterText(sortFilter).then((sortFilterText) => {
	// setSortFilterText(sortFilterText);
	// 		showAnchors(choosedAnchors, choosedDir);
	// 	});
	// 	return () => {};
	// }, [isFocused, persistedFiles, filesUploadingStatus, isTaskStarted, sortFilter, isFileInProcessing, choosedDir, activeFilesStructure, choosedAnchors, isFilesBottomSheetVisible, favoriteAnchors, localNotifications, currentMenuIndex, dirsForEncrypt]);
	useEffect(() => {
		console.log(currentMenuIndex);
		// if (currentMenuIndex === null) {
		setIsRenderingEnded(false);

		store.dispatch(deleteAnchors());
		getSortFilterText(sortFilter).then((sortFilterText) => {
			setSortFilterText(sortFilterText);
			if (choosedDir !== undefined) {
				addManyAnchors(choosedDir).then((generatedAnchors) => {
					sortFiles(generatedAnchors, sortFilter);

					setAnchors(generatedAnchors);
					setIsRenderingEnded(true);
				});
			} else {
				const foldersKeys = Object.keys(anchorsObject);
				const newDirsForEncrypt = [];
				let allContent = [];
				const mainFolderPath = '/storage/emulated/0/Android/quantguard';

				addManyFolders(dirsForEncrypt).then((folders) => {
					addManyAnchors().then((anchors) => {
						allContent = [...folders, ...anchors];
						sortFiles(allContent, sortFilter);
						console.log(allContent);
						setAnchors(allContent);
						setIsRenderingEnded(true);
					});
				});
				// }
			}
		});
		// }
	}, [sortFilter, choosedDir, dirsForEncrypt]);
	useEffect(() => {
		getSortFilterText(sortFilter).then((sortFilterText) => {
			setSortFilterText(sortFilterText);
			if (choosedDir !== undefined) {
				addManyAnchors(choosedDir).then((generatedAnchors) => {
					sortFiles(generatedAnchors, sortFilter);

					setAnchors(generatedAnchors);
					// setIsRenderingEnded(true);
				});
			} else {
				let allContent = [];
				addManyFolders(dirsForEncrypt).then((folders) => {
					addManyAnchors().then((anchors) => {
						allContent = [...folders, ...anchors];
						sortFiles(allContent, sortFilter);

						setAnchors(allContent);
						// setIsRenderingEnded(true);
					});
				});
				// }
			}
		});
		// }
	}, [currentMenuIndex]);

	useEffect(() => {
		return () => {};
	}, [fileProcessingStatus, filesUploadingStatus, anchors, anchorsObject]);

	const isItemDirOrFile = () => {
		if (anchors[currentMenuIndex] !== undefined) {
			if (anchors[currentMenuIndex].isDir === true) {
				return <FoldersBottomSheet anchors={anchors} favoriteAnchors={favoriteAnchors} currentMenuIndex={currentMenuIndex} setCurrentMenuIndex={setCurrentMenuIndex} isVisible={isFilesBottomSheetVisible} setIsVisible={setIsFilesBottomSheetVisible}></FoldersBottomSheet>;
			} else {
				return <FilesBottomSheet anchors={anchors} favoriteAnchors={favoriteAnchors} currentMenuIndex={currentMenuIndex} setCurrentMenuIndex={setCurrentMenuIndex} isVisible={isFilesBottomSheetVisible} setIsVisible={setIsFilesBottomSheetVisible} navigation={navigation}></FilesBottomSheet>;
			}
		}
	};

	if (isFileInProcessing === false && isOpenedFromOutside === false) {
		return (
			<Modal animationType="fade" transparent={false} statusBarTranslucent={false} visible={isVisible} onRequestClose={() => {}}>
				<View
					style={{
						width: Dimensions.get('window').width,
						height: 56,
						borderBottomWidth: 5,
						borderBottomColor: '#e0e0e0',
					}}>
					<View style={{marginLeft: -25}}>
						<Toolbar title={'Файлы'} newGroupId={newGroupId} addAnchor={addAnchor} backButtonCondition={true} backButtonEffect={() => setIsVisible(false)} navigation={navigation}></Toolbar>
					</View>
				</View>
				<View>
					<View style={styles.container}>
						<AnimatedSortBar scrollY={scrollY} setIsSortChoosingBottomSheetVisible={setIsSortChoosingBottomSheetVisible} sortFilterText={sortFilterText} setSortFilter={setSortFilter}></AnimatedSortBar>
						<FilesList scrollY={scrollY} isReadyToShow={isRenderingEnded} setIsFilesBottomSheetVisible={setIsFilesBottomSheetVisible} setIsFilesBottomSheetVisible={setIsFilesBottomSheetVisible} anchors={anchors} setChoosedDir={setChoosedDir} setCurrentMenuIndex={setCurrentMenuIndex} />
						{isItemDirOrFile()}
						{button}
						<TouchableOpacity
							onPress={async () => {
								setIsCreateBtnTapped(true);
								// DocumentPicker.pickMultiple({
								// 	type: [DocumentPicker.types.pdf, DocumentPicker.types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.docx, DocumentPicker.types.doc],
								// }).then(async (results) => {
								// 	await encryptChoosedFilesInGroup(results, addAnchor, async () => {
								// 		console.log('store.getState().groupState', store.getState().groupState);
								// 		// getGroup/${groupData.groupId}
								// 		await axios.put(`${config.url}/updateGroup`, {updateGroupInfo: {anchors: store.getState().groupState.anchors}, groupId: newGroupId});
								// 		console.log('файл записан');
								// 	});
								// });
							}}>
							<View style={{width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#007AFF', marginLeft: 4, marginRight: 10}}>
								<Text style={{textAlign: 'center', alignSelf: 'center', marginTop: 9, width: 48, color: '#007AFF', fontSize: 18}}>+</Text>
							</View>
							<View style={{alignSelf: 'center', textAlign: 'center'}}>
								<Text style={{alignSelf: 'center', color: '#007AFF', fontSize: 10}}>Добавить</Text>
							</View>
						</TouchableOpacity>

						<StyledButton
							title={'Далее'}
							onPress={() => {
								setIsGroupFilesListModalVisible(true);
							}}></StyledButton>

						<SortChoosingBottomSheet isVisible={isSortChoosingBottomSheetVisible} setSortFilter={setSortFilter} setIsVisible={setIsSortChoosingBottomSheetVisible}></SortChoosingBottomSheet>
					</View>
					<CreationBottomSheetAddFilesGroup setIsCreateFolderModalVisible={setIsCreateFolderModalVisible} isVisible={isCreateBtnTapped} setIsVisible={setIsCreateBtnTapped} newGroupId={newGroupId}></CreationBottomSheetAddFilesGroup>
				</View>
				<GroupFilesListModal setIsVisible={setIsGroupFilesListModalVisible} isVisible={isGroupFilesListModalVisible} groupData={newGroup} renderedChoosedContactsInfoTooltip={renderedChoosedContactsInfoTooltip} AdminMember={AdminMember} navigation={navigation}></GroupFilesListModal>
			</Modal>
		);
	} else if (fileProcessingStatus !== 'Open file') {
		return <LoadingStatus status={fileProcessingStatus}></LoadingStatus>;
	} else {
		return (
			<Modal animationType="fade" transparent={false} statusBarTranslucent={false} visible={isVisible} onRequestClose={() => {}}>
				<View>
					<View style={styles.container}>
						<Toolbar title={choosedDir !== undefined ? choosedDir.name : 'Файлы'} backButtonCondition={choosedDir !== undefined} backButtonEffect={() => setChoosedDir(undefined)} navigation={navigation}></Toolbar>
						<AnimatedSortBar scrollY={scrollY} setIsSortChoosingBottomSheetVisible={setIsSortChoosingBottomSheetVisible} sortFilterText={sortFilterText} setSortFilter={setSortFilter}></AnimatedSortBar>
						<LoadingStatus status={fileProcessingStatus}></LoadingStatus>
					</View>
				</View>
			</Modal>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: '#FFFFFF',
		height: 400,
		height: Dimensions.get('window').height - 70,
	},
	choosingAmountTip: {
		borderRadius: 20,
		height: 40,
		width: 183,
		position: 'absolute',
		bottom: 8,
		left: 92,
		zIndex: 100,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: mainColors.accentColor,
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupTwoAddFiles);
