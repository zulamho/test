import React from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import {AppIcons} from 'android_res/svg/IconSet';
import mainColors from 'android_res/colors';

const BackButton = ({navigation, color = mainColors.accentColor, onPress = () => navigation.goBack()}) => {
	return (
		<TouchableOpacity
			onPress={() => {
				onPress();
			}}
			style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 16, paddingRight: 28, height: '100%'}}>
			<AppIcons name="back" width={24} height={24}></AppIcons>
		</TouchableOpacity>
	);
};

export default BackButton;
