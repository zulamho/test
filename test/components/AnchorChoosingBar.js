import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';

import {store} from 'universal-library/redux/store';
import {setIsAnchorChoosingActive, setChoosedAnchors} from 'universal-library/redux/actions/anchors';

import Icon from 'react-native-vector-icons/dist/FontAwesome';

import mainColors from 'android_res/colors';

const AnchorChoosingBar = ({navigation}) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				paddingLeft: 16,
				paddingRight: 16,
				marginBottom: 14,
				justifyContent: 'space-between',
			}}>
			<TouchableOpacity
				onPress={() => {
					const anchorsArray = store.getState().anchorsState.anchors;
					const allAnchors = {};
					for (let i = 0; i < anchorsArray.length; i++) {
						const item = anchorsArray[i];
						allAnchors[item.id] = item;
					}
					store.dispatch(setChoosedAnchors(allAnchors, false));
				}}>
				<Text style={{lineHeight: 22, fontSize: 17, color: mainColors.accentColor}}>Выбрать всё</Text>
			</TouchableOpacity>
			<TouchableOpacity
				onPress={() => {
					const anchorsArray = store.getState().anchorsState.choosedAnchors;
					const keys = Object.keys(anchorsArray);
					for (let i = 0; i < keys.length; i++) {
						store.dispatch(setChoosedAnchors(keys[i], true));
					}
					store.dispatch(setIsAnchorChoosingActive(false));
				}}>
				<Text
					style={{
						lineHeight: 22,
						fontSize: 17,
						color: mainColors.accentColor,
						fontWeight: '600',
					}}>
					Отменить
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default AnchorChoosingBar;
