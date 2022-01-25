import React from 'react';
import {TouchableOpacity, View, Text, StyleSheet} from 'react-native';
import colors from 'android_res/colors';

const StyledButton = ({title, onPress, isActive = true}) => (
	<TouchableOpacity onPress={() => onPress()}>
		<View style={{...styles.activateBtn, backgroundColor: isActive ? colors.accentColor : '#00000005', alignSelf: 'center'}}>
			<Text style={{...styles.activateBtnText, color: isActive ? '#FFFFFF' : '#00000010'}}>{title}</Text>
		</View>
	</TouchableOpacity>
);
const styles = StyleSheet.create({
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

		fontWeight: '600',

		flex: 1,
		textAlign: 'center',
	},
});

export default StyledButton;
