import React, {useState} from 'react';
import {View, Text, TextInput, StyleSheet, KeyboardAvoidingView, Platform, Dimensions, TouchableOpacity, Modal} from 'react-native';

import RNFS from 'react-native-fs';

import {store} from 'universal-library/redux/store';
import {modifyAnchorsObject, removeFromAnchorsSendedFromUsers, deleteFromFavoriteAnchors, setDirsForEncrypt} from 'universal-library/redux/actions/anchors';
import axios from 'axios';
import colors from 'android_res/colors';
import BackButton from '../BackButton';
import StyledTextInput from '../StyledTextInput';
import StyledButton from '../StyletButton';
import {props} from 'bluebird';
import { config } from '../../../../app_config';

const RenameModal = ({item, isVisible, setIsVisible, setCurrentMenuIndex}) => {
	const [newFileName, setNewFileName] = useState('');

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
							<BackButton
								color={'black'}
								onPress={() => {
									setIsVisible(false);
									setNewFileName('');
								}}></BackButton>
						</View>

						<Text
							style={{
								alignSelf: 'center',
								fontSize: 20,
								lineHeight: 41,
								fontWeight: '700',
							}}>
							{item.name}
						</Text>
					</View>
				</View>
				<KeyboardAvoidingView behavior={'padding'} style={{flex: 1}}>
					<View style={styles.scrollView}>
						<View style={styles.scrollViewInnerContainer}>
							<StyledTextInput upperPlaceholder={'Имя файла'} placeholder={'Новое имя'} value={newFileName} setValue={setNewFileName}></StyledTextInput>
							<StyledButton
								title={'Переименовать'}
								onPress={() => {
									const path = item.path;
									const newPath = item.path.replace(item.name, `${newFileName}.${item.type}`);

									RNFS.moveFile(path, newPath).then(() => {
										if (store.getState().anchorsState.favoriteAnchors[item.name] !== undefined) {
											store.dispatch(deleteFromFavoriteAnchors(item.name));
										}
										axios.post(`${config.url}/getInfoAboutFileOwner`, {fileId: item.id, userToken: store.getState().userState.userToken}).then((body) => {
											const sendedAnchorsList = store.getState().anchorsState.anchorsSendedFromUsers[body.data.userId];
											const files = sendedAnchorsList;
											console.log('files', files);
											if (files !== undefined && files.length !== 0) {
												const cleanedFiles = files.filter((file) => {
													console.log(file.fileId);
													console.log(item.id);
													if (file.path === path) {
														console.log('FILE', file);
														file.path = newPath;
														file.filename = `${newFileName}.${item.type}`;
														return file;
													} else {
														return file;
													}
												});
												store.dispatch(removeFromAnchorsSendedFromUsers(body.data.userId, cleanedFiles));
												console.log('cleanedFiles', cleanedFiles);
											}
										});
										store.dispatch(modifyAnchorsObject(item.path.replace(`/${item.name}`, ''), item.id, ['path', 'name'], {path: newPath, name: `${newFileName}.${item.type}`}));
										setIsVisible(false);
										setCurrentMenuIndex(null);
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

export default RenameModal;
