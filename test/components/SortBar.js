import React from 'react';
import {View, Text, Dimensions, TouchableOpacity, Animated} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import RNBottomActionSheet from 'react-native-bottom-action-sheet';
import {store} from 'universal-library/redux/store';
import {setActiveFilesStructure} from 'universal-library/redux/actions/misc';

import mainColors from 'android_res/colors';
import SortChoosingBottomSheet from './SortChoosingBottomSheet';
import {AppIcons} from 'android_res/svg/IconSet';

const SortBar = ({setSortFilter, setIsSortChoosingBottomSheetVisible, sortFilterText}) => {
	const SheetView = RNBottomActionSheet.SheetView;
	return (
		<Animated.View
			style={{
				backgroundColor: '#E5E5E5',
				flexDirection: 'row',
				zIndex: -100,
				alignItems: 'center',
				width: Dimensions.get('window').width,
				height: 54,
				alignSelf: 'center',
				paddingTop: 22,
				paddingBottom: 14,
			}}>
			<View
				style={{
					height: 54,
					marginLeft: 24,
					alignSelf: 'center',
					flexDirection: 'row',
					justifyContent: 'space-between',
					width: Dimensions.get('window').width - 48,
				}}>
				<TouchableOpacity
					style={{height: '100%', justifyContent: 'center', paddingRight: 32}}
					onPress={() => {
						setIsSortChoosingBottomSheetVisible(true);
						// SheetView.Show({
						// 	items: [
						// 		{
						// 			title: 'По дате добавления',
						// 			value: 'date',
						// 		},
						// 		{title: 'По названию', value: 'name'},
						// 		{title: 'По размеру', value: 'size'},
						// 		{title: 'По типу', value: 'type'},
						// 	],
						// 	theme: 'light',
						// 	selection: 4,
						// 	onSelection: (i, value) => {
						// 		// console.log(index);
						// 		console.log(i, value);

						// setSortFilter(value);
						// 	},
						// 	onCancel: () => console.log('closed'),
						// });
					}}>
					<View style={{flexDirection: 'row'}}>
						<Text style={{fontWeight: '500', fontSize: 14}}>{sortFilterText}</Text>
						<Icon name="angle-down" size={20} style={{alignSelf: 'center', marginLeft: 8}}></Icon>
					</View>
				</TouchableOpacity>
				<View
					style={{
						width: 40,
						justifyContent: 'space-between',
						flexDirection: 'row',
					}}>
					<TouchableOpacity
						style={{justifyContent: 'center'}}
						onPress={() => {
							store.dispatch(setActiveFilesStructure('list'));
						}}>
						<AppIcons name="list" height={24} width={24} isActive={store.getState().miscState.activeFilesStructure === 'list' ? true : false}></AppIcons>
					</TouchableOpacity>
					<TouchableOpacity
						style={{justifyContent: 'center'}}
						onPress={() => {
							store.dispatch(setActiveFilesStructure('cells'));
						}}>
						<AppIcons name="cells" height={24} width={24} isActive={store.getState().miscState.activeFilesStructure === 'cells' ? true : false}></AppIcons>
					</TouchableOpacity>
				</View>
			</View>
		</Animated.View>
	);
};

export default SortBar;
