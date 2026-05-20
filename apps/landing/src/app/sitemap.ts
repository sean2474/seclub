// src/app/sitemap.ts
import fs from 'fs'
import path from 'path'
import type { MetadataRoute } from 'next'
import { wellnessData } from '@/const/wellness-detail'
import { getRoomCards } from '@/lib/room-infos'

const SITE_URL = 'https://seclub.kr'

/**
 * app 디렉토리에서 페이지 경로를 찾아 URL을 생성하는 함수
 */
const getPagePaths = (directoryPath: string, basePath = ''): string[] => {
  const excludePatterns = ['api', '[id]', '[slug]'] // 동적 라우트 및 제외할 패턴
  const pagePattern = /page\.(tsx)$/
  const items = fs.readdirSync(directoryPath)
  let paths: string[] = []

  // 페이지 파일이 있으면 현재 경로 추가
  if (items.some(item => pagePattern.test(item))) {
    paths.push(basePath)
  }

  // 하위 디렉토리 처리
  items.forEach(item => {
    const itemPath = path.join(directoryPath, item)
    if (fs.statSync(itemPath).isDirectory()) {
      // 제외 패턴에 해당하는 디렉토리는 건너뛰기
      if (excludePatterns.some((pattern) => item.includes(pattern))) {
        console.log("exclude", itemPath, item)
        return
      }
      
      // 재귀적으로 하위 디렉토리 경로 추가
      const childBasePath = basePath ? `${basePath}/${item}` : item
      const childPaths = getPagePaths(itemPath, childBasePath)
      paths = [...paths, ...childPaths]
    }
  })

  return paths
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appDirectory = path.join(process.cwd(), 'src', 'app')
  const pagePaths = getPagePaths(appDirectory)
  
  const urls: MetadataRoute.Sitemap = pagePaths.map(pagePath => ({
    url: pagePath ? `${SITE_URL}/${pagePath}` : SITE_URL,
    lastModified: new Date(),
    changeFrequency: pagePath === '' ? 'weekly' : 'monthly',
    priority: pagePath === '' ? 1.0 : 0.8,
  }))

  
  // Add wellness pages to sitemap
  wellnessData.forEach((wellness) => {
    urls.push({
      url: `${SITE_URL}/wellness/${wellness.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })
  
  // Add room pages to sitemap
  const roomData = await getRoomCards()
  roomData.forEach((room) => {
    urls.push({
      url: `${SITE_URL}/rooms/${room.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  })
  
  return urls
}
