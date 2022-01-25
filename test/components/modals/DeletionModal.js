import React from 'react';
import {View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Modal} from 'react-native';

import RNFS from 'react-native-fs';
import axios from 'axios';
import {store} from 'universal-library/redux/store';
import {deleteFromAnchorsObject, removeFromAnchorsSendedFromUsers, removeManyFromAnchorsSendedFromUsers} from 'universal-library/redux/actions/anchors';

import colors from 'android_res/colors';
import { config } from '../../../../app_config';

const DeletionModal = ({message, item, isVisible, setIsVisible, setCurrentMenuIndex}) => {
	return (
		<Modal animationType="fade" transparent={true} statusBarTranslucent={true} visible={isVisible} onRequestClose={() => {}}>
			<TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
				<View
					style={{
						backgroundColor: '#00000080',
						height: Dimensions.get('window').height,
						flexDirection: 'row',
					}}>
					<View style={{flexDirection: 'column', alignSelf: 'center', width: Dimensions.get('window').width, height: 96, backgroundColor: 'white', paddingTop: 23, paddingBottom: 23, paddingRight: 16, paddingLeft: 16}}>
						<Text style={{width: '100%', fontSize: 14, opacity: 0.6, flexWrap: 'wrap'}} textBreakStrategy={'simple'}>
							{message}
						</Text>
						<View style={{flexDirection: 'row', alignSelf: 'flex-end', justifyContent: 'space-around', width: 185}}>
							<TouchableOpacity
								onPress={() => {
									console.log(item);
									// RNFS.exists();
									RNFS.exists(item.path)
										.then((isExists) => {
											if (isExists && item.isAnchor) {
												axios.post(`${config.url}/getInfoAboutFileOwner`, {fileId: item.id, userToken: store.getState().userState.userToken}).then((body) => {
													const sendedAnchorsList = store.getState().anchorsState.anchorsSendedFromUsers[body.data.userId];
													const files = sendedAnchorsList;
													if (files !== undefined && files.length !== 0) {
														let cleanedFiles;
														if (item.isAnchor) {
															cleanedFiles = files.filter((file) => {
																console.log('item', item);
																if (file.path !== item.path) {
																	return file;
																}
															});
														}
														store.dispatch(removeFromAnchorsSendedFromUsers(body.data.userId, cleanedFiles));
														console.log('cleanedFiles', cleanedFiles);
													}
													RNFS.unlink(item.path).then((value) => {
														console.log(`Файл ${item.name} успешно удален`);
														// store.dispatch(deleteFromAnchorsObject(item.path, item.id));
														setIsVisible(false);
														setCurrentMenuIndex(null);
													});
													if (item.isAnchor === true) store.dispatch(deleteFromAnchorsObject(item.path.replace(`/${item.name}`, ''), item.id));
												});
											} else if (item.isDir) {
												const sendedAnchorsList = store.getState().anchorsState.anchorsSendedFromUsers;
												const files = sendedAnchorsList;
												if (files !== undefined && Object.keys(files).length !== 0) {
													let cleanedFiles = {};
													if (item.isDir) {
														const usersIdKeys = Object.keys(files);
														for (let usersIdKeysIndex = 0; usersIdKeysIndex < usersIdKeys.length; usersIdKeysIndex++) {
															const userFilesArray = files[usersIdKeys[usersIdKeysIndex]];
															for (let filesIdIndex = 0; filesIdIndex < userFilesArray.length; filesIdIndex++) {
																const file = userFilesArray[filesIdIndex];
																if (file !== undefined && file.path !== undefined && item.path !== file.path.replace('/' + file.filename, '')) {
																	console.log(123, cleanedFiles[usersIdKeys]);
																	console.log(file);
																	if (cleanedFiles[usersIdKeys] !== undefined) {
																		cleanedFiles[usersIdKeys] = [...cleanedFiles[usersIdKeys], file];
																	} else {
																		cleanedFiles[usersIdKeys] = [file];
																	}
																}
															}
														}
													}
													console.log('cleanedFiles', cleanedFiles);
													store.dispatch(removeManyFromAnchorsSendedFromUsers(cleanedFiles));
												}
												RNFS.unlink(item.path).then((value) => {
													console.log(`Файл ${item.name} успешно удален`);
													setIsVisible(false);
													setCurrentMenuIndex(null);
												});
												if (item.isDir === true) store.dispatch(deleteFromAnchorsObject(item.path.replace(`/${item.name}`, ''), null));
											} else {
												store.dispatch(deleteFromAnchorsObject(item.path.replace(`/${item.name}`, ''), item.id));
												setIsVisible(false);
												setCurrentMenuIndex(null);
											}
										})
										.catch((e) => console.log(e));
								}}>
								<Text style={{fontWeight: '500', color: colors.errorColor}}>УДАЛИТЬ</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									setIsVisible(false);
								}}>
								<Text style={{fontWeight: '500', color: colors.accentColor}}>ОТМЕНИТЬ</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default DeletionModal;
