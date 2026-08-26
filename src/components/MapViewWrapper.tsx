import React from 'react';

export interface MapViewWrapperProps {
  coords: { latitude: number; longitude: number };
  title: string;
  description: string;
  onOpenMap: () => void;
}

declare const MapViewWrapper: React.FC<MapViewWrapperProps>;
export default MapViewWrapper;
