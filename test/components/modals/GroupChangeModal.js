import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	TextInput,
	Modal,
	Dimensions,
	KeyboardAvoidingView,
	Alert,
	Linking
} from "react-native";
import DocumentPicker from 'react-native-document-picker';
import {connect} from 'react-redux';

//import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from 'react-native-vector-icons/FontAwesome5';

import BackButton from '../BackButton';
import StyledButton from '../../components/StyletButton';
import StyledTextInput from '../../components/StyledTextInput';
import GroupPermisionModal from "./GroupPermisionsModal";

const mapStateToProps = ({userState}) => ({
	name: userState.name,
	lastname: userState.lastname,
});

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

const GroupChangeModal = ({ isVisible, setIsVisible, groupData, name, lastname}) => {

	const [newGroupName, setGroupName] = useState('');
	const [isGroupPermisionModalVisible, setIsGroupPermisionModalVisible] = useState(false);
	const user = {
		name,
		lastname,
	};
	
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
							Изменить группу
						</Text>
					</View>
				</View>
				<KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }}>
					<View style={styles.content}>
						<StyledTextInput upperPlaceholder={'Название группы'} placeholder={''} value={groupData.name} setValue={setGroupName}></StyledTextInput>
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
							// DocumentPicker.pickMultiple({
							// 	type: ['video/*', 'image/*'],
							// })
							// 	.then(async (results) => {
							// 		const arrayOfChoosedFiles = [];
							// 		const choosedFilesAmount = results.length;
							// 		const writeEmpty = async (current, amount) => {
							// 			if (current < amount) {
							// 				const extension = results[current].name.match(/\.[^/.]+$/)[0].replace(/./, '');
							// 				const isExists = await RNFetchBlob.fs.exists(`/storage/emulated/0/Android/quantguard/${results[current].name}`);
							// 				if (isExists === false) {
							// 					const newAnchor = {
							// 						name: results[current].name,
							// 						path: `/storage/emulated/0/Android/quantguard/${results[current].name}`,
							// 						isDir: false,
							// 						isAnchor: true,
							// 						status: '',
							// 						ctime: 0,
							// 						size: 0,
							// 						type: extension,
							// 						typePriority: 10,
							// 						isChoosed: false,
							// 						id: 'QGQGQGQGQGQGQGQGQGQGQGQGQGQGQG',
							// 					};
							// 					store.dispatch(addAnchor(newAnchor));
							// 				}
							// 				store.dispatch(setFilesUploadingStatus(`/storage/emulated/0/Android/quantguard/${results[current].name}`, 0));
							// 				arrayOfChoosedFiles.push(results[current]);
							// 				writeEmpty(current + 1, amount);

							// 				// });
							// 			} else {
							// 				return;
							// 			}
							// 		};
							// 		writeEmpty(0, choosedFilesAmount).then(() => {
							// 			encryptChoosedFiles(arrayOfChoosedFiles);
							// 		});
							// 	})
							// 	.catch((e) => { });
							Alert.alert("Скачать");
						}}>
							<View style={styles.contentContainer}>
								<Icon style={styles.icon} size={28} name="download"></Icon>
								<Text style={styles.text}>Загрузить файлы</Text>
							</View>
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
							Alert.alert("Вы точно уверены?");
						}}>
							<Text
							style={{
								alignSelf: 'center',
								fontSize: 18,
								lineHeight: 41,
								fontWeight: '700',
								color: '#984646',
							}}>
							Заархивировать группу
						</Text>
						</TouchableOpacity>

						<View style={styles.contentContainer}>
							<Text style={styles.text}>Участники группы</Text>
						</View>
						<TouchableOpacity onPress={() => {
							//Linking.openURL('content://com.android.contacts/contacts')
							console.log(groupData);
						}}>
							<View style={styles.contentContainer}>
								<Icon style={styles.AddMemberIcon} size={28} name="user-plus"></Icon>
								<Text style={styles.AddMemberText}>Добавить участников</Text>
							</View>
						</TouchableOpacity>
						<View style={{height: 290}}>
						<ScrollView >
								<AdminMember user={user} />
						</ScrollView>
						</View>
						<View style={styles.subContainer}>
							<StyledButton
								title={'Сохранить'}
								onPress={() => {
									Alert.alert("Сохранить");
								}}></StyledButton>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
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

export default connect(mapStateToProps)(GroupChangeModal);
