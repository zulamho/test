import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Modal} from 'react-native';

import RNFS from 'react-native-fs';

import {store} from 'universal-library/redux/store';
import axios from 'axios';

import Icon from 'react-native-vector-icons/FontAwesome5';

import PdfIcon from 'android_res/svg/pdf.svg';
import FolderIcon from 'android_res/svg/folder.svg';
import CreateFolderModal from './CreateFolderModal';
import {deleteFromAnchorsObject, removeFromAnchorsSendedFromUsers} from 'universal-library/redux/actions/anchors';
import { config } from '../../../../app_config';

const iconTypesChooser = (type) => {
	switch (type) {
		case 'pdf':
			return <PdfIcon width={27} height={32} style={{alignSelf: 'center', marginRight: 16}}></PdfIcon>;
			break;
		case 'dir':
			return <FolderIcon width={29} height={26} style={{alignSelf: 'center', marginRight: 16}}></FolderIcon>;
			break;
	}
};

const RelocateIntoFolderModal = ({item, isVisible, setIsVisible, setCurrentMenuIndex}) => {
	if (item === undefined) {
		return <></>;
	}

	const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);

	useEffect(() => {
		return () => {};
	}, [isCreateFolderModalVisible, store.getState().anchorsState.dirsForEncrypt]);

	const avialableFolders = store.getState().anchorsState.dirsForEncrypt;
	const keys = Object.keys(avialableFolders);
	const arrayOfFolders = [];
	for (let i = 0; i < keys.length; i++) {
		if (avialableFolders[keys[i]].path + '/' !== item.path.replace(item.name, '')) {
			arrayOfFolders.push({
				...avialableFolders[keys[i]],
				onPress: () => {
					axios.post(`${config.url}/getInfoAboutFileOwner`, {fileId: item.id, userToken: store.getState().userState.userToken}).then((body) => {
						RNFS.moveFile(item.path, `${avialableFolders[keys[i]].path}/${item.name}`).then(() => {
							const sendedAnchorsList = store.getState().anchorsState.anchorsSendedFromUsers[body.data.userId];
							const files = sendedAnchorsList;
							if (files !== undefined && files.length !== 0) {
								const cleanedFiles = files.filter((file) => {
									if (file.path !== item.path) {
										return file;
									} else {
										file.path = `${avialableFolders[keys[i]].path}/${file.filename}`;
										return file;
									}
								});
								store.dispatch(removeFromAnchorsSendedFromUsers(body.data.userId, cleanedFiles));
							}
							if (item.isAnchor === true) store.dispatch(deleteFromAnchorsObject(item.path.replace(`/${item.name}`, ''), item.id));
							if (item.isDir === true) store.dispatch(deleteFromAnchorsObject(item.path.replace(`/${item.name}`, ''), null));

							// store.dispatch(deleteFromAnchorsObject(item.path.replace(`/${item.name}`, ''), item.id));
							setCurrentMenuIndex(null);
						});
					});
				},
			});
		}
	}
	// array
	const renderItems = arrayOfFolders.map((item, i) => (
		<TouchableOpacity
			activeOpacity={0.8}
			style={{width: Dimensions.get('window').width, height: 40, flexDirection: 'row', paddingBottom: 8, paddingTop: 8, paddingLeft: 16, marginBottom: 8, alignItems: 'center'}}
			onPress={() => {
				item.onPress();
				setIsVisible(false);
			}}
			key={i}>
			<View style={{width: 24, height: 24, flexDirection: 'column', alignItems: 'center', marginRight: 24}}>
				<FolderIcon width={29} height={26} style={{alignSelf: 'center'}}></FolderIcon>
			</View>
			<Text style={{fontSize: 14, fontWeight: '400'}}>{item.name}</Text>
		</TouchableOpacity>
	));

	return (
		<View>
			<Modal animationType="fade" transparent={true} statusBarTranslucent={true} visible={isVisible} onRequestClose={() => {}}>
				<TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
					<View
						style={{
							backgroundColor: '#00000080',
							height: Dimensions.get('window').height,
							flexDirection: 'row',
						}}>
						<View style={{flexDirection: 'column', alignSelf: 'flex-end'}}>
							<TouchableWithoutFeedback onPress={() => {}}>
								<View
									style={{
										backgroundColor: 'white',
										height: 68,
										width: Dimensions.get('window').width,
										flexDirection: 'row',
										justifyContent: 'space-between',
										paddingTop: 18,
										paddingBottom: 18,
										paddingLeft: 24,
										paddingRight: 16,
										alignItems: 'center',
									}}>
									<View style={{flexDirection: 'row'}}>
										{iconTypesChooser(item.type)}
										<View style={{flexDirection: 'column', alignSelf: 'center'}}>
											<Text style={{fontSize: 14}}>{item.name}</Text>
											<Text style={{fontSize: 12, color: '#00000040'}}>{item.status}</Text>
										</View>
									</View>
									<TouchableOpacity onPress={() => setIsVisible(false)}>
										<View style={{backgroundColor: 'rgba(118, 118, 128, 0.12)', width: 30, height: 30, borderRadius: 15, flexDirection: 'column', alignItems: 'center'}}>
											<View style={{alignItems: 'center', flexDirection: 'row', height: '100%'}}>
												<Icon name={'times'} size={20} color={'#00000040'} style={{}}></Icon>
											</View>
										</View>
									</TouchableOpacity>
								</View>
							</TouchableWithoutFeedback>
							<View style={{backgroundColor: 'white', width: Dimensions.get('window').width, height: 27, alignItems: 'center', flexDirection: 'row'}}>
								<Text style={{backgroundColor: '#76768012', width: '100%', height: '100%', paddingLeft: 24, alignSelf: 'center', lineHeight: 26}}>Переместить в папку</Text>
							</View>
							<View style={{flexDirection: 'column', alignSelf: 'flex-end', backgroundColor: 'white'}}>{renderItems}</View>
							<View style={{flexDirection: 'column', alignSelf: 'flex-end'}}>
								<TouchableOpacity
									activeOpacity={0.8}
									style={{backgroundColor: 'white', height: 40, width: Dimensions.get('window').width, flexDirection: 'row', paddingBottom: 16, paddingTop: 8, paddingLeft: 16, alignItems: 'center'}}
									onPress={() => {
										setIsCreateFolderModalVisible(true);
									}}>
									<View style={{width: 24, height: 24, flexDirection: 'column', alignItems: 'center', marginRight: 24}}>
										<Icon name={'folder-plus'} size={24}></Icon>
									</View>
									<Text>Создать папку</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</TouchableWithoutFeedback>
			</Modal>
			<CreateFolderModal isVisible={isCreateFolderModalVisible} setIsVisible={setIsCreateFolderModalVisible}></CreateFolderModal>
		</View>
	);
};

export default RelocateIntoFolderModal;
