import React, { useEffect, useState } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	Modal,
	Dimensions,
	KeyboardAvoidingView,
	Alert,
	Animated,
} from "react-native";
import DocumentPicker from 'react-native-document-picker';
import {connect} from 'react-redux';

//import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from 'react-native-vector-icons/FontAwesome5';

import BackButton from '../BackButton';
import StyledButton from '../StyletButton';
import StyledTextInput from '../StyledTextInput';
import GroupPermisionModal from "./GroupPermisionsModal";
import axios from 'axios';
import { store } from "universal-library/redux/store";
import ContactsListModal from "./ContactsListModal";
import { showGroupAnchors } from "../../functions/showAcnhorsSubFunctions";
import { useIsFocused } from "@react-navigation/native";
import encryptChoosedFilesInGroup from "../../functions/encryptChoosedFilesInGroup";
import { addAnchors } from "universal-library/redux/actions/group";
import { deleteAnchors } from "universal-library/redux/actions/group";
import GroupsFilesBottomSheet from "../GroupsFilesBottomSheet";
import GroupsFilesList from "../GroupsFilesList";
import { config } from "../../../../app_config";

const mapStateToProps = ({userState, anchorsState, miscState, intentsState}) => ({
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
});

const mapDispatchToProps = (dispatch) => {
	return {
		addAnchor: (anchor) => dispatch({type: 'ADD_ANCHOR', payload: anchor}),
		deleteAnchors: () => dispatch(deleteAnchors()),
		addAnchors: (anchors) => dispatch(addAnchors(anchors)),
	};
};

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const AdminMember = ({user: {name, lastname}}) => {
	return (
		<View style={{flexDirection: 'row', width: Dimensions.get('window').width - 32, backgroundColor: 'white', height: 80}}>
			<View style={{width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 16}}>
			<Text style={{alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18}}>
					{name.substr(0, 1)}
					{lastname.substr(0, 1)}
				</Text>
			</View>
			<View style={{flexDirection: 'row'}}>
			<Text style={{alignSelf: 'center', textAlign: 'left', color: 'black', fontSize: 16, width: 234}}>
					{name} {lastname}
				</Text>
			</View>
			<Text style={{alignSelf: 'center', color: '#C4C4C4', fontSize: 11}}>Это Вы</Text>
		</View>
	);
};

const renderGroupMembers = (groupMembers) => {
	return groupMembers.map(({givenName, familyName}) => {
		return (
			<View style={{flexDirection: 'row', width: Dimensions.get('window').width - 32, backgroundColor: 'white', height: 80}}>
				<View style={{width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 16}}>
				<Text style={{alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18}}>
						{givenName.substr(0, 1)}
						{familyName.substr(0, 1)}
					</Text>
				</View>
				<View style={{flexDirection: 'row'}}>
				<Text style={{alignSelf: 'center', textAlign: 'left', color: 'black', fontSize: 16, width: 234}}>
						{givenName} {familyName}
					</Text>
				</View>
			</View>
		);
	})
};

