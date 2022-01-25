import React from 'react';
import {View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
import {AppIcons} from 'android_res/svg/IconSet';

import {store} from 'universal-library/redux/store';

const NotificationBell = ({containerStyle = {}, navigation}) => {
	const notifs = store.getState().miscState.localNotifications;
	let newNotifsAmount = 0;
	for (let i = 0; i < notifs.length; i++) {
		let notif = notifs[i];
		if (notif.isNew === true) {
			newNotifsAmount++;
		}
	}
	return (
		<TouchableOpacity
			style={{...containerStyle}}
			onPress={() => {
				navigation.navigate('Notifications');
			}}>
			{newNotifsAmount > 0 && (
				<View
					style={{
						zIndex: 100,
						position: 'absolute',
						backgroundColor: 'red',
						top: 18,
						right: 12,
						height: 8,
						width: 8,
						borderRadius: 20,
					}}></View>
			)}
			<View style={{zIndex: 90, alignSelf: 'center'}}>
				<AppIcons name={'notif_bell'} width={24} height={24}></AppIcons>
			</View>
			{/* <Icon style={{zIndex: 90, alignSelf: 'center'}} name="bell-o" size={20}></Icon> */}
		</TouchableOpacity>
	);
};

export default NotificationBell;
