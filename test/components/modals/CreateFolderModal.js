import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Dimensions, TouchableOpacity, Modal} from 'react-native';

import RNFS from 'react-native-fs';

import {store} from 'universal-library/redux/store';
import {setDirsForEncrypt} from 'universal-library/redux/actions/anchors';

import colors from 'android_res/colors';
import BackButton from '../BackButton';
import StyledTextInput from '../StyledTextInput';
import StyledButton from '../StyletButton';

const CreateFolderModal = ({isVisible, setIsVisible}) => {
	const [newFolderName, setNewFolderName] = useState('');

	return (
		<Modal animationType="fade" transparent={false} statusBarTranslucent={true} visible={isVisible} onRequestClose={() => {}}>
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
					<View style={{flexDirection: 'row'}}>
						<View
							style={{
								alignSelf: 'center',
							}}>
							<BackButton color={'black'} onPress={() => setIsVisible(false)}></BackButton>
						</View>

						<Text
							style={{
								alignSelf: 'center',
								fontSize: 20,
								lineHeight: 41,
								fontWeight: '700',
							}}>
							Создание папки
						</Text>
					</View>
				</View>
				<KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
					<View style={styles.scrollView}>
						<View style={styles.scrollViewInnerContainer}>
							<StyledTextInput upperPlaceholder={'Имя папки'} placeholder={'Новая папка'} value={newFolderName} setValue={setNewFolderName}></StyledTextInput>
							<StyledButton
								title={'Создать папку'}
								onPress={() => {
									const path = `/storage/emulated/0/Android/${newFolderName}`;
									RNFS.mkdir(path).then(() => {
										store.dispatch(setDirsForEncrypt([{name: newFolderName, path}]));
										setIsVisible(false);
										setNewFolderName('');
										// setCurrentMenuIndex(null);
									});
								}}></StyledButton>
						</View>
					</View>
				</KeyboardAvoidingView>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	titleContainer: {
		marginLeft: 16,
		paddingBottom: 10,
		paddingTop: 12,
	},
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
	newMessageTip: {
		height: 8,
		width: 8,
		position: 'relative',
		backgroundColor: 'red',
		alignSelf: 'center',
		borderRadius: 4,
		marginLeft: 7,
	},
	activateBtn: {
		width: '100%',
		height: 48,

		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 16,
	},
	activateBtnText: {
		fontSize: 17,
		lineHeight: 22,
		color: '#FFFFFF',
		fontWeight: '600',

		flex: 1,
		textAlign: 'center',
	},
});

export default CreateFolderModal;
