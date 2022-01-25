import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet, Easing } from 'react-native';

import {Animated as NativeAnimated} from 'react-native';

import mainColors from 'android_res/colors';

import ExtendDotsIcon from './ExtendDotsIcon';

import { connect } from 'react-redux';

import Icon from 'react-native-vector-icons/FontAwesome5';

import { store } from 'universal-library/redux/store';

const width = Dimensions.get('window').width;

import PdfIcon from 'android_res/svg/pdf.svg';
import FolderIcon from 'android_res/svg/folder.svg';
import ImageIcon from 'android_res/svg/image.svg';

import ProgressCircle from 'react-native-progress-circle';
import colors from 'android_res/colors';

import { filesListIcon } from '../functions/filesListIcon';
//import Animated from 'react-native-reanimated';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import LoadingStatus from 'universal-library/components/LoadingStatus';
import { setIsAnchorChoosingActive } from 'universal-library/redux/actions/anchors';
import GroupChangeModal from '../components/modals/GroupChangeModal';
import GroupOpenModal from '../components/modals/GroupOpenModal';
import GroupFilesListModal from './modals/GroupFilesListModal';

const mapStateToProps = ({ miscState, anchorsState }) => ({
	choosedAnchors: anchorsState.choosedAnchors,
	anchorsObject: anchorsState.anchorsObject,

	choosedAnchorsAmount: anchorsState.choosedAnchorsAmount,
	activeFilesStructure: miscState.activeFilesStructure,
	filesUploadingStatus: miscState.filesUploadingStatus,
	isAnchorChoosingActive: anchorsState.isAnchorChoosingActive,
});

const mapDispatchToProps = (dispatch) => {
	return {
		// setChoosedAnchorsAmount: (anchorsAmount) => dispatch({type: 'SET_CHOOSED_ANCHORS_AMOUNT', payload: anchorsAmount}),
		// setChoosedAnchors: (anchors, isNeedToDelete) =>
		// 	dispatch({
		// 		type: 'SET_CHOOSED_ANCHORS',
		// 		payload: {anchors, isNeedToDelete},
		// 	}),
	};
};

