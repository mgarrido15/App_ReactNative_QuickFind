import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { User } from '../models/User';

export type RootStackParamList = {
    Login: undefined;
    Home: { user: User };
};

export type TabParamList = {
    Home: { user: User };
    Companies: { user: User }; // Cambiar de undefined a { user: User }
    Create: { user: User }; // Cambiar de undefined a { user: User }
    Notifications: { user: User }; // Cambiar de undefined a { user: User }
    Profile: { user: User };
};

export type screenProps = NativeStackScreenProps<RootStackParamList>;