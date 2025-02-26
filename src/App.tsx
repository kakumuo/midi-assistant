import { StatusBar } from 'expo-status-bar';
import "@/global.css";
import { GluestackUIProvider } from "@/src/components/ui/gluestack-ui-provider";
import { StyleSheet, Text, View } from 'react-native';
import { NavigationBar, NavigationOption } from './components/NavigationBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainView } from './components/MainView';
import React from 'react';
import { PracticePage } from './pages/PracticePage';
import { Box } from './components/ui/box';


const navOptions:NavigationOption[] = [
	{label: 'Practice', value: 'practice', target: <PracticePage />},
	{label: 'Drills', value: 'drills', target: <Box style={{alignItems: 'center', justifyContent: 'center'}}><Text>Drills</Text></Box>},
	{label: 'Sight Reading', value: 'sight-reading', target: <Box style={{alignItems: 'center', justifyContent: 'center'}}><Text>Sight Reading</Text></Box>}
]

export default function App() {
	const [curNavOption, setCurNavOption] = React.useState(navOptions[0].value)

	const handleNavSelect = (navVal:string) => {
		setCurNavOption(navVal)
	}

	return (
	<GluestackUIProvider mode="light">
		<Box style={styles.container}>
			<NavigationBar navOptions={navOptions} curNavOption={curNavOption} onNavSelect={handleNavSelect} />
			{navOptions.find(option => option.value == curNavOption).target}
		</Box>
	</GluestackUIProvider>
	);
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
	marginTop: 16,
	marginBottom: 16,
	flex: 1,
	borderColor: 'black', borderStyle: 'solid',
    backgroundColor: '#fff',
  },
});
