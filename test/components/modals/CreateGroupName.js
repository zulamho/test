import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Dimensions, KeyboardAvoidingView, Alert, Linking, Animated} from 'react-native';
//Styles
import Icon from 'react-native-vector-icons/FontAwesome5';

import BackButton from '../BackButton';
import StyledButton from '../StyletButton';
import StyledTextInput from '../StyledTextInput';
//work with files
import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
import {store} from 'universal-library/redux/store';
import {addAnchor} from 'universal-library/redux/actions/group';
import {setFilesUploadingStatus} from 'universal-library/redux/actions/misc';
import encryptChoosedFiles from '../../../../2_android/library/functions/encryptChoosedFiles';
//group creation services
import {actionGroupCreation} from 'universal-library/redux/actions/group';
import axios from 'axios';
import ContactsListModal from './ContactsListModal';
import {connect} from 'react-redux';
import {PermissionsAndroid} from 'react-native';
import encryptChoosedFilesInGroup from '../../functions/encryptChoosedFilesInGroup';
import {addOneAnchorInGroup} from '../../functions/experimental';
import {clearChoosedContacts} from 'universal-library/redux/actions/contacts';
import {deleteAnchors} from 'universal-library/redux/actions/group';
import {useIsFocused} from '@react-navigation/native';
import GroupsFilesList from '../GroupsFilesList';
import {config} from '../../../../app_config';
import {uniqueId} from '../../../../uniqueId';
import {encryptData, generateKeys} from 'universal-library/newCipher';
import {generatePassword} from 'universal-library/cipher/generatePassword';
import {asyncEncrypt} from 'universal-library/cipher/encrypt';
import LoadingStatus from 'universal-library/components/LoadingStatus';
import {createAndSendNotification} from '../../functions/createAndSendNotification';

const width = Dimensions.get('window').width;

const mapStateToProps = ({userState, anchorsState, miscState, intentsState, contactsState}) => ({
	name: userState.name,
	lastname: userState.lastname,
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

	choosedContacts: contactsState.choosedContacts, //использовать контакты
});

