export function EarthGlobe() {
  return (
    <div className="flex justify-center mb-8">
      <div className="relative" style={{ width: 180, height: 180 }}>
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(56,189,248,0.15) 0%, transparent 70%)',
            filter: 'blur(12px)',
            transform: 'scale(1.3)',
          }}
        />
        {/* Globe sphere */}
        <div
          className="absolute inset-0 rounded-full overflow-hidden"
          style={{
            background: 'radial-gradient(circle at 35% 35%, #7dd3fc 0%, #0ea5e9 30%, #0369a1 65%, #082f49 100%)',
            boxShadow: '0 0 40px rgba(14,165,233,0.3), inset -20px -10px 40px rgba(0,0,0,0.5)',
          }}
        >
          {/* Animated land masses */}
          <div
            className="absolute inset-0"
            style={{
              animation: 'spinGlobe 20s linear infinite',
              backgroundImage: `
                radial-gradient(ellipse 55px 40px at 30% 35%, rgba(34,197,94,0.85) 0%, transparent 100%),
                radial-gradient(ellipse 35px 50px at 55% 30%, rgba(34,197,94,0.8) 0%, transparent 100%),
                radial-gradient(ellipse 45px 30px at 70% 55%, rgba(34,197,94,0.75) 0%, transparent 100%),
                radial-gradient(ellipse 30px 45px at 20% 60%, rgba(34,197,94,0.7) 0%, transparent 100%),
                radial-gradient(ellipse 50px 25px at 80% 75%, rgba(34,197,94,0.65) 0%, transparent 100%),
                radial-gradient(ellipse 20px 30px at 45% 70%, rgba(34,197,94,0.6) 0%, transparent 100%),
                radial-gradient(ellipse 60px 20px at 10% 45%, rgba(34,197,94,0.55) 0%, transparent 100%)
              `,
            }}
          />
          {/* Atmosphere shimmer overlay */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at 35% 30%, rgba(255,255,255,0.25) 0%, transparent 50%)',
            }}
          />
          {/* Cloud wisps */}
          <div
            className="absolute inset-0"
            style={{
              animation: 'spinGlobe 30s linear infinite reverse',
              backgroundImage: `
                radial-gradient(ellipse 60px 12px at 40% 25%, rgba(255,255,255,0.35) 0%, transparent 100%),
                radial-gradient(ellipse 45px 10px at 70% 45%, rgba(255,255,255,0.3) 0%, transparent 100%),
                radial-gradient(ellipse 50px 8px at 20% 65%, rgba(255,255,255,0.25) 0%, transparent 100%)
              `,
            }}
          />
        </div>
        {/* Atmosphere ring */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            boxShadow: '0 0 0 3px rgba(125,211,252,0.15), 0 0 0 8px rgba(125,211,252,0.05)',
          }}
        />
        <style>{`
          @keyframes spinGlobe {
            from { background-position: 0% 50%; transform: translateX(0); }
            to { background-position: 200% 50%; transform: translateX(180px); }
          }
        `}</style>
      </div>
    </div>
  )
}
