import React from 'react';
import {View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, Modal} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import {chooseIcon} from '../../functions/extensionsProcessing';

const BottomSheetModal = ({anchors, currentMenuIndex, isVisible, setIsVisible, menuItems, isHeaderNeeded = true}) => {
	if (anchors.length == 0) {
		return <></>;
	}
	const iconStyle = {alignSelf: 'center', marginRight: 16};
	return (
		<Modal animationType="fade" transparent={true} statusBarTranslucent={true} visible={isVisible} onRequestClose={() => {}}>
			<TouchableWithoutFeedback
				onPress={() => {
					setIsVisible(false);
				}}>
				<View
					style={{
						backgroundColor: '#00000080',
						height: Dimensions.get('window').height,
						flexDirection: 'row',
					}}>
					<View style={{flexDirection: 'column', alignSelf: 'flex-end'}}>
						{isHeaderNeeded && (
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
									<View style={{flexDirection: 'row', flex: 1}}>
										{chooseIcon(27, 32, 29, 26, iconStyle, anchors[currentMenuIndex].type)}
										<View style={{flexDirection: 'column', alignSelf: 'center', flex: 1}}>
											<Text style={{fontSize: 14, paddingRight: 14}} numberOfLines={2} ellipsizeMode={'middle'}>
												{anchors[currentMenuIndex].name}
											</Text>
											<Text style={{fontSize: 12, color: '#00000040'}}>{anchors[currentMenuIndex].status}</Text>
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
						)}
						<View style={{flexDirection: 'column', alignSelf: 'flex-end'}}>{menuItems}</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

export default BottomSheetModal;
