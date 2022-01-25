import React, {useState, useEffect} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, Dimensions, KeyboardAvoidingView, Easing} from 'react-native';
import axios from 'axios';
import BackButton from '../BackButton';
import StyledButton from '../../components/StyletButton';
import StyledTextInput from '../../components/StyledTextInput';
import Contacts, {getContactsByEmailAddress} from 'react-native-contacts';
import {clearChoosedContacts, setChoosedContacts} from 'universal-library/redux/actions/contacts';
import {Animated as NativeAnimated} from 'react-native';
import {connect} from 'react-redux';
import {config} from '../../../../app_config';
import AddedContactIcon from '../../../res/svg/group/added-contact';
import AddContIcon from '../../../res/svg/group/add-contact';
import NDA from './NDA';
import {encryptData, generateKeys} from 'universal-library/newCipher';
import {generatePassword} from 'universal-library/cipher/generatePassword';
import {asyncEncrypt} from 'universal-library/cipher/encrypt';
import {store} from 'universal-library/redux/store';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const mapStateToProps = ({userState, contactsState}) => ({
	name: userState.name,
	lastname: userState.lastname,

	choosedContacts: contactsState.choosedContacts, //использовать контакты
});

const mapDispatchToProps = (dispatch) => {
	return {
		setChoosedContactsAmount: (contactsAmount) => dispatch({type: 'SET_CHOOSED_CONTACTS_AMOUNT', payload: contactsAmount}),
		setChoosedContacts: (contacts, isNeedToDelete) => dispatch(setChoosedContacts(contacts, isNeedToDelete)),
		clearChoosedContacts: () => dispatch(clearChoosedContacts()),
	};
};

