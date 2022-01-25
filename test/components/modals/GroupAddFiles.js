import React, {useState} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, ScrollView, TextInput, Modal, Dimensions, KeyboardAvoidingView, Alert, Linking, Animated} from 'react-native';
import BackButton from '../BackButton';
import StyledButton from '../StyletButton';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';
import {store} from 'universal-library/redux/store';
import GroupsFilesList from '../GroupsFilesList';
import {connect} from 'react-redux';
import GroupTwoAddFiles from './GroupTwoAddFiles';
import {AppIcons} from 'android_res/svg/IconSet';
import ExtendDotsIcon from '../ExtendDotsIcon';
import AnimatedSortBar from 'android_library/components/AnimatedSortBar';
import NotificationBell from '../NotificationBell';
import Toolbar from 'android_library/components/Toolbar';

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
	
			<View style={{width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row',borderWidth: 2, borderColor: '#4CD964',marginLeft: 4, marginRight:4}}>
					<Text style={{alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18}}>
						{name.substr(0, 1)}
						{lastname.substr(0, 1)}
					</Text>
				</View>
			<View style={{alignSelf: 'center', textAlign: 'center', bottom: -5}}>
				<Text style={{alignSelf: 'center',color: 'black', fontSize: 10}}>{name}</Text>
				<Text style={{alignSelf: 'center',color: 'black', fontSize: 10}}>{lastname}</Text>
			</View>
		</View>
	);
};

const GroupAddFiles = ({isVisible, setIsVisible, newGroupId,navigation, renderedChoosedContactsInfoTooltip, renderItems, choosedContacts, name, lastname}) => {
	const [anchors, setAnchors] = useState([]);
	const [scrollY, setScrollY] = useState(new Animated.Value(0));

	const [isCreationStarted, setIsCreationStarted] = useState(false);

	const [groupTwoAddFiles, setGroupTwoAddFiles] = useState(false);

	const user = {
		name,
		lastname,
	};
	// const user = {
	// 	name,
	// 	lastname,
	// };

	// const AdminMember = ({user: {name, lastname}}) => {
	// 	return (
	// 		<View style={{flexDirection: 'row', width: Dimensions.get('window').width - 32, backgroundColor: 'white', height: 80}}>
	// 			<View style={{width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 16}}>
	// 				<Text style={{alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18}}>{/* {name.substr(0, 1)}
	// 					{lastname.substr(0, 1)} */}</Text>
	// 			</View>
	// 			<View style={{flexDirection: 'row'}}>
	// 				<Text style={{alignSelf: 'center', textAlign: 'left', color: 'black', fontSize: 16, width: 234}}>
	// 					{name} {lastname}
	// 				</Text>
	// 			</View>
	// 			<Text style={{alignSelf: 'center', color: '#C4C4C4', fontSize: 11}}>Это Вы</Text>
	// 		</View>
	// 	);
	// };

	const member = () => {
		return (
			<View style={{height: 50}}>
				<View style={{width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignItems: 'center', flexDirection: 'row', marginRight: 20}}>
					<Text style={{alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18}}>NN</Text>
				</View>
				<View style={{flexDirection: 'column', textAlign: 'center', bottom: -5}}>
					<Text style={{color: 'black', fontSize: 10}}>No Name</Text>
				</View>
			</View>
		);
	};
	if (isCreationStarted === false) {
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
						<Toolbar title={'Файлы'} backButtonCondition={true} backButtonEffect={() => setIsVisible(false)} navigation={navigation}></Toolbar>
					</View>
				</View>

				<KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
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
								<AdminMember key={'admin'} user={user} />
								<View style={{flexDirection: 'row', flexWrap: 'wrap'}}>{renderedChoosedContactsInfoTooltip}</View>
							</View>
						</View>
					</View>
				</KeyboardAvoidingView>

				<View style={{}}>
					<View style={styles.subContainer}>
						{/* <StyledButton
								title="Добавить файлы"
								onPress={() => {
									DocumentPicker.pickMultiple({
										type: [DocumentPicker.types.pdf, DocumentPicker.types.xls, DocumentPicker.types.xlsx, DocumentPicker.types.docx, DocumentPicker.types.doc],
									}).then(async (results) => {
										await encryptChoosedFilesInGroup(results, (newAnchor) => {
											setAnchors([...anchors, newAnchor]);
											console.log('777', store.getState().groupState);
										});
									});
								}}
							/> */}

						<StyledButton
							title={'Добавить файлы'}
							onPress={() => {
								setGroupTwoAddFiles(true);
							}}></StyledButton>

						<Text style={{alignSelf: 'center'}}> или </Text>

						<TouchableOpacity
							onPress={() => {
								//Linking.openURL('content://com.android.contacts/contacts')
								Alert.alert('Добавить участников');
							}}>
							<View style={styles.contentContainer}>
								<Text style={styles.AddMemberText}>Переместить из папки</Text>
							</View>
						</TouchableOpacity>
						<GroupsFilesList scrollY={scrollY} isReadyToShow={true} anchors={anchors} />
					</View>
				</View>
				<View>
					<GroupTwoAddFiles isVisible={groupTwoAddFiles} setIsVisible={setGroupTwoAddFiles} newGroupId={newGroupId} renderedChoosedContactsInfoTooltip={renderedChoosedContactsInfoTooltip} choosedContacts={choosedContacts} AdminMember={AdminMember} navigation={navigation}></GroupTwoAddFiles>
				</View>
			</Modal>
		);
	}
};

const styles = StyleSheet.create({
	content: {
		flex: 1,
		margin: 25,
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

export default connect(mapStateToProps, mapDispatchToProps)(GroupAddFiles);
