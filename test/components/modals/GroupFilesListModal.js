import React, {useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, FlatList, Text, TouchableOpacity, ScrollView, TextInput, Modal, PermissionsAndroid, Dimensions, KeyboardAvoidingView, Alert, Linking, Easing} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

//import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from 'react-native-vector-icons/FontAwesome5';

import BackButton from '../BackButton';
import StyledButton from '../StyletButton';
import StyledTextInput from '../StyledTextInput';
import Contacts, {getContactsByEmailAddress} from 'react-native-contacts';
import {is} from 'bluebird';
import {ListItem} from 'react-native-material-ui';
import {store} from 'universal-library/redux/store';
import {clearChoosedContacts, setChoosedContacts, setIsContactsChoosingActive} from 'universal-library/redux/actions/contacts';
import {Animated as NativeAnimated} from 'react-native';
import {connect} from 'react-redux';
import mainColors from 'android_res/colors';
import Toolbar from '../Toolbar';
import GroupsFilesList from '../GroupsFilesList';
import GroupsFilesBottomSheet from '../GroupsFilesBottomSheet';
import {AppIcons} from 'android_res/svg/IconSet';
import ExtendDotsIcon from '../ExtendDotsIcon';
import AnimatedSortBar from 'android_library/components/AnimatedSortBar';
import NotificationBell from '../NotificationBell';
import ContactsListModal from './ContactsListModal';

import colors from 'android_res/colors';
import CreationBottomSheet from 'android_library/components/CreationBottomSheet';
import MainNav from './ModalEmpty';
import MainButton from './../../../screens/main/MainButton';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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
		setChoosedContactsAmount: (contactsAmount) => dispatch({type: 'SET_CHOOSED_CONTACTS_AMOUNT', payload: contactsAmount}),
		setChoosedContacts: (contacts, isNeedToDelete) => dispatch(setChoosedContacts(contacts, isNeedToDelete)),
		clearChoosedContacts: () => dispatch(clearChoosedContacts()),
	};
};

