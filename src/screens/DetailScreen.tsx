import React, { useState } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PharmacyDetailView from '../components/PharmacyDetailView';
import { DetailScreenProps } from '../types/navigation';

export default function DetailScreen({ route, navigation }: DetailScreenProps) {
  const { pharmacy, isFav: initialFav } = route.params;
  const [isFav, setIsFav] = useState<boolean>(initialFav || false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <PharmacyDetailView
        pharmacy={pharmacy}
        isFav={isFav}
        onToggleFavorite={() => setIsFav(!isFav)}
        showBackButton={true}
        onBack={() => navigation.goBack()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
