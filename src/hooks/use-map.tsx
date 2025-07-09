'use client';

import { useCallback } from 'react';
import useSWR, { mutate } from 'swr';
import type { Coordinates } from '@/types/store';
import type { MapNaver } from '@/types/map';

export const INITIAL_CENTER: Coordinates = [37.5071156980651, 127.009873208557];
export const INITIAL_ZOOM = 17;

export const MAP_KEY = '/map';

const useMap = () => {
  const { data: map } = useSWR(MAP_KEY);

  const initializeMap = useCallback((map: MapNaver) => {
    mutate(MAP_KEY, map);
  }, []);

  const resetMapOptions = useCallback(() => {
    if (map && window.naver) {
      map.morph(new window.naver.maps.LatLng(...INITIAL_CENTER), INITIAL_ZOOM);
    }
  }, [map]);

  const getMapOptions = useCallback(() => {
    if (!map || !window.naver) {
      return { center: INITIAL_CENTER, zoom: INITIAL_ZOOM };
    }
    
    const mapCenter = map.getCenter();
    const center: Coordinates = [mapCenter.lat(), mapCenter.lng()];
    const zoom = map.getZoom();

    return { center, zoom };
  }, [map]);

  return {
    initializeMap,
    resetMapOptions,
    getMapOptions,
  };
};
export default useMap;