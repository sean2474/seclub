import { ReactNode } from "react";

/**
 * **텍스트** 형식을 강조 스타일로 변환
 * 예: "이것은 **강조** 텍스트입니다" → ["이것은 ", <span>강조</span>, " 텍스트입니다"]
 */
export function parseHighlight(text: string): ReactNode {
  if (!text) return null;
  
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      const content = part.slice(2, -2);
      return (
        <span key={index} className="text-green-900 font-semibold">
          {content}
        </span>
      );
    }
    return part;
  });
}

/**
 * overview 텍스트를 파싱하여 <p> 태그로 감싸서 반환
 */
export function parseOverview(text: string): ReactNode {
  return <p>{parseHighlight(text)}</p>;
}