const ContactsList = ({isVisible, setIsVisible, setChoosedContacts, newGroupId, clearChoosedContacts, newGroup, groupData, isContactsChoosingActive, choosedContacts, name, lastname, navigation}) => {
	const [contactsData, setContactsData] = useState([]);
	const [contactsSearchValue, setContactsSearchValue] = useState('');
	const [renderedContacts, setRenderedContacts] = useState([]);
	const [NdaModal, setNdaModal] = useState(false);
	const [scrollY, setScrollY] = useState(new NativeAnimated.Value(0));
	const groupMembers = groupData;

	const groupId = newGroupId;

	const user = {
		name,
		lastname,
	};

	let button;

	if (groupMembers.groupMembers == false) {
		button = (
			<StyledButton
				title={'Далее'}
				onPress={async () => {
					setNdaModal(true);
					let contact = choosedContacts;
					await axios.put(`${config.url}/updateGroup`, {updateGroupInfo: {groupMembers: contact}, groupId: groupId});

					for (const contact of choosedContacts) {
						// if (Object.hasOwnProperty.call(choosedContacts, key)) {
						const phoneNumber = contact.phoneNumbers[0].number.replace(/[^0-9]|\s/g, '').trim();
						let userRes;
						userRes = await axios.get(`${config.url}/users/getByPhone/${phoneNumber}`);

						if (userRes.data) {
							let isGroupAlreadyExists = false;
							userRes.data.groupsList.forEach((item) => {
								if (item.groupId === groupId) {
									isGroupAlreadyExists = true;
								}
							});

							if (isGroupAlreadyExists === false) {
								const newGroupsList = [...userRes.data.groupsList, {groupId: groupId}];
								await axios.put(`${config.url}/users/${userRes.data.userToken}/update`, {updatedUserInfo: {groupsList: newGroupsList}});
								await axios.post(`${config.url}/notifications`, {
									title: 'Вас добавили в группу',
									message: `Вас добавили в группу ${groupData.groupName} `,
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
							const userMockupData = {
								phone: phoneNumber,
								groupsList: [{groupId: groupId}],
							};
							const jsonUserData = JSON.stringify(userMockupData);
							const userKeys = await generateKeys();
							const encryptedData = await encryptData(jsonUserData, userKeys.privateKey, serverPublicKey.data);
							const encPass = await generatePassword('Временный');
							const encUserPublicKey = await asyncEncrypt(userKeys.publicKey, encPass.CEK);
							const encUserData = {
								publicKey: encUserPublicKey,
								encryptedData: encryptedData,
							};
							userRes = await axios.post(config.url + `/createUserMockup`, encUserData);
						}
						console.log('store.getState()', store.getState().userState);
						const adminUser = await axios.get(`${config.url}/users/${store.getState().userState.userToken}`);
						console.log('createdGroup', groupId);
						console.log('adminUser.data', adminUser.data);
						let isGroupAlreadyExists = false;
						adminUser.data.groupsList.forEach((item) => {
							console.log('test outer', groupId, item);

							if (item.groupId === groupId) {
								isGroupAlreadyExists = true;
							}
						});
						console.log('isGroupAlreadyExists 2', isGroupAlreadyExists);
						if (isGroupAlreadyExists === false) {
							const newGroupsList = [...adminUser.data.groupsList, {groupId: groupId}];
							console.log('newGroupsList', newGroupsList);

							await axios.put(`${config.url}/users/${adminUser.data.userToken}/update`, {updatedUserInfo: {groupsList: newGroupsList}});
						}
					}
				}}></StyledButton>
		);
	} else {
		button = (
			<StyledButton
				title={'Добавить контакт'}
				onPress={async () => {
					let contact = [...groupData.groupMembers, ...choosedContacts];
					await axios.put(`${config.url}/updateGroup`, {updateGroupInfo: {groupMembers: contact}, groupId: groupId});
					for (const contact of choosedContacts) {
						// if (Object.hasOwnProperty.call(choosedContacts, key)) {
						const phoneNumber = contact.phoneNumbers[0].number.replace(/[^0-9]|\s/g, '').trim();
						let userRes;
						userRes = await axios.get(`${config.url}/users/getByPhone/${phoneNumber}`);

						if (userRes.data) {
							let isGroupAlreadyExists = false;
							userRes.data.groupsList.forEach((item) => {
								if (item.groupId === groupId) {
									isGroupAlreadyExists = true;
								}
							});

							if (isGroupAlreadyExists === false) {
								const newGroupsList = [...userRes.data.groupsList, {groupId: groupId}];
								await axios.put(`${config.url}/users/${userRes.data.userToken}/update`, {updatedUserInfo: {groupsList: newGroupsList}});
								await axios.post(`${config.url}/notifications`, {
									title: 'Вас добавили в группу',
									message: `Вас добавили в группу ${groupData.groupName} `,
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
							const userMockupData = {
								phone: phoneNumber,
								groupsList: [{groupId: groupId}],
							};
							const jsonUserData = JSON.stringify(userMockupData);
							const userKeys = await generateKeys();
							const encryptedData = await encryptData(jsonUserData, userKeys.privateKey, serverPublicKey.data);
							const encPass = await generatePassword('Временный');
							const encUserPublicKey = await asyncEncrypt(userKeys.publicKey, encPass.CEK);
							const encUserData = {
								publicKey: encUserPublicKey,
								encryptedData: encryptedData,
							};
							userRes = await axios.post(config.url + `/createUserMockup`, encUserData);
						}
						console.log('store.getState()', store.getState().userState);
						const adminUser = await axios.get(`${config.url}/users/${store.getState().userState.userToken}`);
						console.log('createdGroup', groupId);
						console.log('adminUser.data', adminUser.data);
						let isGroupAlreadyExists = false;
						adminUser.data.groupsList.forEach((item) => {
							console.log('test outer', groupId, item);

							if (item.groupId === groupId) {
								isGroupAlreadyExists = true;
							}
						});
						console.log('isGroupAlreadyExists 2', isGroupAlreadyExists);
						if (isGroupAlreadyExists === false) {
							const newGroupsList = [...adminUser.data.groupsList, {groupId: groupId}];
							console.log('newGroupsList', newGroupsList);

							await axios.put(`${config.url}/users/${adminUser.data.userToken}/update`, {updatedUserInfo: {groupsList: newGroupsList}});
						}
					}

					setIsVisible(false);
				}}></StyledButton>
		);
	}

	const getContactsList = (result) => {
		//вынести в функцию отдельную
		try {
			Contacts.getAll()
				.then((contacts) => {
					result = contacts;
					setContactsData(result);
					setRenderedContacts(renderItems(result));
				})
				.catch((error) => {
					console.log(error);
				});
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getContactsList(contactsData);
		NativeAnimated.timing(scrollY, {
			toValue: 90,
			duration: 400,
			easing: Easing.linear,
			useNativeDriver: false,
		}).start();
		return () => {
			clearChoosedContacts();
		};
	}, []);

	useEffect(() => {
		if (contactsSearchValue !== '') {
			const a = contactsData.filter((item) => {
				const reqExp = new RegExp(contactsSearchValue.trim(), 'gi');
				// const reqExp = '/' + contactsSearchValue ? contactsSearchValue : '.' + '/gi'
				console.log('reqExp', reqExp);
				if (reqExp.test(item.displayName)) {
					return true;
				} else {
					return false;
				}
			});
			console.log('a', a);
			setRenderedContacts(renderItems(a));
			// setContactsData(a)
		} else {
			setRenderedContacts(renderItems(contactsData));
		}
	}, [contactsSearchValue, choosedContacts]);

	const renderedChoosedContactsInfoTooltip = choosedContacts.map((item) => {
		console.log('item', item);
		return (
			<View style={{height: 50}}>
				<View style={{width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: 4, marginRight: 4}}>
					<Text style={{alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18}}>
						{item.givenName.substr(0, 1)}
						{item.familyName.substr(0, 1)}
					</Text>
				</View>
				<View style={{alignSelf: 'center', textAlign: 'center', bottom: -5}}>
					<Text style={{alignSelf: 'center', color: 'black', fontSize: 10}}>{item.givenName}</Text>
					<Text style={{alignSelf: 'center', color: 'black', fontSize: 10}}>{item.familyName}</Text>
				</View>
			</View>
		);
	});

	const renderItems = (props) => {
		return props
			.map((item, i) => {
				if (item.phoneNumbers && item.phoneNumbers[0] && item.phoneNumbers[0].number) {
					return (
						<TouchableOpacity
							key={i}
							style={{paddingLeft: '5%'}}
							onPress={() => {
								if (choosedContacts) {
									const rawContactIdArray = choosedContacts.map(function (e) {
										return e.rawContactId;
									});
									const pos = rawContactIdArray.indexOf(item.rawContactId);
									if (choosedContacts[pos] && choosedContacts[pos].isChoosed === true) {
										item.isChoosed = false;
										setChoosedContacts(item, true);
									} else {
										item.isChoosed = true;
										setChoosedContacts(item, false);
									}
								}
							}}>
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}>
								<View style={styles.element}>
									<View style={{flexDirection: 'row', width: Dimensions.get('window').width - 32, backgroundColor: 'white', height: 80, alignSelf: 'center'}}>
										<View style={{width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 16}}>
											<Text style={{alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18}}>
												{item.givenName.substr(0, 1)}
												{item.familyName.substr(0, 1)}
											</Text>
										</View>
										<View style={{flexDirection: 'column', alignSelf: 'center'}}>
											<Text style={{alignSelf: 'center', textAlign: 'left', color: 'black', fontSize: 16, width: 234}}>
												{item.givenName} {item.familyName}
											</Text>
										</View>
										{(item.isChoosed && (
											<View style={{alignSelf: 'center', flex: 0}}>
												<AddedContactIcon style={{marginLeft: -80, marginTop: 2}}></AddedContactIcon>
											</View>
										)) || (
											<View style={{alignSelf: 'center', flex: 0}}>
												<AddContIcon style={{margin: 10}}></AddContIcon>
											</View>
										)}
									</View>
								</View>
							</View>
						</TouchableOpacity>
					);
				}
			})
			.filter((el) => {
				return el !== undefined;
			});
	};

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
								navigation={navigation}
								onPress={() => {
									setIsVisible(false);
								}}
								color={'black'}></BackButton>
						</View>

						<Text
							style={{
								alignSelf: 'center',
								fontSize: 20,
								lineHeight: 41,
								fontWeight: '700',
							}}>
							Участники группы
						</Text>
					</View>
				</View>
				<KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
					<View style={styles.content}>
						<StyledTextInput
							upperPlaceholder={'Имя пользователя'}
							placeholder={''}
							value={contactsSearchValue}
							setValue={setContactsSearchValue}
							onChangeText={(text) => {
								setContactsSearchValue(text);
							}}></StyledTextInput>

						<ScrollView style={{minHeight: Dimensions.get('window').height}}>{renderedContacts}</ScrollView>
						<View style={styles.subContainer}>{button}</View>
						<NDA isVisible={NdaModal} setIsVisible={setNdaModal} navigation={navigation} newGroupId={groupId} choosedContacts={choosedContacts} renderedChoosedContactsInfoTooltip={renderedChoosedContactsInfoTooltip} renderItems={renderItems}></NDA>
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	item: {
		padding: 20,
		marginVertical: 8,
		marginHorizontal: 16,
	},
	content: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		backgroundColor: 'white',
		height: Dimensions.get('window').height,
		width: Dimensions.get('window').width,
	},
	subContainer: {
		position: 'absolute',
		bottom: width - 330,

		alignSelf: 'center',
		width: Dimensions.get('window').width * 0.9,
		marginBottom: 45,
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(ContactsList);
