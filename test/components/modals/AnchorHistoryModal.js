import React, {useState, useEffect} from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions, Modal} from 'react-native';

import {store} from 'universal-library/redux/store';

import BackButton from 'android_library/components/BackButton';

import axios from 'axios';
import LoadingStatus from 'universal-library/components/LoadingStatus';
import colors from 'android_res/colors';
import { config } from '../../../../app_config';

const AnchorHistoryModal = ({item, isVisible, setIsVisible}) => {
	const [isRecievingFinished, setIsRecievingFinished] = useState(false);
	const [whoOpensThisAcnhor, setWhoOpensThisAcnhor] = useState([]);

	useEffect(() => {
		setIsRecievingFinished(false);
		return () => {
			// setIsRecievingFinished(false);
		};
	}, [isVisible]);

	if (isRecievingFinished === true) {
		const calculateDate = (timestamp) => {
			const todayDate = new Date();

			let todayMonth = String(todayDate.getMonth() + 1);
			let todayDay = String(todayDate.getDate());
			let todayYear = String(todayDate.getFullYear());

			if (todayMonth.length < 2) todayMonth = '0' + todayMonth;
			if (todayDay.length < 2) todayDay = '0' + todayDay;
			const today = `${todayDay}.${todayMonth}.${todayYear}`;
			const yesterday = `${todayDay - 1}.${todayMonth}.${todayYear}`;

			const date = new Date(timestamp);
			let month = String(date.getMonth() + 1);
			let day = String(date.getDate());
			let year = String(date.getFullYear());
			let hours = String(date.getHours());
			let minutes = String(date.getMinutes());

			if (month.length < 2) month = '0' + month;
			if (day.length < 2) day = '0' + day;
			if (hours.length < 2) hours = '0' + hours;
			if (minutes.length < 2) minutes = '0' + minutes;

			const anchorOpeningDate = `${day}.${month}.${year}`;

			if (anchorOpeningDate === today) {
				return `Сегодня, ${hours}:${minutes}`;
			} else if (anchorOpeningDate === yesterday) {
				return `Вчера, ${hours}:${minutes}`;
			} else {
				return `${day}.${month}.${year}`;
			}
		};
		let sortedWhoOpensThisAcnhor = [];
		if (whoOpensThisAcnhor.length !== 0 && whoOpensThisAcnhor[0] !== 'not owner') {
			sortedWhoOpensThisAcnhor = whoOpensThisAcnhor.sort((item_1, item_2) => {
				if (item_1.timestamp < item_2.timestamp) {
					return 1;
				} else if (item_1.timestamp > item_2.timestamp) {
					return -1;
				}
			});
		} else if (whoOpensThisAcnhor[0] === 'not owner') {
			sortedWhoOpensThisAcnhor = [{}];
		}
		const renderList = sortedWhoOpensThisAcnhor.map((item, i) => {
			if (whoOpensThisAcnhor[0] !== 'not owner') {
				return (
					<View key={i} style={{marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}} key={item.timestamp + i}>
						<View style={{width: 48, height: 48, backgroundColor: '#C4C4C4', borderRadius: 24, alignItems: 'center', flexDirection: 'row', marginRight: 16}}>
							<Text style={{alignSelf: 'center', textAlign: 'center', width: 48, color: 'white', fontSize: 18}}>
								{item.openerName.substr(0, 1)}
								{item.openerLastname.substr(0, 1)}
							</Text>
						</View>
						<Text style={{alignSelf: 'center', alignItems: 'flex-start', textAlign: 'left', flex: 1}}>
							{item.openerName} {item.openerLastname}
						</Text>
						<Text style={{alignSelf: 'center', opacity: 0.4}}>{calculateDate(item.timestamp)}</Text>
					</View>
				);
			} else {
				return (
					<View key={i} style={{marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'center'}} key={item.name}>
						<Text style={{alignSelf: 'center', alignItems: 'flex-start', textAlign: 'left', fontSize: 22, textAlign: 'center', fontWeight: 'bold', color: colors.errorColor, flex: 1}}>У вас нет доступа к истории этого файла так как вы не являетесь его создателем</Text>
					</View>
				);
			}
		});
		return (
			<Modal key={'modal'} animationType="fade" transparent={true} statusBarTranslucent={false} visible={isVisible} onRequestClose={() => {}}>
				<View
					style={{
						flexDirection: 'column',
						flex: 1,
						justifyContent: 'space-between',
						backgroundColor: 'white',
						height: Dimensions.get('window').height,
						width: Dimensions.get('window').width,
					}}>
					<View
						style={{
							width: Dimensions.get('window').width,
							height: 56,
						}}>
						<View style={{flexDirection: 'row'}}>
							<View
								style={{
									alignSelf: 'center',
								}}>
								<BackButton color={'black'} onPress={() => setIsVisible(false)}></BackButton>
							</View>

							<Text
								style={{
									alignSelf: 'center',
									fontSize: 20,
									lineHeight: 41,
									fontWeight: '700',
								}}>
								История открытий якоря
							</Text>
						</View>
					</View>
					<ScrollView style={styles.scrollView}>
						<View style={styles.scrollViewInnerContainer}>{renderList}</View>
					</ScrollView>
				</View>
			</Modal>
		);
	} else {
		axios.post(`${config.url}/getInfoAboutFile`, {fileId: item.id}).then((fileBody) => {
			console.log('FILEBODY', fileBody.data);
			if (fileBody.data.userToken === store.getState().userState.userToken) {
				axios
					.post(`${config.url}/recieveHistory`, {
						fileId: fileBody.data.fileId,
					})
					.then((body) => {
						console.log('BODY', body.data);
						setWhoOpensThisAcnhor(body.data);
						setIsRecievingFinished(true);
					});
			} else {
				setWhoOpensThisAcnhor(['not owner']);
				setIsRecievingFinished(true);
			}
		});
		return (
			<Modal key={'modal-loading'} animationType="fade" transparent={true} statusBarTranslucent={false} visible={isVisible} onRequestClose={() => {}}>
				<View
					style={{
						flexDirection: 'column',

						justifyContent: 'space-between',
						backgroundColor: 'white',
						height: Dimensions.get('window').height,
						width: Dimensions.get('window').width,
					}}>
					<View
						style={{
							width: Dimensions.get('window').width,
							height: 56,
						}}>
						<View style={{flexDirection: 'row'}}>
							<View
								style={{
									alignSelf: 'center',
								}}>
								<BackButton color={'black'} onPress={() => setIsVisible(false)}></BackButton>
							</View>

							<Text
								style={{
									alignSelf: 'center',
									fontSize: 20,
									lineHeight: 41,
									fontWeight: '700',
								}}>
								История открытий якоря
							</Text>
						</View>
					</View>
					<View
						style={{
							paddingLeft: 24,
							paddingRight: 24,
							backgroundColor: 'white',
							height: '100%',
							alignItems: 'center',
						}}>
						{/* <View style={styles.scrollViewInnerContainer}> */}
						<LoadingStatus></LoadingStatus>
						{/* </View> */}
					</View>
				</View>
			</Modal>
		);
	}
};

const styles = StyleSheet.create({
	titleContainer: {
		marginLeft: 16,
		paddingBottom: 10,
		paddingTop: 12,
	},
	scrollView: {
		paddingLeft: 24,
		paddingRight: 24,
		backgroundColor: 'white',
		height: '100%',
	},
	scrollViewInnerContainer: {marginTop: 24, flex: 1},
	newMessageTip: {
		height: 8,
		width: 8,
		position: 'relative',
		backgroundColor: 'red',
		alignSelf: 'center',
		borderRadius: 4,
		marginLeft: 7,
	},
});

export default AnchorHistoryModal;