const CreateGroupName = ({isVisible, setIsVisible, navigation}) => {
	const [newGroupName, setGroupName] = useState('');
	const [isCreationStarted, setIsCreationStarted] = useState(false);

	useEffect(() => {
		if (newGroupName != '') {
			store.dispatch(actionGroupCreation(newGroupName));
		}
	}, [newGroupName]);

	if (isCreationStarted === false) {
		return (
			<Modal animationType="fade" transparent={false} statusBarTranslucent={false} visible={isVisible} onRequestClose={() => {}}>
				<View
					style={{
						flexDirection: 'column',
						justifyContent: 'space-between',
						backgroundColor: 'white',
						height: Dimensions.get('window').height,
						width: Dimensions.get('window').width,
					}}>
					<View
						style={{
							width: Dimensions.get('window').width,
							height: 56,
						}}>
						<View style={{flexDirection: 'row'}}>
							<View
								style={{
									alignSelf: 'center',
								}}>
								<BackButton
									color={'black'}
									onPress={() => {
										setIsVisible(false);
									}}></BackButton>
							</View>

							<Text
								style={{
									alignSelf: 'center',
									fontSize: 20,
									lineHeight: 41,
									fontWeight: '700',
								}}>
								Создать группу
							</Text>
						</View>
					</View>
					<KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
						<View style={styles.scrollView}>
							<View style={styles.scrollViewInnerContainer}>
								<StyledTextInput upperPlaceholder={'Имя группы'} placeholder={'Новая группа'} value={newGroupName} setValue={setGroupName}></StyledTextInput>

								<View style={styles.subContainer}>
									<StyledButton
										title={'Далее'}
										onPress={async () => {
											if (newGroupName === '') {
												Alert.alert('Введите имя группы');
											} else {
												setIsCreationStarted(true);
												const createdGroup = await axios.post(`${config.url}/createGroup`, {
													groupName: newGroupName,
												});
												for (const contact of choosedContacts) {
													// if (Object.hasOwnProperty.call(choosedContacts, key)) {
													const phoneNumber = contact.phoneNumbers[0].number.replace(/[^0-9]|\s/g, '').trim();
													let userRes;
													userRes = await axios.get(`${config.url}/users/getByPhone/${phoneNumber}`);
													if (userRes.data) {
														let isGroupAlreadyExists = false;
														userRes.data.groupsList.forEach((item) => {
															console.log('test inner', createdGroup.data.ops[0].groupId, item);
															if (item.groupId === createdGroup.data.ops[0].groupId) {
																isGroupAlreadyExists = true;
															}
														});
														console.log('isGroupAlreadyExists', isGroupAlreadyExists);
														if (isGroupAlreadyExists === false) {
															const newGroupsList = [...userRes.data.groupsList, {groupId: createdGroup.data.ops[0].groupId}];
															console.log('newGroupsList', newGroupsList);
															await axios.put(`${config.url}/users/${userRes.data.userToken}/update`, {updatedUserInfo: {groupsList: newGroupsList}});
															await axios.post(`${config.url}/notifications`, {
																title: 'Вас добавили в группу',
																message: `Вас добавили в группу ${createdGroup.data.ops[0].groupName}`,
																userToken: userRes.data.userToken,
																type: 'groupInvite',
															});
														}
													} else {
														const getServerPublicKey = async () => {
															try {
																return await axios.get(`${config.url}/getHSMPublicKey`);
															} catch {
																return await getServerPublicKey();
															}
														};
														const serverPublicKey = await getServerPublicKey();
														console.log('createdGroup.data.groupId', createdGroup.data.ops[0].groupId);
														const userMockupData = {
															phone: phoneNumber,
															groupsList: [{groupId: createdGroup.data.ops[0].groupId}],
														};
														console.log('userMockupData', userMockupData);
														const jsonUserData = JSON.stringify(userMockupData);
														const userKeys = await generateKeys();
														const encryptedData = await encryptData(jsonUserData, userKeys.privateKey, serverPublicKey.data);
														console.log(encryptedData);
														// const encPass = await generatePassword('' + user.inviteKey);
														// const encryptedData = await asyncEncrypt(jsonUserData, encPass.CEK);

														const encPass = await generatePassword('Временный');
														console.log(userKeys.publicKey);
														const encUserPublicKey = await asyncEncrypt(userKeys.publicKey, encPass.CEK);
														// console.log(encUserPublicKey);
														const encUserData = {
															publicKey: encUserPublicKey,
															encryptedData: encryptedData,
														};
														userRes = await axios.post(config.url + `/createUserMockup`, encUserData);
														console.log('userRes', userRes);
													}

													// }
												}
												console.log('store.getState()', store.getState().userState);
												const adminUser = await axios.get(`${config.url}/users/${store.getState().userState.userToken}`);
												console.log('createdGroup', createdGroup.data.ops[0].groupId);
												console.log('adminUser.data', adminUser.data);
												let isGroupAlreadyExists = false;
												adminUser.data.groupsList.forEach((item) => {
													console.log('test outer', createdGroup.data.ops[0].groupId, item);

													if (item.groupId === createdGroup.data.ops[0].groupId) {
														isGroupAlreadyExists = true;
													}
												});
												console.log('isGroupAlreadyExists 2', isGroupAlreadyExists);
												if (isGroupAlreadyExists === false) {
													const newGroupsList = [...adminUser.data.groupsList, {groupId: createdGroup.data.ops[0].groupId}];
													console.log('newGroupsList', newGroupsList);

													await axios.put(`${config.url}/users/${adminUser.data.userToken}/update`, {updatedUserInfo: {groupsList: newGroupsList}});
												}
												setIsVisible(false);
												setGroupName('');
												createAndSendNotification('Новая группа', `Вы создали группу ${newGroupName}`);

												navigation.navigate('Groups');
												setIsCreationStarted(false);
												console.log('Group created');
												// console.log("GET STATE ANCHORS",store.getState().groupState.anchors);
											}
										}}></StyledButton>
								</View>
							</View>
						</View>
					</KeyboardAvoidingView>
				</View>
			</Modal>
		);
	}
};

const styles = StyleSheet.create({
	content: {
		flex: 1,
		alignSelf: 'center',
		//backgroundColor: "green",
	},
	contentContainer: {
		width: width - 30,
		flexDirection: "row",
		//backgroundColor: "#E6E6E6",
		alignItems: "center",
		maxHeight: 50,
		paddingVertical: 10
	},
	filesContainer: {
		width: width - 30,
		// flex: 1,
		//backgroundColor: "#E6E6E6",
		alignItems: 'center',
		height: 100,
		paddingVertical: 10,
	},
	icon: {
		marginRight: 10,
	},
	text: {
		fontSize: 14,
	},
	AddMemberIcon: {
		marginRight: 10,
		color: "rgba(46,125,246,1)",
	},
	AddMemberText: {
		fontSize: 14,
		color: "rgba(46,125,246,1)",
	},
	subContainer: {
		position: 'absolute',
		bottom: width - 370,
		alignSelf: 'center',
		width: Dimensions.get('window').width * 0.9,
	},

});

export default CreateGroupName;
