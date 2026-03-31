const ImmersiveBackground = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, 
            hsl(150 40% 6%) 0%, 
            hsl(150 40% 8%) 20%, 
            hsl(140 50% 10%) 40%, 
            hsl(150 40% 8%) 60%, 
            hsl(150 40% 6%) 80%, 
            hsl(150 40% 5%) 100%
          )`,
        }}
      />

      <div
        className="absolute w-[800px] h-[800px] rounded-full opacity-[0.12] animate-orb"
        style={{
          background: "radial-gradient(circle, hsl(140 50% 19%), transparent 70%)",
          left: "10%",
          top: "5%",
        }}
      />
      <div
        className="absolute w-[600px] h-[600px] rounded-full opacity-[0.08] animate-orb"
        style={{
          background: "radial-gradient(circle, hsl(75 38% 45%), transparent 70%)",
          right: "5%",
          top: "30%",
          animationDelay: "-7s",
        }}
      />
      <div
        className="absolute w-[500px] h-[500px] rounded-full opacity-[0.06] animate-orb"
        style={{
          background: "radial-gradient(circle, hsl(80 50% 31%), transparent 70%)",
          left: "40%",
          top: "60%",
          animationDelay: "-14s",
        }}
      />

      {/* Floating particles — reduced to 6 */}
      <div className="hidden md:block">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-accent/30 animate-particle"
            style={{
              left: `${10 + i * 16}%`,
              bottom: `-${i * 5}%`,
              animationDuration: `${14 + i * 4}s`,
              animationDelay: `${i * 2.5}s`,
            }}
          />
        ))}
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 opacity-[0.04] mix-blend-overlay">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <filter id="immersiveNoise">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#immersiveNoise)" />
        </svg>
      </div>
    </div>
  );
};

export default ImmersiveBackground;
