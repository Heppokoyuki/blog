export default function MountainLogo() {
  return (
    <div className="relative inline-block w-8 h-8 mr-2">
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 黒い正方形の背景 */}
        <rect
          x="5"
          y="5"
          width="100"
          height="100"
          fill="black"
          className="transition-colors duration-300"
        />
        
        {/* 「山」の文字 */}
        <text
          x="50"
          y="88"
          textAnchor="middle"
          fill="white"
          className="text-[100px] leading-none"
          style={{ 
            fontFamily: 'KozanBrush',
            fontSize: '100px',
            lineHeight: 1
          }}
        >
          山
        </text>
      </svg>
    </div>
  );
} 