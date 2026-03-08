import 'react-native-url-polyfill/auto'; 
import React from 'react';
import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import '@react-native-async-storage/async-storage';

import Login from './src/pages/Login';
import Dashboard from './src/pages/Dashboard';
import LiveCamera from './src/pages/LiveCamera';
import DetectionLogs from './src/pages/DetectionLogs';
import DeviceManagement from './src/pages/DeviceManagement';
import UserManagement from './src/pages/UserManagement';

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <StatusBar style="auto" />
            <Stack.Navigator 
                initialRouteName="Login"
                screenOptions={{
                    headerStyle: { backgroundColor: '#f4511e' },
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="LiveCamera" component={LiveCamera} options={{ title: 'Live Detection' }} />
                <Stack.Screen name="DetectionLogs" component={DetectionLogs} options={{ title: 'Detection Logs' }} />
                <Stack.Screen name="DeviceManagement" component={DeviceManagement} options={{ title: 'Manage Devices' }} />
                <Stack.Screen name="UserManagement" component={UserManagement} options={{ title: 'Manage Users' }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

registerRootComponent(App);