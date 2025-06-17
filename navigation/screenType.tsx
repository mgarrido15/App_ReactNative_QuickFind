import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { User } from '../models/User';
import { Company } from '../models/Company';

export type RootStackParamList = {
    Login: undefined;
    Home: { user: User; companyId?: string; productId?: string };
};

export type TabParamList = {
    Home: { user: User };
    Companies: { user: User };
    Create: { user: User };
    ManageCompanies: { user: User };
    Cart: { user: User };
    Profile: { user: User };
    ReserveProduct : { company: Company; user: User};
    Map: { user: User; companyId?: string; productId?: string }; 
};

export type screenProps = NativeStackScreenProps<RootStackParamList>;