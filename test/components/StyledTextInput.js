import React from 'react';
import {TextInput, View, Text, StyleSheet} from 'react-native';
import colors from 'android_res/colors';

const StyledTextInput = ({value, setValue, upperPlaceholder, placeholder}) => {
	return (
		<View
			style={{
				backgroundColor: '#E5E5E5',
				height: 56,
				borderRadius: 10,
				marginBottom: 24,
			}}>
			<View style={{height: 0, paddingLeft: 16}}>
				<Text style={{fontSize: 12, color: colors.accentColor, textAlignVertical: 'bottom', height: 25.4}}>{upperPlaceholder}</Text>
			</View>
			<TextInput
				value={value}
				onChangeText={(text) => {
					setValue(text);
				}}
				placeholder={placeholder}
				style={{
					textAlignVertical: 'bottom',
					paddingLeft: 16,
					borderBottomWidth: 2,
					borderColor: colors.accentColor,
					borderBottomLeftRadius: 10,
					borderBottomRightRadius: 10,

					fontSize: 16,

					flex: 1,
				}}></TextInput>
		</View>
	);
};

const styles = StyleSheet.create({});
export default StyledTextInput;
