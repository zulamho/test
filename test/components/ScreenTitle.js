import React from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import {store} from 'universal-library/redux/store';
import {setIsAnchorChoosingActive} from 'universal-library/redux/actions/anchors';

import mainColors from 'android_res/colors';

const ScreenTitle = ({title, isRightButtonNeeded = true, rightButtonText = 'Выбрать'}) => {
	return (
		<View
			style={{
				flexDirection: 'row',
				justifyContent: 'space-between',
				width: Dimensions.get('window').width - 32,
			}}>
			<Text
				style={{
					alignSelf: 'flex-start',
					fontSize: 34,
					lineHeight: 41,
					fontWeight: '700',
				}}>
				{title}
			</Text>
			{isRightButtonNeeded && store.getState().anchorsState.isAnchorChoosingActive === false && (
				<TouchableOpacity
					style={{
						justifyContent: 'center',
					}}
					onPress={() => {
						store.dispatch(setIsAnchorChoosingActive(store.getState().anchorsState.isAnchorChoosingActive ? false : true));
					}}>
					<Text
						style={{
							color: mainColors.accentColor,
							alignSelf: 'center',
							fontSize: 17,
							lineHeight: 22,
							fontWeight: '600',
						}}>
						{rightButtonText}
					</Text>
				</TouchableOpacity>
			)}
		</View>
	);
};

export default ScreenTitle;
