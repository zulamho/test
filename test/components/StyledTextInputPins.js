import React from 'react';
import {TextInput, View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions} from 'react-native';
import colors from 'android_res/colors';

import Icon from 'react-native-vector-icons/FontAwesome';

const PinElement = ({condition, styles}) => {
	return (
		<View style={styles.pinPlace}>
			{condition ? (
				<Text style={styles.pinNumber}>-</Text>
			) : (
				<View style={{marginTop: 4}}>
					<Icon name="circle" size={8} />
				</View>
			)}
		</View>
	);
};

const StyledTextInputPins = ({code, animatedStyles}) => {
	return (
		<>
			<Animated.View style={{...styles.input, ...animatedStyles.animatedInputStyle}}>
				<View
					style={{
						position: 'relative',
						right: 0,
						left: 0,
						width: 120,
						height: 18,
						flexDirection: 'row',
						justifyContent: 'space-between',
					}}>
					<PinElement condition={code.substring(0, 1) === ''} styles={styles}></PinElement>
					<PinElement condition={code.substring(1, 2) === ''} styles={styles}></PinElement>
					<PinElement condition={code.substring(2, 3) === ''} styles={styles}></PinElement>
					<PinElement condition={code.substring(3, 4) === ''} styles={styles}></PinElement>
				</View>
			</Animated.View>
			<Animated.View
				style={{
					alignSelf: 'flex-start',
					marginLeft: 16,
					marginTop: 4,
					opacity: animatedStyles.errorWarningMessageOpacity,
				}}>
				<Text
					style={{
						fontSize: 14,
						lineHeight: 17,
						color: colors.errorColor,
					}}>
					Неверный код
				</Text>
			</Animated.View>
		</>
	);
};

const styles = StyleSheet.create({
	title: {
		fontSize: 24,
		fontWeight: '700',
		lineHeight: 28,
		marginBottom: 8,
	},
	label: {
		fontSize: 14,
		fontWeight: '400',
		lineHeight: 16.71,
		color: '#00000070',
	},
	input: {
		position: 'relative',
		paddingLeft: 16,
		paddingBottom: 15,
		paddingTop: 15,
		paddingRight: 16,
		width: 343,
		height: 48,
		backgroundColor: 'rgba(118, 118, 128, 0.06)',

		borderBottomWidth: 2,
		borderRadius: 10,
		alignItems: 'center',
	},
	pinNumber: {
		color: colors.transculentTextColor,
		textAlign: 'center',
		fontSize: 24,
		position: 'relative',
		lineHeight: 32,
		height: 24,
		bottom: 10,
	},
	pinPlace: {
		height: 18,
		width: 20,
		borderBottomColor: '#22334490',
	},
});

export default StyledTextInputPins;
