import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

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
  const mapEmbedUrl = `https://maps.google.com/maps?q=${coords.latitude},${coords.longitude}&z=15&output=embed`;

  return (
    <View style={styles.webMapContainer}>
      <iframe
        title={title}
        width="100%"
        height="100%"
        style={{ border: 0, borderRadius: 12 }}
        loading="lazy"
        allowFullScreen
        src={mapEmbedUrl}
      />
      <TouchableOpacity
        style={styles.mapOverlayBtn}
        onPress={onOpenMap}
        activeOpacity={0.85}
      >
        <Feather name="external-link" size={13} color="#FFFFFF" />
        <Text style={styles.mapOverlayBtnText}>Google Maps'te Aç</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  webMapContainer: {
    height: 240,
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#E2E8F0',
    marginTop: 8,
  },
  mapOverlayBtn: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 8,
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
