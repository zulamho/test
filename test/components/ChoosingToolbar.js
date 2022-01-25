import React, {useState} from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import Share from 'react-native-share';

import {store} from 'universal-library/redux/store';
import {setChoosedAnchors, setIsAnchorChoosingActive} from 'universal-library/redux/actions/anchors';
import RNFS from 'react-native-fs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ExtendDotsIcon from './ExtendDotsIcon';
import {AppIcons} from 'android_res/svg/IconSet';

const ChoosingToolbar = () => {
	const [anchorsForSend, setAnchorsForSend] = useState([]);
	const amountOfChoosedFiles = Object.keys(store.getState().anchorsState.choosedAnchors).length;
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				width: Dimensions.get('window').width,
				paddingLeft: 16,
				height: 56,
			}}>
			<View style={{flexDirection: 'row'}}>
				<TouchableOpacity
					onPress={() => {
						store.dispatch(setIsAnchorChoosingActive(false));
					}}
					style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 8.5, paddingRight: 32, height: '100%'}}>
					<AppIcons name={'close'} width={14} height={14}></AppIcons>
				</TouchableOpacity>

				<Text
					style={{
						alignSelf: 'center',
						fontSize: 20,
						lineHeight: 41,
						fontWeight: '700',
					}}>
					{`Выбрано: ${amountOfChoosedFiles}`}
				</Text>
			</View>
			<View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center'}}>
				<TouchableOpacity
					onPress={async () => {
						const choosedAnchors = store.getState().anchorsState.choosedAnchors;
						const filesId = Object.keys(choosedAnchors);
						const filesPaths = [];
						const filesForIterator = [];
						for (let i = 0; i < filesId.length; i++) {
							const extension = choosedAnchors[filesId[i]].type;
							if (/jpg/i.test(extension) === true) {
								filesForIterator.push(choosedAnchors[filesId[i]]);
							} else {
								filesPaths.push(`file://${choosedAnchors[filesId[i]].path}`);
								store.dispatch(setChoosedAnchors(filesId[i], true));
							}
						}
						const anchorsIterator = async (anchors, currentIndex, length, iterator) => {
							if (currentIndex < length) {
								const newPath = `/storage/emulated/0/Android/quantguard_backups/${anchors[currentIndex].name.replace('.jpg', '.png')}`;
								await RNFS.copyFile(anchors[currentIndex].path, newPath);
								store.dispatch(setChoosedAnchors(anchors[currentIndex].id, true));
								return anchorsIterator(anchors, currentIndex + 1, length, [...iterator, `file://${newPath}`]);
							} else {
								store.dispatch(setIsAnchorChoosingActive(false));
								if ([...iterator, ...filesPaths].length === 1) {
									Share.open({
										url: [...iterator, ...filesPaths][0],
										type: 'application/pdf',
										title: 'Поделиться',
										message: 'Файлы отправлены из приложения Quant Guard',
									});
								} else {
									Share.open({
										urls: [...iterator, ...filesPaths],
										type: 'application/pdf',
										title: 'Поделиться',
										message: 'Файлы отправлены из приложения Quant Guard',
									});
								}
							}
						};
						anchorsIterator(filesForIterator, 0, filesForIterator.length, []);
					}}
					style={{paddingLeft: 12.5, paddingRight: 12.5, height: '100%', justifyContent: 'center'}}>
					<AppIcons name={'send_black'} width={24} height={24}></AppIcons>
					{/* <Icon name="external-link-alt" size={20} regular></Icon> */}
				</TouchableOpacity>
				<TouchableOpacity
					onPress={() => {
						console.log(2);
					}}
					style={{paddingLeft: 12.5, paddingRight: 12.5, height: '100%', justifyContent: 'center'}}>
					<AppIcons name={'move_to_folder_black'} width={24} height={24}></AppIcons>
					{/* <Icon name="folder-open" size={20} regular></Icon> */}
				</TouchableOpacity>
				<TouchableOpacity
					style={{
						justifyContent: 'center',
						paddingLeft: 12.5,
						paddingRight: 12.5,
						height: '100%',
					}}
					onPress={() => {
						store.dispatch(setIsAnchorChoosingActive(store.getState().anchorsState.isAnchorChoosingActive ? false : true));
					}}>
					<ExtendDotsIcon opacity={1.0} containerStyle={{transform: [{rotate: '90deg'}]}}></ExtendDotsIcon>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default ChoosingToolbar;
