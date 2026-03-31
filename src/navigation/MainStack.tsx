import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AgendaScreen from '../screens/Agenda/AgendaScreen';

const Stack = createStackNavigator();

export default function MainStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Agenda" component={AgendaScreen} />
        </Stack.Navigator>
    );
}
