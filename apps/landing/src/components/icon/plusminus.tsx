export const PlusMinusIcon = ({
  open,
  onClick,
  size,
  className,
}: {
  open?: boolean;
  onClick?: VoidFunction;
  size?: number;
  className?: string;
}) => {
  // 기본값 설정
  size = size || 1

  return (
    <div className={className}>
      {/* styled ul: 크기 지정 + 클릭 이벤트 */}
      <ul
        className="relative cursor-pointer list-none m-0 p-0 transition-transform ease-in-out duration-500"
        onClick={onClick}
        style={{
          width: `${30 * size}px`,
          height: `${30 * size}px`,
        }}
      >
        {/*
          1) 첫 번째 선: 항상 수평으로 가운데
             (→ “+”에서 가로줄, “-” 모양일 때도 가로줄)
        */}
        <li
          style={{
            position: "absolute",
            top: "50%",       // 수직 중앙
            left: 0,
            width: "100%",    // 전체 가로폭
            height: "2px",
            transform: "translateY(-50%)", // y축 중앙 보정
          }}
          className="bg-foreground rounded border border-foreground duration-300 ease-in-out"
        />
        {/*
          2) 두 번째 선: 가운데서 세로줄 → 클릭 시 90도 회전하여 가로줄과 겹침
             (open=true 시 rotate(90deg) → "-" 모양)
        */}
        <li
          style={{
            position: "absolute",
            top: 0,
            left: "50%",         // 수평 중앙
            width: "2px",
            height: "100%",      // 전체 세로 높이
            transformOrigin: "center center",
            // open 여부에 따라 회전
            transform: open
              ? "translateX(-50%) rotate(90deg)" // "-" 상태
              : "translateX(-50%) rotate(0deg)",  // "+" 상태
          }}
          className="bg-foreground rounded border border-foreground duration-300 ease-in-out"
        />
      </ul>
    </div>
  )
}