const AdminMember = ({user: {name, lastname}}) => {
	return (
		<View style={{height: 50}}>
			<View style={{width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', borderWidth: 2, borderColor: '#4CD964'}}>
				<Text style={{alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18}}>
					{name.substr(0, 1)}
					{lastname.substr(0, 1)}
				</Text>
			</View>
			<View style={{alignSelf: 'center', textAlign: 'center', bottom: -5}}>
				<Text style={{alignSelf: 'center', color: 'black', fontSize: 10}}>{name}</Text>
				<Text style={{alignSelf: 'center', color: 'black', fontSize: 10}}>{lastname}</Text>
			</View>
		</View>
	);
};

const GroupFilesListModal = ({isVisible, userState, setIsVisible, groupData, name, lastname, renderedChoosedContactsInfoTooltip, navigation}) => {
	// const [contactsData, setContactsData] = useState([]);
	// const [contactsSearchValue, setContactsSearchValue] = useState('');
	const [renderedFiles, setRenderedFiles] = useState([]);
	const [currentMenuIndex, setCurrentMenuIndex] = useState(null);
	const [isFilesBottomSheetVisible, setIsFilesBottomSheetVisible] = useState(false);
	const [ContactsListModalVisible, setIsContactsListModalVisible] = useState(false);
	//
	const [isCreateBtnTapped, setIsCreateBtnTapped] = useState(false);
	const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);
	const [isModalEmptyVisible, setIsModalEmptyVisible] = useState(false);
	const [isGroupCreateModal, setIsGroupCreateModal] = useState(false);

	const [scrollY, setScrollY] = useState(new NativeAnimated.Value(0));
	useEffect(() => {
		console.log('groupData', groupData);
		// setRenderedFiles(renderFiles(groupData.anchors))
	}, []);

	const user = {
		name,
		lastname,
	};

	const color = colors.accentColor;

	const ContactsNewGroup = groupData.groupMembers.map((item) => {
		console.log('item', item);
		return (
			<View style={{height: 50}}>
				<View style={{width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: 10}}>
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

	const ButtonAddContact = () => {
		return (
			<View style={{height: 48}}>
				<View style={{width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#007AFF', marginLeft: 4, marginRight: 10}}>
					<Text style={{textAlign: 'center', alignSelf: 'center', marginTop: 9, width: 48, color: '#007AFF', fontSize: 18}}>+</Text>
				</View>
				<View style={{alignSelf: 'center', textAlign: 'center', bottom: -5}}>
					<Text style={{alignSelf: 'center', color: '#007AFF', fontSize: 10}}>Добавить</Text>
				</View>
			</View>
		);
	};

	// const iconName = ['files_screen', 'options_screen', 'accessed_screen', 'favorites_screen'];

	// let iconName;
	// if (route.name === 'Files') {
	// 	iconName = 'files_screen';
	// } else if (route.name === 'Options') {
	// 	iconName = 'options_screen';
	// } else if (route.name === 'Groups') {
	// 	iconName = 'accessed_screen';
	// } else if (route.name === 'Favorites') {
	// 	iconName = 'favorites_screen';
	// } else if (route.name === ' ') {

	// iconName.map((item) => {
	// 	<TouchableOpacity
	// 		onPress={() => {
	// 			navigation.navigate('MainTab');
	// 		}}>
	// 		<AppIcons name={'item'} width={28} height={28}></AppIcons>
	// 	</TouchableOpacity>;
	// });

	// const getContactsList = (result) => { //вынести в функцию отдельную
	// 	try {
	// 		Contacts.getAll()
	// 			.then((contacts) => {
	// 				result = contacts;
	// 				setContactsData(result);
	// 				setRenderedContacts(renderItems(result))
	// 			})
	// 			.catch((error) => {
	// 				console.log(error);
	// 			});
	// 	} catch (error) {
	// 		console.log(error);
	// 	}
	// }

	// useEffect(() => {
	// 	// getContactsList(contactsData);
	// 	NativeAnimated.timing(scrollY, {
	// 		toValue: 90,
	// 		duration: 400,
	// 		easing: Easing.linear,
	// 		useNativeDriver: false,
	// 	}).start();
	// 	return () => {
	// 		// clearChoosedContacts()
	// 	};
	// }, []);

	// useEffect(() => {
	// 	// if(contactsSearchValue !== ''){
	// 		// const a = contactsData.filter((item) => {
	// 		// 	const reqExp = new RegExp(contactsSearchValue.trim(), 'gi')
	// 		// 	// const reqExp = '/' + contactsSearchValue ? contactsSearchValue : '.' + '/gi'
	// 		// 	console.log('reqExp', reqExp)
	// 		// 	if(reqExp.test(item.displayName)){
	// 		// 		return true
	// 		// 	} else {
	// 		// 		return false
	// 		// 	}
	// 		// })
	// 		// console.log('a', a)
	// 		// setRenderedContacts(renderItems(a))
	// 		// setContactsData(a)
	// 	// } else {
	// 		// setRenderedContacts(renderItems(contactsData))

	// 	// }

	// }, [])

	// useEffect(() => {
	// 	console.log('useEffect choosedContacts', choosedContacts)
	// 	renderItems()
	// }, [choosedContacts])
	// let isChoosingActive = false;
	// if (isContactsChoosingActive === true) {
	// 	isChoosingActive = true;
	// }
	// const renderFiles = (props) => {
	// 	return props.map((item, i) => {
	// 		// if (item.isChoosed === true && isContactsChoosingActive === false) {
	// 		// 	item.isChoosed = false;
	// 		// 	console.log(item.isChoosed);
	// 		// 	setChoosedContacts(i, true);
	// 		//

	// 		return (
	// 			<TouchableOpacity
	// 				key={i}
	// 				style={{paddingLeft: '5%'}}
	// 				onPress={() => {
	// 					if(choosedContacts){
	// 						const rawContactIdArray = choosedContacts.map(function(e) { return e.rawContactId })
	// 						const pos = rawContactIdArray.indexOf(item.rawContactId)
	// 						if (choosedContacts[pos] && choosedContacts[pos].isChoosed === true) {
	// 							item.isChoosed = false;
	// 							setChoosedContacts(item, true);
	// 						} else {
	// 							item.isChoosed = true;
	// 							setChoosedContacts(item, false);
	// 						}
	// 					}
	// 				}}>
	// 				<View
	// 					style={{
	// 						flexDirection: 'row',
	// 						alignItems: 'center',
	// 					}}>
	// 					{/* {isChoosingActive && (
	// 						<TouchableOpacity
	// 							style={{
	// 								...styles.isChoosedTip,
	// 								backgroundColor: item.isChoosed ? mainColors.accentColor : '#00000000',
	// 							}}
	// 							onPress={() => {
	// 								if (item.isChoosed === true) {
	// 									item.isChoosed = false;
	// 									console.log(item.isChoosed);
	// 									console.log(item);
	// 									setChoosedContacts(item.id, true);
	// 								} else {
	// 									item.isChoosed = true;
	// 									console.log(item.isChoosed);
	// 									console.log(item);
	// 									setChoosedContacts({ [item.id]: item }, false);
	// 								}
	// 								// if (item.isChoosed) {
	// 								// 	setChoosedAnchors(item.id, true);
	// 								// } else {
	// 								// 	setChoosedAnchors({[item.id]: item}, false);
	// 								// }
	// 							}}>
	// 							<View style={{ alignItems: 'center', width: '100%' }}>{item.isChoosed ? <Icon name="check" size={14} color={'#FFFFFF'}></Icon> : <></>}</View>
	// 						</TouchableOpacity>
	// 					)} */}
	// 					<View style={styles.element}>
	// 						<View style={{ flexDirection: 'row', width: Dimensions.get('window').width - 32, backgroundColor: 'white', height: 80, alignSelf: 'center' }}>
	// 							<View style={{ width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 16 }}>
	// 								<Text style={{ alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18 }}>
	// 									{item.givenName.substr(0, 1)}
	// 									{item.familyName.substr(0, 1)}
	// 								</Text>
	// 							</View>
	// 							<View style={{ flexDirection: 'column', alignSelf: 'center' }}>
	// 								<Text style={{ alignSelf: 'center', textAlign: 'left', color: 'black', fontSize: 18, width: 234 }}>
	// 									{item.givenName} {item.familyName}
	// 								</Text>
	// 								<Text style={{ alignSelf: 'center', textAlign: 'left', color: '#22334450', fontSize: 16, width: 234 }}>
	// 									{item.phoneNumbers[0].number}
	// 								</Text>
	// 							</View>
	// 							{
	// 								item.isChoosed && <View style={{alignSelf: 'center', flex: 1}}>
	// 									<View style={{alignSelf: 'center', width: 30, height: 30, backgroundColor: mainColors.accentColor, borderRadius: 15}}>

	// 									</View>
	// 								</View>
	// 							}
	// 						</View>
	// 					</View>
	// 				</View>
	// 			</TouchableOpacity>
	// 		);
	// 	});
	// };
	return (
		<Modal animationType="fade" transparent={false} statusBarTranslucent={false} visible={isVisible} onRequestClose={() => {}}>
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',

					width: Dimensions.get('window').width,
					height: 56,
					borderBottomColor: '#e0e0e0',
					borderBottomWidth: 5,
				}}>
				<View style={{marginLeft: -25}}>
					<Toolbar title={`${groupData.groupName}`} backButtonCondition={true} backButtonEffect={() => setIsVisible(false)} navigation={navigation}></Toolbar>
				</View>
			</View>

			<KeyboardAvoidingView behavior={'padding'} style={{flex: 1, backgroundColor: '#F8F8F8'}}>
				<View style={styles.content}>
					<Text
						style={{
							fontSize: 18,
							fontWeight: 'bold',
						}}>
						{' '}
						У кого есть доступ{' '}
					</Text>
					<View style={styles.member}>
						<View style={{flexDirection: 'row'}}>
							<TouchableOpacity
								onPress={() => {
									setIsContactsListModalVisible(true);
								}}>
								<ButtonAddContact />
							</TouchableOpacity>

							<AdminMember key={'admin'} user={user} />
							<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{ContactsNewGroup}</View>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>

			<View style={{minHeight: Dimensions.get('window').height - 280, backgroundColor: '#E5E5E5'}}>
				<GroupsFilesList scrollY={scrollY} isReadyToShow={true} anchors={groupData.anchors} setCurrentMenuIndex={setCurrentMenuIndex} setIsFilesBottomSheetVisible={setIsFilesBottomSheetVisible} />
			</View>
			<ContactsListModal isVisible={ContactsListModalVisible} setIsVisible={setIsContactsListModalVisible} newGroupId={groupData.groupId} groupMembers={groupData.groupMembers} groupData={groupData} navigation={navigation}></ContactsListModal>
			<GroupsFilesBottomSheet anchors={groupData.anchors} isVisible={isFilesBottomSheetVisible} currentMenuIndex={currentMenuIndex} setCurrentMenuIndex={setCurrentMenuIndex} setIsVisible={setIsFilesBottomSheetVisible} navigation={navigation} />

			<View style={{width: width, height: 50}}>
				<View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, marginLeft: 22, marginRight: 22}}>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Files');
							setIsVisible(false);
						}}>
						<AppIcons name={'files_screen'} width={28} height={28}></AppIcons>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Favorites');
							setIsVisible(false);
						}}
						style={{marginRight: -25}}>
						<AppIcons name={'favorites_screen'} width={28} height={28}></AppIcons>
					</TouchableOpacity>

					<TouchableOpacity activeOpacity={0.7} onPress={() => {}} z>
						<View style={{marginTop: -52}}>
							<AppIcons name={'creation_button'} height={80} width={80}></AppIcons>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Groups');
							setIsVisible(false);
						}}
						style={{marginLeft: -25}}>
						<AppIcons name={'accessed_screen'} width={28} height={28}></AppIcons>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Options');
						
						}}>
						<AppIcons name={'options_screen'} width={28} height={28}></AppIcons>
					</TouchableOpacity>
				</View>
			</View>
			<MainButton navigation={navigation}></MainButton>

			<CreationBottomSheet setIsCreateFolderModalVisible={setIsCreateFolderModalVisible} setIsModalEmptyVisible={setIsModalEmptyVisible} setIsGroupCreateModal={setIsGroupCreateModal} isVisible={isCreateBtnTapped} setIsVisible={setIsCreateBtnTapped}></CreationBottomSheet>
		</Modal>
	);
};

const styles = StyleSheet.create({
	content: {
		flex: 1,
		margin: 20,
		marginTop: 20,
		// backgroundColor: "#F8F8F8",
	},
	member: {
		bottom: -20,
	},
	subContainer: {
		position: 'absolute',
		bottom: 210,
		alignSelf: 'center',
		width: Dimensions.get('window').width * 0.9,
		// backgroundColor: "red",
	},
	contentContainer: {
		// backgroundColor: "red",
		// alignItems: "center",
		bottom: -10,
		maxHeight: 50,
		paddingVertical: 10,
		// justifyContent: 'center'
	},
	AddMemberText: {
		fontSize: 18,
		color: 'rgba(46,125,246,1)',
		alignSelf: 'center',
		fontWeight: 'bold',
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupFilesListModal);
