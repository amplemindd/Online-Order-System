// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  */

// import { NewAppScreen } from '@react-native/new-app-screen';
// import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
// import {
//   SafeAreaProvider,
//   useSafeAreaInsets,
// } from 'react-native-safe-area-context';

// function App() {
//   const isDarkMode = useColorScheme() === 'dark';

//   return (
//     <SafeAreaProvider>
//       <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
//       <AppContent />
//     </SafeAreaProvider>
//   );
// }

// function AppContent() {
//   const safeAreaInsets = useSafeAreaInsets();

//   return (
//     <View style={styles.container}>
//       <NewAppScreen
//         templateFileName="App.tsx"
//         safeAreaInsets={safeAreaInsets}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
// });

// export default App;

// import React from 'react';
// import DashboardScreen from './src/screens/DashboardScreen';

// function App() {
//   return <DashboardScreen />;
// }

// export default App;

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RiderSplashScreen from './src/screens/RiderSplashScreen';
import TaazaMandiRiderLoginScreen from './src/screens/TaazaMandiRiderLoginScreen';
import TaazaMandiRegisterScreen from './src/screens/TaazaMandiRegisterScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import EarningsScreen from './src/screens/EarningsScreen';
import ProfileScreen from './src/screens/Profile';
import SettingsScreen from './src/screens/SettingScreen';
import SupportScreen from './src/screens/SupportScreen';

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  Dashboard: undefined;
  Profile: undefined;
  Settings: undefined;
  Support: undefined;
  Earnings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function SplashNavigation() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation]);

  return <RiderSplashScreen />;
}

function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" />

        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashNavigation} />
          <Stack.Screen name="Login" component={TaazaMandiRiderLoginScreen} />
          <Stack.Screen name="Register" component={TaazaMandiRegisterScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen
            name="Profile"
            children={({ navigation }) => (
              <ProfileScreen
                onGoBack={() => navigation.goBack()}
                onOpenEarnings={() => navigation.navigate('Earnings')}
                onOpenSupport={() => navigation.navigate('Support')}
                onLogout={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                }
              />
            )}
          />
          <Stack.Screen
            name="Settings"
            children={({ navigation }) => (
              <SettingsScreen
                onGoBack={() => navigation.goBack()}
                onOpenSupport={() => navigation.navigate('Support')}
                onLogout={() =>
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                }
              />
            )}
          />
          <Stack.Screen
            name="Support"
            children={({ navigation }) => (
              <SupportScreen onGoBack={() => navigation.goBack()} />
            )}
          />
          <Stack.Screen
            name="Earnings"
            children={({ navigation }) => (
              <EarningsScreen onBack={() => navigation.goBack()} />
            )}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;
