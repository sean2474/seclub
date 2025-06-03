export const DotToXIcon = ({
  open,
  onClick,
  size,
  className,
}: {
  open?: boolean
  onClick?: VoidFunction
  size?: number
  className?: string
}) => {
  // 버튼 크기 배율 (기본 1)
  size = size || 1

  // 컨테이너 크기. 필요에 따라 조절 가능
  const containerSize = 40 * size
  // 점(원) 지름
  const dotSize = 4 * size
  // X 선의 길이 (수직 기준)
  const lineLength = 30 * size
  // X 선 두께 (가로 폭)
  const lineThickness = 3 * size

  return (
    <div className={className}>
      <ul
        className="relative cursor-pointer list-none m-0 p-0 transition-transform ease-in-out duration-500"
        style={{
          width: `${containerSize}px`,
          height: `${containerSize}px`,
        }}
        onClick={onClick}
      >
        {/* --- 점(왼쪽) --- */}
        <li
          style={{
            position: "absolute",
            top: "50%",
            left: `${open ? '50%' : '20%'}`,
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: "50%",
            transform: `
              translate(-50%, -50%)
            `,
          }}
          className={`bg-font border border-font duration-300 ease-in-out ${!open && 'delay-150'}`}
        />
        {/* --- 점(가운데) --- */}
        <li
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: "50%",
            transform: `
              translate(-50%, -50%)
            `,
          }}
          className={`bg-font border border-font duration-300 ease-in-out ${!open && 'delay-150'}`}
        />
        {/* --- 점(오른쪽) --- */}
        <li
          style={{
            position: "absolute",
            top: "50%",
            left: `${open ? '50%' : '80%'}`,
            width: `${dotSize}px`,
            height: `${dotSize}px`,
            borderRadius: "50%",
            transform: `
              translate(-50%, -50%)
            `,
          }}
          className={`bg-font border border-font duration-300 ease-in-out ${!open && 'delay-150'}`}
        />

        {/* --- X 선(우상향 ↘︎) --- */}
        <li
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: `${lineThickness}px`,
            height: `${lineLength}px`,
            transformOrigin: "center",
            transform: `
              translate(-50%, -50%)
              rotate(45deg)
              scale(${open ? 1 : 0})
            `,
          }}
          className={`bg-font border border-font rounded duration-300 ease-in-out ${open && 'delay-150'}`}
        />

        {/* --- X 선(우하향 ↗) --- */}
        <li
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            width: `${lineThickness}px`,
            height: `${lineLength}px`,
            transformOrigin: "center",
            transform: `
              translate(-50%, -50%)
              rotate(-45deg)
              scale(${open ? 1 : 0})
            `,
          }}
          className={`bg-font border border-font rounded duration-300 ease-in-out ${open && 'delay-150'}`}
        />
      </ul>
    </div>
  )
}
