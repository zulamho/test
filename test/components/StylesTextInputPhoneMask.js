import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import colors from 'android_res/colors';
import {TextInputMask} from 'react-native-masked-text';
const StyledTextInputPhoneMask = ({value, setValue, isFullified, setIsFullified, upperPlaceholder, placeholder, 
	customStyle = {
		backgroundColor: '#E5E5E5',
		height: 56,
		borderRadius: 10,
		marginBottom: 24,
		// flex: 1
	}
}) => {
	return (
		<View
			style={customStyle}>
			<View style={{height: 0, paddingLeft: 16}}>
				<Text style={{fontSize: 12, color: isFullified ? '#4CD964' : colors.accentColor, textAlignVertical: 'bottom', height: 25.4}}>{upperPlaceholder}</Text>
			</View>
			<TextInputMask
				maxLength={18}
				type={'custom'}
				options={{
					mask: '+7 (999) 999-99-99',
				}}
				autoFocus={true}
				value={value}
				onChange={(ev) => {
					console.log(ev.nativeEvent.text)
					const text = ev.nativeEvent.text;
					text.length >= 18 ? setIsFullified(true) : setIsFullified(false);
					text.length !== 19 && setValue(text);
				}}
				keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
				placeholder={placeholder}
				style={{
					textAlignVertical: 'bottom',
					paddingLeft: 16,
					borderBottomWidth: 2,
					borderColor: isFullified ? '#4CD964' : colors.accentColor,
					borderBottomLeftRadius: 10,
					borderBottomRightRadius: 10,

					fontSize: 16,

					flex: 1,
				}}></TextInputMask>
		</View>
	);
};

const styles = StyleSheet.create({});
export default StyledTextInputPhoneMask;
