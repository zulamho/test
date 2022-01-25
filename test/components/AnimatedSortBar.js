import React from 'react';

import SortBar from 'android_library/components/SortBar';

import {Animated} from 'react-native';

const AnimatedSortBar = ({scrollY, setIsSortChoosingBottomSheetVisible, sortFilterText, setSortFilter}) => {
	const height = scrollY.interpolate({
		inputRange: [0, 60, 90, 100000],
		outputRange: [53, 23, 8, 8],
	});
	const translateY = scrollY.interpolate({
		inputRange: [0, 60, 90, 100000],
		outputRange: [0, -28, -45, -45],
	});
	const opacity = scrollY.interpolate({
		inputRange: [0, 60, 90, 100000000],
		outputRange: [1, 0, 0, 0],
	});
	const scrollAnimationStyles = {
		opacity: 1,
		height: 53,
		// transform: [{translateX: 0}, {translateY: translateY}],
	};

	return (
		<Animated.View
			style={{
				...scrollAnimationStyles,
				zIndex: 100,
				// backgroundColor: '#E5E5E500',
			}}>
			<SortBar setIsSortChoosingBottomSheetVisible={setIsSortChoosingBottomSheetVisible} sortFilterText={sortFilterText} setSortFilter={setSortFilter}></SortBar>
		</Animated.View>
	);
};

export default AnimatedSortBar;
