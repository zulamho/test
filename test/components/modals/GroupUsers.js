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
import LoadingStatus from 'universal-library/components/LoadingStatus';
import {createAndSendNotification} from '../../functions/createAndSendNotification';
import {config} from '../../../../app_config';

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

const AdminMember = ({user: {name, lastname}}) => {
	return (
		<View style={{height: 50}}>
			<View style={{width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 16, borderWidth: 2, borderColor: '#4CD964'}}>
				<Text style={{alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18}}>
					{name.substr(0, 1)}
					{lastname.substr(0, 1)}
				</Text>
			</View>
			<View style={{flexDirection: 'column', textAlign: 'center', bottom: -5}}>
				<Text style={{color: 'black', fontSize: 10}}>{name}</Text>
				<Text style={{color: 'black', fontSize: 10}}>{lastname}</Text>
			</View>
		</View>
	);
};

const GroupUsers = ({isVisible, setIsVisible, name, lastname, choosedContacts, deleteAnchors, groupData, clearChoosedContacts}) => {
	const [ContactsListModalVisible, setIsContactsListModalVisible] = useState(false);
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
	const [anchors, setAnchors] = useState([]);
	const [newGroupName, setGroupName] = useState();
	const [groupMembers, setGroupMembers] = useState([]);

	const [isCreationStarted, setIsCreationStarted] = useState(false);

	const user = {
		name,
		lastname,
	};

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

	// useEffect(() => {
	// 	deleteAnchors();

	// 	axios.get(`${config.url}/getGroup/${groupData.groupId}`).then(async (res) => {
	// 				console.log(res.data.groupMembers);
	// 				// if (JSON.stringify(res.data.anchors) === JSON.stringify(anchors)){
	// 				addAnchors(res.data.anchors);
	// 				const rawGroupMembers = res.data.groupMembers;
	// 				const groupMembersArray = [];
	// 				for (const key in rawGroupMembers) {
	// 					if (Object.hasOwnProperty.call(rawGroupMembers, key)) {
	// 						const element = rawGroupMembers[key];
	// 						groupMembersArray.push(element)
	// 					}
	// 				}
	// 				setGroupMembers(groupMembersArray);
	// 				// 	console.log("dam");
	// 				// };
	// 				// const anchors = await showGroupAnchors(res.data.anchors);
	// 				// console.log("anchors",anchors);
	// })
	// });

	if (user) {
		return (
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
							<View style={{flexDirection: 'row', flexWrap: 'wrap'}}></View>
						</View>
					</View>
				</View>
			</KeyboardAvoidingView>
		);
	} else {
		return (
			<View style={{position: 'absolute', backgroundColor: 'white', height: Dimensions.get('window').height}}>
				<LoadingStatus status={'Создание'}></LoadingStatus>
			</View>
		);
	}
};

const styles = StyleSheet.create({});

export default connect(mapStateToProps, mapDispatchToProps)(GroupUsers);