const GroupsList = ({ groupData, setCurrentGroupIndex, setIsVisible, setIsGroupFilesListModalVisible, isGroupFilesListModalVisible, isReadyToShow, filesUploadingStatus, setCurrentMenuIndex, activeFilesStructure, isAnchorChoosingActive, setChoosedAnchors, setChoosedDir, setIsFilesBottomSheetVisible, scrollY, navigation }) => {
	
	let isChoosingActive = false;
	if (activeFilesStructure === 'list' && isAnchorChoosingActive === true) {
		isChoosingActive = true;
	}
	const styles = activeFilesStructure === 'list' ? listStyles : cellStyles;
	const renderedItems = groupData.map((item, i) => {
			return (
				<TouchableOpacity
					key={i}
					onPress={() => {
						setCurrentGroupIndex(i)
						setIsGroupFilesListModalVisible(true)
					}}>
					<View
						style={{
							flexDirection: 'row',
							alignItems: activeFilesStructure === 'list' ? 'flex-start' : 'center',
						}}>
						{isChoosingActive && (
							<TouchableOpacity
								style={{
									...styles.isChoosedTip,
									backgroundColor: item.isChoosed ? mainColors.accentColor : '#00000000',
									borderWidth: item.isChoosed ? 0 : 2,
								}}
								onPress={() => {
									if (item.isChoosed === true) {
										item.isChoosed = false;
										console.log(item.isChoosed);
										setChoosedAnchors(item.id, true);
									} else {
										item.isChoosed = true;
										console.log(item.isChoosed);
										setChoosedAnchors({ [item.id]: item }, false);
									}
									if (item.isChoosed) {
										setChoosedAnchors(item.id, true);
									} else {
										setChoosedAnchors({ [item.id]: item }, false);
									}
								}}>
								<View style={{ alignItems: 'center', width: '100%' }}>{item.isChoosed ? <Icon name="check" size={14} color={'#FFFFFF'}></Icon> : <></>}</View>
							</TouchableOpacity>
						)}
						<View style={styles.element}>
							<View style={styles.contentContainer}>
								<Icon style={styles.elementIcon} name="user-friends" size={30} color={'#111111'}></Icon>
								<View
									style={{
										marginLeft: activeFilesStructure === 'list' ? 16 : 0,
									}}>
									<Text style={styles.elementText} numberOfLines={2}>
										{item.groupName}
									</Text>
								</View>
							</View>
							<TouchableOpacity
								onPress={() => {
									// setIsGroupChangeModalVisible(true);
									setCurrentGroupIndex(i)
									setIsVisible(true);
								}}>
								<ExtendDotsIcon containerStyle={styles.extendDotsContainer} />
							</TouchableOpacity>
						</View>
					</View>
				</TouchableOpacity>
			);
	}).reverse();
	return (
		<NativeAnimated.ScrollView
			overScrollMode={'always'}
			bounces={true}
			scrollEventThrottle={16}
			onScroll={
				// (e) => {
				// 	if (e.nativeEvent.velocity.y > 1 && isSortBarAppearingActivated === false && scrollY._value === 0) {
				// 		setIsSortBarHidingActivated(true);
				// 	} else if (e.nativeEvent.velocity.y < -1 && isSortBarHidingActivated === false && scrollY._value === 90) {
				// 		setIsSortBarAppearingActivated(true);
				// 	}
				// }
				NativeAnimated.event(
					[
						{
							nativeEvent: { contentOffset: { y: scrollY } },
						},
					],
					{ useNativeDriver: false },
				)
			}
			style={{
				width: width,
				flex: 1,
				backgroundColor: '#E5E5E5',
			}}>
			<View
				style={{
					flexDirection: 'row',
					flexWrap: 'wrap',
					flex: 1,
					width: width,
					paddingLeft: 16,
					paddingRight: 16,
					justifyContent: 'space-between',
				}}>
				{renderedItems}
			</View>
		</NativeAnimated.ScrollView>
		// </View>
	);
};
const cellStyles = StyleSheet.create({
	container: {
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: '#FFFFFF',
	},
	contentContainer: {
		flexDirection: 'column',
		alignItems: 'center',
		width: '100%',
	},
	elementIcon: {
		width: 40,
		height: 48,
	},
	extendDotsContainer: {
		position: 'absolute',
		bottom: 35,
		left: -20,
		height: 50,
		width: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	list: {
		backgroundColor: '#E5E5E5',
		width: width,
	},
	element: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 50,
		width: 160,
		height: 141,
		paddingTop: 16,
		paddingBottom: 16,
		paddingLeft: 24,
		paddingRight: 24,
		marginBottom: 8,
		marginRight: 8,
		marginLeft: 8,
		borderRadius: 16,
		backgroundColor: '#FFFFFF',
	},
	elementText: {
		color: 'black',
		fontSize: 16,
		lineHeight: 20,
		fontWeight: '500',
		textAlign: 'center',
		alignSelf: 'center',
	},
	elementStatusText: {
		color: '#00000040',
		fontSize: 12,
		lineHeight: 14,
		textAlign: 'center',
	},
});

const listStyles = StyleSheet.create({
	container: {
		alignItems: 'center',
		alignSelf: 'center',
		backgroundColor: '#FFFFFF',
	},
	contentContainer: {
		flexDirection: 'row',
		flex: 1,

		// backgroundColor: 'red',
	},
	elementIcon: {
		width: 40,
		height: 48,
	},
	extendDotsContainer: {
		height: 50,
		width: 50,
		alignItems: 'center',
		justifyContent: 'center',
	},
	list: {
		backgroundColor: '#E5E5E5',
		width: width,
	},
	element: {
		width: width - 32,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 50,
		paddingTop: 16,
		paddingBottom: 16,
		paddingLeft: 24,
		paddingRight: 24,
		marginBottom: 8,
		borderRadius: 16,
		backgroundColor: '#FFFFFF',
	},
	elementText: {
		marginRight: 29,
		color: 'black',
		fontSize: 16,
		lineHeight: 25,
		fontWeight: '500',
		marginBottom: 4,
	},
	elementStatusText: {
		color: '#00000040',
		fontSize: 12,
		lineHeight: 14,
	},
	isChoosedTip: {
		width: 30,
		height: 30,
		marginRight: 12,
		alignSelf: 'center',
		borderRadius: 20,
		flexDirection: 'row',
		borderColor: '#C4C4C4',
		alignItems: 'center',
	},
});

export default connect(mapStateToProps, mapDispatchToProps)(GroupsList);
