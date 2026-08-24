import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Pharmacy } from './pharmacy';

export type RootStackParamList = {
  HomeScreen: undefined;
  DetailScreen: {
    pharmacy: Pharmacy;
    isFav: boolean;
  };
};

export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeScreen'>;
export type DetailScreenProps = NativeStackScreenProps<RootStackParamList, 'DetailScreen'>;
