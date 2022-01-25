import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import colors from 'android_res/colors';
import {TextInputMask} from 'react-native-masked-text';
const StyledTextInputProfile = ({value, setValue, upperPlaceholder, placeholder, color}) => {
	return (
		<View
			style={{
				backgroundColor: '#E5E5E5',
				height: 56,
				borderRadius: 10,
				marginBottom: 24,
			}}>
			<View style={{height: 0, paddingLeft: 16}}>
				<Text style={{fontSize: 12, color: color, textAlignVertical: 'bottom', height: 25.4}}>{upperPlaceholder}</Text>
			</View>
			<TextInputMask
				type={'custom'}
				options={{
					mask: '********************',
				}}
				maxLength={20}
				// keyboardType={'twitter'}

				autoFocus={true}
				value={value}
				onChange={(ev) => {
					const text = ev.nativeEvent.text;

					setValue(text.replace(/[0-9]+/g, ''));
				}}
				placeholder={placeholder}
				style={{
					textAlignVertical: 'bottom',
					paddingLeft: 16,
					borderBottomWidth: 2,
					borderColor: color,
					borderBottomLeftRadius: 10,
					borderBottomRightRadius: 10,

					fontSize: 16,

					flex: 1,
				}}></TextInputMask>
		</View>
	);
};

const styles = StyleSheet.create({});
export default StyledTextInputProfile;
