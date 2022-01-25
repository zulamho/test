import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Modal, Dimensions, KeyboardAvoidingView, Alert} from 'react-native';
//Styles
import BackButton from '../BackButton';
import StyledButton from '../StyletButton';
import StyledTextInput from '../StyledTextInput';
//work with files
import {store} from 'universal-library/redux/store';
//group creation services
import {actionGroupCreation} from 'universal-library/redux/actions/group';
import axios from 'axios';
import ContactsListModal from './ContactsListModal';
import {connect} from 'react-redux';
import {clearChoosedContacts} from 'universal-library/redux/actions/contacts';
import {deleteAnchors} from 'universal-library/redux/actions/group';
import {config} from '../../../../app_config';
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

const mapDispatchToProps = (dispatch) => {
	return {
		setAnchors: (anchors) => dispatch({type: 'SET_ANCHORS', payload: anchors}),
		setIsOpenedFromOutside: (bool) => dispatch({type: 'SET_IS_OPENED_FROM_OUTSIDE', payload: bool}),
		addAnchor: (anchor) => dispatch({type: 'ADD_ANCHOR', payload: anchor}),
		deleteAnchors: () => dispatch(deleteAnchors()),
		clearChoosedContacts: () => dispatch(clearChoosedContacts()),
	};
};

const GroupCreateModal = ({isVisible, setIsVisible, name, lastname, navigation, choosedContacts}) => {
	const [ContactsListModalVisible, setIsContactsListModalVisible] = useState(false);
	const [newGroupName, setGroupName] = useState('');
	const [anchors, setAnchors] = useState([]);
	const [isCreationStarted, setIsCreationStarted] = useState(false);
	const [newGroupId, setNewGroupId] = useState('');
	const [newGroup , setNewGroup] = useState("")

	
	console.log('Id Созданной группы', newGroup);

	const user = {
		name,
		lastname,
	};

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
													userToken: store.getState().userState.userToken,
													groupName: newGroupName,
													groupMembers: choosedContacts,
													anchors: anchors,
												});
												console.log('Передача id группы из запроса', createdGroup.data.ops[0].groupId);
												setNewGroup(createdGroup.data.ops[0])
												setNewGroupId(createdGroup.data.ops[0].groupId);
												console.log('store.getState()', store.getState().userState);
												const adminUser = await axios.get(`${config.url}/users/${store.getState().userState.userToken}`);
												console.log('createdGroup', createdGroup.data.ops[0].groupId);
												console.log('adminUser.data', adminUser.data);
												let isGroupAlreadyExists = false;

												console.log('isGroupAlreadyExists 2', isGroupAlreadyExists);
												if (isGroupAlreadyExists === false) {
													const newGroupsList = [...adminUser.data.groupsList, {groupId: createdGroup.data.ops[0].groupId}];
													console.log('newGroupsList', newGroupsList);

													await axios.put(`${config.url}/users/${adminUser.data.userToken}/update`, {updatedUserInfo: {groupsList: newGroupsList}});
												}
												setIsCreationStarted(false);
												setIsContactsListModalVisible(true);
												
												setGroupName('');
												createAndSendNotification('Новая группа', `Вы создали группу ${newGroupName}`);

										
												// setIsVisible(false);
												console.log('Group created');
												// console.log("GET STATE ANCHORS",store.getState().groupState.anchors);
											}
										}}></StyledButton>
								</View>
							</View>
							<ContactsListModal isVisible={ContactsListModalVisible} setIsVisible={setIsContactsListModalVisible} newGroupId={newGroupId} groupData={newGroup} navigation={navigation}></ContactsListModal>
						</View>
					</KeyboardAvoidingView>
				</View>
			</Modal>
		);
	} else {
		return (
			<View style={{position: 'absolute', backgroundColor: 'white', height: Dimensions.get('window').height}}>
				<LoadingStatus status={'Создание'}></LoadingStatus>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	scrollView: {
		paddingBottom: 0,
		paddingLeft: 24,
		paddingRight: 24,
		backgroundColor: 'white',
		height: '100%',
		flexDirection: 'row',
		alignItems: 'center',
	},
	scrollViewInnerContainer: {width: '100%'},
});
export default connect(mapStateToProps, mapDispatchToProps)(GroupCreateModal);
