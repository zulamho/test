import React from 'react';
import {View, Text, TextInput, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Modal} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

// import {modalsIconTypeChooser} from '../../functions/modalsIconTypeChooser';

const AccessTunningModal = ({item, isVisible, setIsVisible, setCurrentMenuIndex}) => {
	if (item === undefined) {
		return <></>;
	}

	let whoOpensThisAcnhor = [
		{name: 'Алексей', lastname: 'Брунов', timestamp: 'Сегодня, 18:34'},
		{name: 'Борис', lastname: 'Сорин', timestamp: '26.10.2020'},
		{name: 'Алексей', lastname: 'Брунов', timestamp: 'Сегодня, 18:34'},
		{name: 'Борис', lastname: 'Сорин', timestamp: '26.10.2020'},
		{name: 'Алексей', lastname: 'Брунов', timestamp: 'Сегодня, 18:34'},
	];

	const renderList = whoOpensThisAcnhor.map((item, i) => {
		return (
			<View style={{marginBottom: 12, flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', height: '100%', marginRight: 18}} key={item.name}>
				<View style={{width: 48, height: 48, borderRadius: 24, backgroundColor: '#C4C4C4', alignSelf: 'center', flexDirection: 'row'}}>
					<Text style={{alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18}}>
						{item.name.substr(0, 1)}
						{item.lastname.substr(0, 1)}
					</Text>
				</View>

				<Text style={{alignSelf: 'center', alignItems: 'center', textAlign: 'center', fontSize: 10}}>{item.name}</Text>
				<Text style={{alignSelf: 'center', alignItems: 'center', textAlign: 'center', fontSize: 10}}>{item.lastname}</Text>
			</View>
		);
	});

	return (
		<Modal animationType="fade" transparent={true} statusBarTranslucent={true} visible={isVisible} onRequestClose={() => {}}>
			<TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
				<View
					style={{
						backgroundColor: '#00000080',
						height: Dimensions.get('window').height,
						flexDirection: 'row',
					}}>
					<View style={{flexDirection: 'column', alignSelf: 'flex-end'}}>
						<TouchableWithoutFeedback onPress={() => {}}>
							<View
								style={{
									backgroundColor: 'white',
									height: 68,
									width: Dimensions.get('window').width,
									flexDirection: 'row',
									justifyContent: 'space-between',
									paddingTop: 18,
									paddingBottom: 18,
									paddingLeft: 24,
									paddingRight: 16,
									alignItems: 'center',
								}}>
								<View style={{flexDirection: 'row'}}>
									{/* {modalsIconTypeChooser(item.type)} */}
									<View style={{flexDirection: 'column', alignSelf: 'center'}}>
										<Text style={{fontSize: 14}}>{item.name}</Text>
										<Text style={{fontSize: 12, color: '#00000040'}}>{item.status}</Text>
									</View>
								</View>
								<TouchableOpacity onPress={() => setIsVisible(false)}>
									<View style={{backgroundColor: 'rgba(118, 118, 128, 0.12)', width: 30, height: 30, borderRadius: 15, flexDirection: 'column', alignItems: 'center'}}>
										<View style={{alignItems: 'center', flexDirection: 'row', height: '100%'}}>
											<Icon name={'times'} size={20} color={'#00000040'} style={{}}></Icon>
										</View>
									</View>
								</TouchableOpacity>
							</View>
						</TouchableWithoutFeedback>
						<View style={{backgroundColor: 'white', width: Dimensions.get('window').width, height: 27, alignItems: 'center', flexDirection: 'row'}}>
							<Text style={{backgroundColor: '#76768012', width: '100%', height: '100%', paddingLeft: 24, alignSelf: 'center', lineHeight: 26}}>Настройки доступа</Text>
						</View>
						<View style={{width: Dimensions.get('window').width, backgroundColor: 'white', alignItems: 'center'}}>
							<TextInput style={{backgroundColor: '#F7F7F7', width: Dimensions.get('window').width - 32, height: 56, marginTop: 24, marginBottom: 24, borderRadius: 5}}></TextInput>
							<View style={{width: Dimensions.get('window').width - 48, marginBottom: 24}}>
								<Text style={{fontSize: 18, fontWeight: 'bold', marginBottom: 12}}>У кого есть доступ</Text>
								<View style={{height: 78, flexDirection: 'row'}}>{renderList}</View>
							</View>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default AccessTunningModal;
