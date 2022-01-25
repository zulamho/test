import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import SearchTextInput from './SearchTextInput';

const SearchBar = ({searchValue, setSearchValue}) => {
	return (
		<View>
			<SearchTextInput
				value={searchValue}
				placeholder="Поиск"
				iconName="search"
				style={{
					height: 100,
					fontSize: 16,
					lineHeight: 20,
					alignSelf: 'center',
				}}
				onChange={(event) => setSearchValue(event.nativeEvent.text)}></SearchTextInput>
		</View>
	);
};

export default SearchBar;
