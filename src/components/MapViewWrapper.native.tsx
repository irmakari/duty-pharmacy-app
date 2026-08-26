import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Feather } from '@expo/vector-icons';
import { COLORS } from '../constants/theme';

interface MapViewWrapperProps {
  coords: { latitude: number; longitude: number };
  title: string;
  description: string;
  onOpenMap: () => void;
}

export default function MapViewWrapper({
  coords,
  title,
  description,
  onOpenMap,
}: MapViewWrapperProps) {
  return (
    <View style={styles.mapContainer}>
      <MapView
        style={styles.mapView}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        scrollEnabled={false}
        zoomEnabled={true}
      >
        <Marker
          coordinate={{ latitude: coords.latitude, longitude: coords.longitude }}
          title={title}
          description={description}
          pinColor={COLORS.primary}
        />
      </MapView>

      <TouchableOpacity
        style={styles.mapOverlayBtn}
        onPress={onOpenMap}
        activeOpacity={0.85}
      >
        <Feather name="external-link" size={13} color="#FFFFFF" />
        <Text style={styles.mapOverlayBtnText}>Haritalar Uygulamasında Aç</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    marginTop: 8,
  },
  mapView: {
    width: '100%',
    height: '100%',
  },
  mapOverlayBtn: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  mapOverlayBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Poppins_500Medium',
  },
});