const GroupOpenModal = ({ isVisible, setIsVisible, groupData, name, lastname, addAnchor, addAnchors, deleteAnchors, navigation }) => {

	const [newGroupName, setGroupName] = useState();
	const [isGroupPermisionModalVisible, setIsGroupPermisionModalVisible] = useState(false);
	const [scrollY, setScrollY] = useState(new Animated.Value(0));
	const [currentMenuIndex, setCurrentMenuIndex] = useState(null);
	// const [anchors, setAnchors] = useState([]);
	const [groupMembers, setGroupMembers] = useState([]);
	const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
	const [isFilesBottomSheetVisible, setIsFilesBottomSheetVisible] = useState(false);
	const [ContactsListModalVisible, setIsContactsListModalVisible] = useState(false);
	const user = {
		name,
		lastname,
	};

	useEffect(() => {
		deleteAnchors();
		console.log('groupData', groupData);
		setGroupName(groupData.groupName);
		axios.get(`${config.url}/getGroup/${groupData.groupId}`).then(async (res) => {
					console.log(res.data.groupMembers);
					// if (JSON.stringify(res.data.anchors) === JSON.stringify(anchors)){
					addAnchors(res.data.anchors);
					const rawGroupMembers = res.data.groupMembers;
					const groupMembersArray = [];
					for (const key in rawGroupMembers) {
						if (Object.hasOwnProperty.call(rawGroupMembers, key)) {
							const element = rawGroupMembers[key];
							groupMembersArray.push(element)
						}
					}
					setGroupMembers(groupMembersArray);
					// 	console.log("dam");
					// };
					// const anchors = await showGroupAnchors(res.data.anchors);
					// console.log("anchors",anchors);
	})
	},[isVisible]);

	// useEffect(() => {
	// 	axios.get(`${config.url}/createGroup`).then((res) => {
	// 	getGroupMembers();
	// 	console.log(getGroupMembers);
	// 	return () => { };
	// });

	return (
		<Modal animationType="fade" transparent={false} statusBarTranslucent={false} visible={isVisible} onRequestClose={() => { }}>
			<View
				style={{
					flexDirection: 'column',
					marginTop: 20,
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
					<View style={{ flexDirection: 'row' }}>
						<View
							style={{
								alignSelf: 'center',
							}}>
							<BackButton 
								navigation={navigation}
								color={'black'}
								onPress={() => {
									// setAnchors([]);
									console.log('1 store.getState().groupState.anchors 1',store.getState().groupState.anchors);
									deleteAnchors();
									console.log('2 store.getState().groupState.anchors 2',store.getState().groupState.anchors);
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
							Группа
						</Text>
					</View>
				</View>
				<KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
					<View style={styles.content}>
						<StyledTextInput upperPlaceholder={'Название группы'} placeholder={''} value={newGroupName} setValue={setGroupName}></StyledTextInput>
						<TouchableOpacity onPress={() => {
							//Linking.openURL('content://com.android.contacts/contacts')
							Alert.alert("Соглашение");
						}}>
							<View style={styles.contentContainer}>
								<Icon style={styles.icon} size={28} name="file-alt"></Icon>
								<Text style={styles.text}>Шаблон соглашения</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {
							Alert.alert("Скачать");
						}}>
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {
							setIsGroupPermisionModalVisible(true);
						}}>
							<View style={styles.contentContainer}>
								<Icon style={styles.icon} size={28} name="user-cog"></Icon>
								<Text style={styles.text}>Модераторы</Text>
							</View>
							</TouchableOpacity>
						
							<TouchableOpacity onPress={() => {
							DocumentPicker.pickMultiple({
								type: [DocumentPicker.types.pdf, DocumentPicker.types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.docx, DocumentPicker.types.doc],
							})
								.then(async (results) => {
									await encryptChoosedFilesInGroup(results, addAnchor, async () => {
										console.log("store.getState().groupState", store.getState().groupState);
										// getGroup/${groupData.groupId}
										await axios.put(`${config.url}/updateGroup`, {updateGroupInfo:{anchors:store.getState().groupState.anchors}, groupId:groupData.groupId})
										console.log("файл записан");
									});
									
								})						
						}}>
							<View style={styles.contentContainer}>
								<Icon style={styles.icon} size={20} name="download"></Icon>
								<Text style={styles.text}>Добавить файл</Text>
							</View>
							</TouchableOpacity>

							<View style={styles.filesContainer}>
						<GroupsFilesList scrollY={scrollY} isReadyToShow={true} anchors={store.getState().groupState.anchors} setCurrentMenuIndex={setCurrentMenuIndex} setIsFilesBottomSheetVisible={setIsFilesBottomSheetVisible}/>
						</View>

						<View style={styles.contentContainer}>
							<Text style={styles.text}>Участники группы</Text>
						</View>
						<TouchableOpacity
								onPress={() => {
									setIsContactsListModalVisible(true);
								}}>
								<View style={styles.contentContainer}>
									<Icon style={styles.AddMemberIcon} size={28} name="user-plus"></Icon>
									<Text style={styles.AddMemberText}>Добавить участников</Text>
								</View>
							</TouchableOpacity>
						<ScrollView persistentScrollbar={true} style={{maxHeight: 100}}>
								<AdminMember user={user} />
								{renderGroupMembers(groupMembers)}
						</ScrollView>
						<View style={styles.subContainer}>
							<StyledButton
								title={'Сохранить'}
								onPress={async () => {
									await axios.put(`${config.url}/updateGroup`, {updateGroupInfo:{groupName:newGroupName , groupMembers:groupMembers}, groupId:groupData.groupId})
									// navigation.goback()
									deleteAnchors();
									setIsVisible(false);
								}}></StyledButton>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
			{/* <ContactsListModal isVisible={ContactsListModalVisible} setIsVisible={setIsContactsListModalVisible} navigation={navigation}></ContactsListModal> */}
			<GroupsFilesBottomSheet anchors={store.getState().groupState.anchors} isVisible={isFilesBottomSheetVisible} currentMenuIndex={currentMenuIndex} setCurrentMenuIndex={setCurrentMenuIndex} setIsVisible={setIsFilesBottomSheetVisible} navigation={navigation}/>
			<GroupPermisionModal isVisible={isGroupPermisionModalVisible} setIsVisible={setIsGroupPermisionModalVisible}></GroupPermisionModal>
		</Modal>
	);
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
		fontSize: 16,
	},
	AddMemberIcon: {
		marginRight: 10,
		color: "rgba(46,125,246,1)",
	},
	AddMemberText: {
		fontSize: 16,
		color: "rgba(46,125,246,1)",
	},
	subContainer: {
		position: 'absolute',
		bottom: width - 350,
		alignSelf: 'center',
		width: Dimensions.get('window').width * 0.9,
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupOpenModal);
