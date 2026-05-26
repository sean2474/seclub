"use client"

import React, { useEffect, useRef } from "react"
import { MapNaver } from "@/types/map"
import { Coordinates } from "@/types/store"
import { useInView } from "@/hooks/use-in-view"
import { useNaverMapScript } from "@/hooks/use-naver-map-script"

const INITIAL_CENTER: Coordinates = [36.9319955987042, 126.293749897582]
const INITIAL_ZOOM = 16

type Props = {
  mapId?: string
  onMapLoad?: (map: MapNaver) => void
}

export function NaverMap({ mapId = "map", onMapLoad }: Props) {
  const mapRef = useRef<MapNaver | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isVisible = useInView(containerRef)
  const scriptLoaded = useNaverMapScript(isVisible)

  // 맵 초기화
  useEffect(() => {
    if (!scriptLoaded || !isVisible) return
    if (!window.naver) return
    if (mapRef.current) return

    const mapContainer = document.getElementById(mapId)
    if (!mapContainer) return

    const mapOptions = {
      center: new window.naver.maps.LatLng(...INITIAL_CENTER),
      zoom: INITIAL_ZOOM,
      minZoom: 9,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: {
        position: window.naver.maps.Position.BOTTOM_LEFT,
      },
    }

    const timer = setTimeout(() => {
      try {
        const map = new window.naver.maps.Map(mapId, mapOptions)
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(...INITIAL_CENTER),
          map,
          title: "SE Club",
          icon: {
            url: "/logos/map_pin.png",
            size: new window.naver.maps.Size(50, 50),
            scaledSize: new window.naver.maps.Size(50, 50),
            origin: new window.naver.maps.Point(0, 0),
          },
        })
        mapRef.current = map
        onMapLoad?.(map)
      } catch (error) {
        console.error("네이버 맵 초기화 오류:", error)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [scriptLoaded, isVisible, mapId, onMapLoad])

  // 맵 정리
  useEffect(() => {
    return () => {
      try {
        const mapDiv = document.getElementById(mapId)
        if (mapDiv) mapDiv.innerHTML = ""
        if (mapRef.current) {
          try {
            mapRef.current.destroy()
          } catch (destroyError) {
            console.warn("맵 destroy 중 오류:", destroyError)
          }
          mapRef.current = null
        }
      } catch (error) {
        console.error("맵 정리 중 오류:", error)
      }
    }
  }, [mapId])

  return (
    <div ref={containerRef} className="w-full h-full relative">
      {isVisible && !scriptLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[--font]" />
        </div>
      )}
      <div
        id={mapId}
        className="w-full h-full"
        style={{ visibility: scriptLoaded ? "visible" : "hidden" }}
      />
    </div>
  )
}
