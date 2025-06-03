export const HamburgerIcon = ({
  open,
  onClick,
  size,
  className,
}: {
  open?: boolean;
  onClick?: VoidFunction;
  size?: number;
  className?: string,
}) => {
  size = size || 1;
  return (
    <div className={className}>
      <ul className="relative cursor-pointer list-none m-0 p-0 transition-transform ease-in-out duration-500"
        onClick={onClick}
        style={{
          width: `${30 * size}px`,
          height: `${24 * size}px`,
        }}
      >
        <li
          style={{
            height: "2px",
            top: open ? `${-1 * size}px` : "0px",
            left: open ? `${4 * size}px` : "0px",
            transform: open ? `rotate(45deg)` : "rotate(0)",
            width: `${30 * size}px`,
          }}
          className="absolute bg-primary rounded border border-font duration-300 ease-in-out origin-left"
        />
        <li
          style={{
            height: "2px",
            top: `${9 * size}px`,
            opacity: open ? 0 : 1,
            width: open ? "0px" : `${30 * size}px`,
          }}
          className="absolute bg-primary rounded border border-font duration-300 ease-in-out origin-left"
        />
        <li
          style={{
            height: "2px",
            top: open ? `${20 * size}px` : `${18 * size}px`,
            left: open ? `${4 * size}px` : "0px",
            transform: open ? "rotate(-45deg)" : "rotate(0)",
            width: `${30 * size}px`,
          }}
          className="absolute bg-primary rounded border border-font duration-300 ease-in-out origin-left"
        />
      </ul>
    </div>
  );
};
