import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { User } from '../models/User';

export type RootStackParamList = {
    Login: undefined;
    Home: {user: User};    
    Profile: {user: User};
    };

export type screenProps = NativeStackScreenProps<RootStackParamList>;