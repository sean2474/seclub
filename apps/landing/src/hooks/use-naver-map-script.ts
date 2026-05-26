"use client"

import { useEffect, useState } from "react"

const SCRIPT_ID = "naver-map-script"

/**
 * Lazily injects the Naver Maps SDK script. Pass `enabled=false` to defer
 * loading (e.g. until the host element is in view). Returns `true` once the
 * SDK is ready on `window.naver`.
 */
export function useNaverMapScript(enabled: boolean) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!enabled) return
    if (document.getElementById(SCRIPT_ID)) {
      setLoaded(true)
      return
    }
    const script = document.createElement("script")
    script.id = SCRIPT_ID
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`
    script.onload = () => setLoaded(true)
    document.head.appendChild(script)
  }, [enabled])

  return loaded
}
