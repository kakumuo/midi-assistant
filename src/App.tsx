import { StatusBar } from 'expo-status-bar';
import "@/global.css";
import { GluestackUIProvider } from "@/src/components/gluestack-ui-provider";
import { StyleSheet, Text, View } from 'react-native';
import { NavigationBar, NavigationOption } from './components/NavigationBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MainView } from './components/MainView';
import React from 'react';
import { PracticePage } from './pages/PracticePage';


const navOptions:NavigationOption[] = [
	{label: 'Practice', value: 'practice', target: <PracticePage />},
	{label: 'Drills', value: 'drills', target: <MainView><Text>Drills</Text></MainView>},
	{label: 'Sight Reading', value: 'sight-reading', target: <MainView><Text>Sight Reading</Text></MainView>}
]

export default function App() {
	const [curNavOption, setCurNavOption] = React.useState(navOptions[0].value)

	const handleNavSelect = (navVal:string) => {

	}

	return (
	<GluestackUIProvider mode="light">
		<SafeAreaView style={styles.container}>
			<NavigationBar navOptions={navOptions} curNavOption={curNavOption} onNavSelect={handleNavSelect} />
			{navOptions.find(option => option.value == curNavOption).target}
		</SafeAreaView>
	</GluestackUIProvider>
	);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
