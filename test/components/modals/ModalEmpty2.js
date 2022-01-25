import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Text,
	TouchableOpacity,
	ScrollView,
	SafeAreaView,
	TextInput,
	Modal,
	Switch,
	Dimensions,
	KeyboardAvoidingView,
	Alert,
	Linking
} from "react-native";
import DocumentPicker from 'react-native-document-picker';

//import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Icon from 'react-native-vector-icons/FontAwesome5';

import BackButton from '../BackButton';
import StyledButton from '../StyletButton';
import StyledTextInput from '../StyledTextInput';

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

const AddMember = ({ user: { name, lastname } }) => {
	return (
		<TouchableOpacity onPress={() => {
			Alert.alert("Пользователь", name + lastname);
		}}>
			<View style={{ flexDirection: 'row', width: Dimensions.get('window').width - 32, backgroundColor: 'white', height: 80, alignSelf: 'center' }}>
				<View style={{ width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row', marginRight: 16 }}>
					<Text style={{ alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18 }}>
						{name.substr(0, 1)}
						{lastname.substr(0, 1)}
					</Text>
				</View>
				<View style={{ flexDirection: 'row' }}>
					<Text style={{ alignSelf: 'center', textAlign: 'left', color: 'black', fontSize: 16, width: 234 }}>
						{name} {lastname}
					</Text>
				</View>
			</View>
		</TouchableOpacity>
	);
};

const ModalEmpty2 = ({ isVisible, setIsVisible }) => {
	const name = "Эдуард";
	const lastname = "123";

	const [newGroupName, setGroupName] = useState('');
	const user = {
		name,
		lastname
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
							Разрешения
						</Text>
					</View>
				</View>
				<View
				contentContainerStyle={{alignItems: 'center'}}
				style={{
					backgroundColor: '#E6E6E6',
					width: width,
					alignSelf: 'flex-start',
				}}>
						<Text
							style={{
								
								fontSize: 10,
								lineHeight: 41,
								fontWeight: '700',
								marginLeft: 10,
							}}>
							ВОЗМОЖНОСТЬ МОДЕРАТОРА
						</Text>
				</View>
			<ScrollView
				contentContainerStyle={{alignItems: 'center'}}
				style={{
					backgroundColor: '#FFFFFF',
				}}>
				<Switcher title={'Добавление участников'} icon={'user-plus'}></Switcher>
				<Switcher title={'Изменения профиля группы'} icon={'edit'}></Switcher>
				<Switcher title={'Удаление участников'} icon={'user-minus'}></Switcher>
				<View
				contentContainerStyle={{alignItems: 'center'}}
				style={{
					backgroundColor: '#E6E6E6',
					width: width,
					alignSelf: 'flex-start',
				}}>
						<Text 
							style={{
								//alignSelf: 'flex-start',
								fontSize: 10,
								lineHeight: 41,
								fontWeight: '700',
								//width: width,
								marginLeft: 10,
							}}>
							СПИСОК МОДЕРАТОРОВ
						</Text>
				</View>
						<TouchableOpacity onPress={() => {
							//Linking.openURL('content://com.android.contacts/contacts')
							Alert.alert("Добавить участников");
						}}>
							<View style={styles.contentContainer}>
								<Icon style={styles.AddMemberIcon} size={28} name="user-plus"></Icon>
								<Text style={styles.AddMemberText}>Добавить модератора</Text>
							</View>
						</TouchableOpacity>
						<View style={{height: 290}}>
						<ScrollView >
								<AddMember user={user}></AddMember>
								<AddMember user={user}></AddMember>
								<AddMember user={user}></AddMember>
								<AddMember user={user}></AddMember>
						</ScrollView>
						</View>
						<Divider />
						<Divider />
						<Divider />
						<View style={styles.subContainer}>
							<StyledButton
								title={'Сохранить'}
								onPress={() => {
									Alert.alert("Сохранить");
								}}></StyledButton>
						</View>
			</ScrollView>
			</View>
		</Modal>
	);
};

const Switcher = ({title, icon, isEnabled, toggleIsEnabled}) => {
	return (
		<View style={{flexDirection: 'row', width: Dimensions.get('window').width - 32, backgroundColor: 'white', height: 44}}>
			<View style={{width: 48, height: 48, borderRadius: 24, alignSelf: 'center', alignItems: 'center', flexDirection: 'row'}}>
				<Icon name={icon} size={20}></Icon>
			</View>
			<View style={{flexDirection: 'row', justifyContent: 'space-between', flex: 1}}>
				<Text style={{alignSelf: 'center', textAlign: 'left', color: 'black', fontSize: 17}}>{title}</Text>
				<Switch trackColor={{false: '#767577', true: '#2E7DF638'}} thumbColor={isEnabled ? '#2E7DF6' : '#f4f3f4'} ios_backgroundColor="#3e3e3e" onValueChange={toggleIsEnabled} value={isEnabled} />
			</View>
		</View>
	);
};

const Divider = () => <View style={{flexDirection: 'row', width: Dimensions.get('window').width, backgroundColor: '#F7F7F7', height: 44}}></View>;

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

export default ModalEmpty2;
