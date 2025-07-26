"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HTMLAttributes, ReactNode } from "react";
import React, { useEffect, useRef, useState } from "react";
import { MapNaver } from "@/types/map";
import { Coordinates } from "@/types/store";
import { ScrollObserverManager } from "@/utils/scroll-observer";

// 원하는 초기값
const INITIAL_CENTER: Coordinates = [36.9319955987042, 126.293749897582];
const INITIAL_ZOOM = 16;

/** 지도 컴포넌트 Props */
type Props = {
  mapId?: string;
  onMapLoad?: (map: MapNaver) => void;
};

export function NaverMap({
  mapId = "map",
  onMapLoad,
}: Props) {
  const mapRef = useRef<MapNaver | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false); // 컴포넌트가 화면에 보이는지 여부
  const [scriptLoaded, setScriptLoaded] = useState(false); // 스크립트가 로드됐는지 여부

  // -----------------------
  // (1) Intersection Observer로 화면에 보이는지 감지
  // -----------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observerOptions = {
      root: null,
      rootMargin: '100px', // 화면에 보이기 100px 전에 미리 로드 시작
      threshold: 0,
    };

    const handleIntersection = () => {
      setIsVisible(true);
    };

    // Observer Manager가 없으면 직접 Observer 생성
    // ScrollObserverManager는 ScrollReveal 컴포넌트에서 사용하는 것과 동일
    try {
      const observerManager = ScrollObserverManager.getInstance();
      observerManager.observe(container, handleIntersection, observerOptions);
      
      return () => {
        observerManager.unobserve(container);
      };
    } catch (e) {
      // ScrollObserverManager를 찾을 수 없는 경우 직접 Observer 생성
      console.error('ScrollObserverManager를 찾을 수 없습니다:', e);
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(container);
        }
      }, observerOptions);
      
      observer.observe(container);
      return () => observer.disconnect();
    }
  }, []);

  // -----------------------
  // (2) 스크립트 로드 로직 (컴포넌트가 화면에 보일 때만)
  // -----------------------
  useEffect(() => {
    // 컴포넌트가 화면에 보일 때만 스크립트 로드
    if (!isVisible) return;
    
    // 이미 로드된 스크립트가 있으면 중복 추가하지 않도록 방어
    if (document.getElementById("naver-map-script")) {
      setScriptLoaded(true);
      return;
    }

    // <script> 태그를 동적으로 생성
    const script = document.createElement("script");
    script.id = "naver-map-script";
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`;
    script.onload = () => {
      setScriptLoaded(true); // 스크립트 로딩 완료
    };
    document.head.appendChild(script);

    return () => {
      // 필요하다면 언마운트 시 스크립트 제거 (일반적으로는 유지)
      // document.head.removeChild(script);
    };
  }, [isVisible]);

  // -----------------------
  // (3) 맵 초기화 로직
  // -----------------------
  useEffect(() => {
    // 스크립트가 로드되고, 컴포넌트가 화면에 보일 때만 지도 초기화
    if (!scriptLoaded || !isVisible) return;
    if (!window.naver) return;

    // 이미 맵이 만들어져 있다면 중복 생성 방지
    if (mapRef.current) return;
    
    // DOM 요소 확인
    const mapContainer = document.getElementById(mapId);
    if (!mapContainer) return;

    // 맵 옵션 설정
    const mapOptions = {
      center: new window.naver.maps.LatLng(...INITIAL_CENTER),
      zoom: INITIAL_ZOOM,
      minZoom: 9,
      scaleControl: false,
      mapDataControl: false,
      logoControlOptions: {
        position: window.naver.maps.Position.BOTTOM_LEFT,
      },
    };

    // 맵 인스턴스 생성 (약간의 지연을 줘서 DOM이 완전히 준비되도록 함)
    setTimeout(() => {
      try {
        // 맵 인스턴스 생성
        const map = new window.naver.maps.Map(mapId, mapOptions);

        // 마커 추가
        new window.naver.maps.Marker({
          position: new window.naver.maps.LatLng(36.9319955987042, 126.293749897582),
          map,
          // title: "퓨린 피부과의원",
          // icon: {
          //   url: "/map/map_pin.png",
          //   size: new window.naver.maps.Size(200, 50),
          //   scaledSize: new window.naver.maps.Size(200, 50),
          //   origin: new window.naver.maps.Point(0, 0),
          //   anchor: new window.naver.maps.Point(12, 37),
          // },
        });

        // Ref에 보관, 필요하면 콜백으로 알림
        mapRef.current = map;
        onMapLoad?.(map);
      } catch (error) {
        console.error('네이버 맵 초기화 오류:', error);
      }
    }, 100);
  }, [scriptLoaded, isVisible, mapId, onMapLoad]);

  // 맵 정리 함수
  useEffect(() => {
    return () => {
      try {
        // 맵 DOM 요소 참조 정리
        const mapDiv = document.getElementById(mapId);
        if (mapDiv) {
          // DOM 요소 초기화
          mapDiv.innerHTML = '';
        }
        
        // 맵 인스턴스 정리 시도
        if (mapRef.current) {
          // 명시적으로 null 할당 전에 destroy 호출
          try {
            // @ts-ignore - 네이버 맵 API에서는 destroy가 함수로 존재함
            mapRef.current.destroy();
          } catch (destroyError) {
            console.warn('맵 destroy 중 오류:', destroyError);
          }
          
          // 참조 정리
          mapRef.current = null;
        }
      } catch (error) {
        console.error('맵 정리 중 오류:', error);
      }
    };
  }, [mapId]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative"
    >
      {/* 로딩 표시 */}
      {isVisible && !scriptLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[--font]" />
        </div>
      )}
      <div
        id={mapId}
        className="w-full h-full"
        style={{
          visibility: scriptLoaded ? 'visible' : 'hidden',
        }}
      />
    </div>
  );
}
