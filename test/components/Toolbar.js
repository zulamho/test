import React from 'react';
import {View, Text, Dimensions, TouchableOpacity} from 'react-native';
import {store} from 'universal-library/redux/store';
import {setIsAnchorChoosingActive} from 'universal-library/redux/actions/anchors';

import Icon from 'react-native-vector-icons/FontAwesome';
import BackButton from './BackButton';
import NotificationBell from './NotificationBell';
import ExtendDotsIcon from './ExtendDotsIcon';
import ChoosingToolbar from './ChoosingToolbar';
import {AppIcons} from 'android_res/svg/IconSet';
import {color} from 'react-native-reanimated';

const Toolbar = ({title, backButtonCondition = false, backButtonEffect, newGroupId, addAnchor, navigation}) => {
	if (store.getState().anchorsState.isAnchorChoosingActive === false) {
		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					paddingLeft: 16,
					width: Dimensions.get('window').width,
					height: 56,
				}}>
				<View style={{flexDirection: 'row'}}>
					{backButtonCondition && (
						<View
							style={{
								alignSelf: 'center',
							}}>
							<BackButton navigation={navigation} onPress={() => backButtonEffect()} color={'black'}></BackButton>
						</View>
					)}
					<Text
						style={{
							alignSelf: 'center',
							fontSize: 20,
							lineHeight: 41,
							fontWeight: '700',
							width: 158,
						}}>
						{title}
					</Text>
				</View>
				<View style={{flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginLeft: 0}}>
					<NotificationBell
						containerStyle={{
							alignItems: 'center',
							flexDirection: 'row',
							paddingLeft: 12.5,
							paddingRight: 12.5,
							height: '100%',
						}}
						navigation={navigation}></NotificationBell>

					<TouchableOpacity
						onPress={() => {
							console.log(newGroupId);
						}}
						style={{justifyContent: 'center', paddingLeft: 12.5, paddingRight: 12.5, height: '100%'}}>
						<AppIcons name={'search'} width={24} height={24}></AppIcons>
						{/* <Icon name={'search'} size={20}></Icon> */}
					</TouchableOpacity>

					<TouchableOpacity
						style={{
							justifyContent: 'center',
							paddingLeft: 12.5,
							paddingRight: 12.5,
							height: '100%',
						}}
						onPress={() => {
							store.dispatch(setIsAnchorChoosingActive(store.getState().anchorsState.isAnchorChoosingActive ? false : true));
						}}>
						{/* <AppIcons name={'dots'} width={24} height={24}></AppIcons> */}
						<ExtendDotsIcon opacity={1.0} containerStyle={{transform: [{rotate: '90deg'}]}}></ExtendDotsIcon>
					</TouchableOpacity>
				</View>
			</View>
		);
	} else return <ChoosingToolbar newGroupId={newGroupId} addAnchor={addAnchor}></ChoosingToolbar>;
};

export default Toolbar;
