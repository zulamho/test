import React, {useState} from 'react';
import {View, TextInput, Text, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

const SearchTextInput = (props) => {
	const [isActivated, setIsActivated] = useState(false);
	const handleActivation = (event) => {
		setIsActivated(event.nativeEvent.text.length !== 0);
		props.onChange(event);
	};
	return (
		<View
			style={{
				flexDirection: 'row',
				alignItems: 'center',
				height: 36,
				backgroundColor: 'rgba(118, 118, 128, 0.08)',
				width: Dimensions.get('window').width - 32,
				borderRadius: 10,
				marginTop: 10,
				marginBottom: 10,
			}}>
			<Icon name={props.iconName} size={14} style={{marginLeft: 10, marginRight: 10, color: '#00000036'}}></Icon>

			<TextInput onChange={handleActivation} placeholder={props.placeholder} style={props.style} {...props}></TextInput>
		</View>
	);
};

export default SearchTextInput;
