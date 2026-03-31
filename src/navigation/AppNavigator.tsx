import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import useAuthStore from '../store/useAuthStore';
import { View, ActivityIndicator } from 'react-native';

export default function AppNavigator() {
    const isToken = useAuthStore(state => state.isToken);
    const isReady = useAuthStore(state => state.isReady);
    const checkAuth = useAuthStore(state => state.checkAuth);

    useEffect(() => {
        checkAuth();
    }, []);

    if (!isReady) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#111827' }}>
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {isToken ? <MainStack /> : <AuthStack />}
        </NavigationContainer>
    );
}
