import React from 'react';
import {View} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AppIcons} from 'android_res/svg/IconSet';

const ExtendDotsIcon = ({containerStyle, opacity = 0.3}) => {
	return (
		<View style={containerStyle}>
			<View
				style={{
					flexDirection: 'row',
					alignItems: 'center',
					width: 20,
					height: 20,
					justifyContent: 'space-around',
					transform: [{rotate: '90deg'}],
					opacity,
				}}>
				<AppIcons name={'dots'} width={24} height={24}></AppIcons>
			</View>
		</View>
	);
};

export default ExtendDotsIcon;
