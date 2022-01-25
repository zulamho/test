import React, {useState} from 'react';
import {StyleSheet, View, SafeAreaView, Text, TouchableOpacity, ScrollView, TextInput, Modal, Dimensions, KeyboardAvoidingView, Alert, StyledTextInput} from 'react-native';
import BackButton from '../BackButton';
import StyledButton from '../StyletButton';
import Icon from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';
import Toolbar from 'android_library/components/Toolbar';
import NdaBarIcon from '../../../res/svg/group/nda-Bar-Icon';
import SearchIcon from '../../../res/svg/group/search-Icon';
import SettingIcon from '../../../res/svg/group/settings-Icon';
import CreationBottomSheetNDA from './CreationBottomSheetNDA';
import GroupAddFiles from './GroupAddFiles';

import {AppIcons} from 'android_res/svg/IconSet';
import ExtendDotsIcon from '../ExtendDotsIcon';
import AnimatedSortBar from 'android_library/components/AnimatedSortBar';
import NotificationBell from '../NotificationBell';

const NDA = ({isVisible, setIsVisible, navigation, newGroupId, renderedChoosedContactsInfoTooltip, renderItems, choosedContacts, AdminMember, user}) => {
	const [isCreateFolderModalVisible, setIsCreateFolderModalVisible] = useState(false);
	const [isCreateBtnTapped, setIsCreateBtnTapped] = useState(false);
	const [groupAddFiles, setGroupAddFiles] = useState(false);
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
				<View style={{flexDirection: 'row', marginLeft: 0}}>
					<BackButton
						color={'black'}
						onPress={() => {
							setIsVisible(false);
						}}></BackButton>
					<Text
						style={{
							alignSelf: 'center',
							fontSize: 20,
							lineHeight: 41,
							fontWeight: '700',
						}}>
						NDA
					</Text>
				</View>
				<View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginLeft: 60}}>
					<NotificationBell
						containerStyle={{
							alignItems: 'center',
							flexDirection: 'row',
							paddingLeft: 12.5,
							paddingRight: 12.5,
							height: '100%',
						}}
						navigation={navigation}></NotificationBell>

					<TouchableOpacity
						onPress={() => {
							navigation.navigate('Search');
						}}
						style={{justifyContent: 'center', paddingLeft: 12.5, paddingRight: 12.5, height: '100%'}}>
						<AppIcons name={'search'} width={24} height={24}></AppIcons>
						{/* <Icon name={'search'} size={20}></Icon> */}
					</TouchableOpacity>

					<TouchableOpacity
						style={{
							justifyContent: 'center',
							paddingLeft: 12.5,
							paddingRight: 12.5,
							height: '100%',
						}}
						onPress={() => {
							setIsCreateBtnTapped(true);
						}}>
						{/* <AppIcons name={'dots'} width={24} height={24}></AppIcons> */}
						<ExtendDotsIcon opacity={1.0} containerStyle={{transform: [{rotate: '90deg'}]}}></ExtendDotsIcon>
					</TouchableOpacity>
				</View>
			</View>

			<SafeAreaView style={styles.container}>
				<ScrollView style={styles.scrollView}>
					<Text style={styles.text}>
						Настоящее Соглашение заключено между, именуемое в дальнейшем «Принимающая Сторона», в лице действующего на основании _с одной стороны, и далее именуемое «Раскрывающая Сторона», в лице, действующего на основании с другой стороны, вместе в дальнейшем именуемыми «Стороны», по
						отдельности – «Сторона», заключили настоящий Договор на нижеследующих условиях: Термины, применяемые в настоящем Соглашении, означают следующее: «Компания» – включает в себя «Цель соглашения» заключается в беспрепятственной передаче Конфиденциальной информации, касательно
						Компании, и нераспространении данной информации третьим лицам. Передача Конфиденциальной информации осуществляется с целью реализации сделки по привлечению финансового инвестора для Компании. «Конфиденциальная информация» означает все сведения, документы и информацию о
						Компании, передаваемые в соответствии с настоящим Соглашением, а также любые иные сообщения, сведения, ноу-хау, информацию и иные материалы, передаваемые одной Стороной другой Стороне, которые в каждом случае: (а) имеют Гриф конфиденциальности «Коммерческая тайна». В
						соответствии с Федеральным законом от 29 июля 2004 г. № 98-ФЗ «О коммерческой тайне» гриф «Коммерческая тайна» наносится с указанием ее обладателя (для юридических лиц - полное наименование и место нахождения);{' '}
					</Text>
					<StyledButton
						title={'Подписать'}
						onPress={() => {
							setGroupAddFiles(true);
						}}></StyledButton>
				</ScrollView>
			</SafeAreaView>

			<View>
				<CreationBottomSheetNDA setIsCreateFolderModalVisible={setIsCreateFolderModalVisible} isVisible={isCreateBtnTapped} setIsVisible={setIsCreateBtnTapped}></CreationBottomSheetNDA>
				<GroupAddFiles isVisible={groupAddFiles} newGroupId={newGroupId} setIsVisible={setGroupAddFiles} navigation={navigation} choosedContacts={choosedContacts} renderItems={renderItems} renderedChoosedContactsInfoTooltip={renderedChoosedContactsInfoTooltip}></GroupAddFiles>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	scrollView: {
		marginHorizontal: 20,
	},
	text: {
		fontSize: 20,
		paddingBottom: 16,
		paddingTop: 25,
	},
});

export default NDA;
