'use client';
import { FiPackage, FiCheckCircle, FiClock, FiDroplet, FiWind, FiStar } from 'react-icons/fi';

export default function AppPhoneShowcase() {
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '520px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      userSelect: 'none',
      overflow: 'visible',
    }}>

      {/* ambient glow */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(0,174,239,0.3) 0%, rgba(99,102,241,0.2) 30%, transparent 70%)',
          filter: 'blur(70px)',
        }} />
      </div>

      {/* ── 3D PHONE WRAPPER ── */}
      <div className="showcase-scene" style={{
        position: 'relative',
        width: '230px',
        height: '480px',
        transformStyle: 'preserve-3d',
        animation: 'showcaseFloat 6s ease-in-out infinite',
        zIndex: 10,
      }}>

        {/* FRONT FACE */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '40px',
          background: '#000', // Deep black bezel
          border: '1px solid rgba(255,255,255,0.2)', // Thin metallic outer edge
          boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.05), 0 40px 80px rgba(0,0,0,0.8)', // Depth shadow
          overflow: 'hidden',
          transform: 'translateZ(10px)',
          backfaceVisibility: 'hidden',
        }}>
          
          {/* SCREEN GLASS GLARE */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50,
            background: 'linear-gradient(110deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.02) 30%, transparent 50%)',
            borderRadius: '40px',
          }} />
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 50,
            background: 'linear-gradient(-70deg, rgba(255,255,255,0.08) 0%, transparent 25%)',
            borderRadius: '40px',
          }} />

          {/* SCREEN CONTENT AREA (Inside bezel) */}
          <div style={{
            position: 'absolute', top: '8px', left: '8px', right: '8px', bottom: '8px',
            borderRadius: '32px',
            background: 'linear-gradient(180deg,#0a1220 0%,#040810 100%)',
            overflow: 'hidden',
            display: 'flex', flexDirection: 'column',
          }}>
            
            {/* Dynamic Island */}
            <div style={{
              position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)',
              width: '80px', height: '24px', background: '#000', borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 8px',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.05), 0 4px 10px rgba(0,0,0,0.5)',
              zIndex: 40,
            }}>
               <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0a0a0a', border: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}/>
               </div>
            </div>

            {/* Inner Content Padding Wrapper */}
            <div style={{ padding: '12px 14px', flex: 1, display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 10 }}>
              
              {/* status bar */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
                <span style={{ fontSize: '10px', color: '#fff', fontWeight: 600 }}>9:41</span>
                <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                  <svg width="12" height="9" viewBox="0 0 11 8" fill="none">
                    <path d="M5.5 6.5a1 1 0 110 2 1 1 0 010-2z" fill="#fff" />
                    <path d="M2.5 4.5C3.4 3.6 4.4 3 5.5 3s2.1.6 3 1.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                    <path d="M0.5 2.5C2 1 3.7 0 5.5 0s3.5 1 5 2.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" />
                  </svg>
                  <div style={{ width: '16px', height: '8px', border: '1px solid rgba(255,255,255,0.8)', borderRadius: '2px', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '1px', top: '1px', bottom: '1px', width: '70%', background: '#fff', borderRadius: '1px' }} />
                  </div>
                </div>
              </div>

              {/* app header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#fff', letterSpacing: '0.02em' }}>Request Order</div>
                  <div style={{ fontSize: '9px', color: '#00aeef', fontWeight: 700, marginTop: '2px' }}>WashWise Laundry</div>
                </div>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg,#00aeef,#6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,174,239,0.3)' }}>
                  <FiPackage size={14} color="#fff" />
                </div>
              </div>

              {/* services label */}
              <div style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '8px' }}>Select Services</div>

              {[
                { icon: FiDroplet, label: 'Wash & Dry',   price: '₱60/kg',  color: '#00aeef', active: true  },
                { icon: FiWind,    label: 'Dry Clean',    price: '₱150/kg', color: '#8e66ff', active: false },
                { icon: FiStar,    label: 'Premium Fold', price: '₱50/kg',  color: '#f59e0b', active: false },
              ].map(({ icon: Icon, label, price, color, active }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '8px 10px', borderRadius: '12px', marginBottom: '6px',
                  background: active ? 'rgba(0,174,239,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${active ? 'rgba(0,174,239,0.3)' : 'rgba(255,255,255,0.05)'}`,
                }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={13} color={color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#fff' }}>{label}</div>
                    <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>{price}</div>
                  </div>
                  {active && (
                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(0,174,239,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <FiCheckCircle size={10} color="#00aeef" />
                    </div>
                  )}
                </div>
              ))}

              {/* weight */}
              <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                <div style={{ fontSize: '9px', fontWeight: 800, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '6px' }}>Weight (kg)</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ flex: 1, fontSize: '14px', fontWeight: 900, color: '#fff' }}>3.5</div>
                  <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>kg</div>
                </div>
              </div>

              {/* summary */}
              <div style={{ padding: '10px 12px', borderRadius: '12px', background: 'rgba(0,174,239,0.08)', border: '1px solid rgba(0,174,239,0.15)', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>Wash & Dry × 3.5kg</span>
                  <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', fontWeight: 700 }}>₱210.00</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '6px' }}>
                  <span style={{ fontSize: '11px', color: '#fff', fontWeight: 900 }}>Total</span>
                  <span style={{ fontSize: '11px', fontWeight: 900, background: 'linear-gradient(90deg,#00aeef,#8e66ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>₱210.00</span>
                </div>
              </div>

              <div style={{ flex: 1 }} />

              {/* awaiting */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', justifyContent: 'center' }}>
                <FiClock size={11} color="#f59e0b" />
                <span style={{ fontSize: '9px', color: '#f59e0b', fontWeight: 800 }}>Awaiting staff confirmation</span>
              </div>

              {/* submit */}
              <div style={{
                padding: '12px', borderRadius: '14px', textAlign: 'center',
                background: 'linear-gradient(90deg,#00aeef,#6366f1)',
                fontSize: '11px', fontWeight: 900, color: '#fff', letterSpacing: '0.05em',
                boxShadow: '0 8px 20px rgba(99,102,241,0.4)',
              }}>SUBMIT REQUEST</div>
            </div>

            {/* home indicator */}
            <div style={{ position: 'absolute', bottom: '8px', left: '50%', transform: 'translateX(-50%)', width: '60px', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.3)', zIndex: 40 }} />
          </div>
        </div>

        {/* LEFT SIDE FACE */}
        <div style={{
          position: 'absolute',
          top: '32px', left: '-1px',
          width: '20px',
          height: 'calc(100% - 64px)',
          background: 'linear-gradient(90deg, #0f172a 0%, #334155 30%, #475569 50%, #334155 70%, #0f172a 100%)',
          transform: 'rotateY(-90deg) translateZ(0px) translateX(-10px)',
          transformOrigin: 'left center',
          boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.8), inset 0 -10px 20px rgba(0,0,0,0.8)',
        }}>
          {/* volume buttons */}
          <div style={{ position: 'absolute', top: '15%', left: '4px', right: '4px', height: '26px', background: '#0f172a', borderRadius: '2px', boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2)' }} />
          <div style={{ position: 'absolute', top: '25%', left: '4px', right: '4px', height: '26px', background: '#0f172a', borderRadius: '2px', boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2)' }} />
          {/* mute switch */}
          <div style={{ position: 'absolute', top: '5%', left: '5px', right: '5px', height: '14px', background: '#0f172a', borderRadius: '2px', boxShadow: 'inset 0 0 2px rgba(255,255,255,0.1)' }} />
        </div>

        {/* RIGHT SIDE FACE */}
        <div style={{
          position: 'absolute',
          top: '32px', right: '-1px',
          width: '20px',
          height: 'calc(100% - 64px)',
          background: 'linear-gradient(-90deg, #0f172a 0%, #334155 30%, #475569 50%, #334155 70%, #0f172a 100%)',
          transform: 'rotateY(90deg) translateZ(0px) translateX(10px)',
          transformOrigin: 'right center',
          boxShadow: 'inset 0 10px 20px rgba(0,0,0,0.8), inset 0 -10px 20px rgba(0,0,0,0.8)',
        }}>
          {/* power button */}
          <div style={{ position: 'absolute', top: '20%', left: '4px', right: '4px', height: '40px', background: '#0f172a', borderRadius: '2px', boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2)' }} />
        </div>

        {/* BOTTOM FACE */}
        <div style={{
          position: 'absolute',
          bottom: '-1px', left: '32px',
          width: 'calc(100% - 64px)',
          height: '20px',
          background: 'linear-gradient(0deg, #0f172a 0%, #334155 30%, #475569 50%, #334155 70%, #0f172a 100%)',
          transform: 'rotateX(-90deg) translateZ(0px) translateY(10px)',
          transformOrigin: 'bottom center',
          boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.8), inset -10px 0 20px rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
        }}>
          <div style={{ width: '24px', height: '6px', background: '#000', borderRadius: '3px', boxShadow: 'inset 0 0 2px rgba(255,255,255,0.1)' }} />
          {[-12, -7, -2, 3, 8, 13].map(x => (
            <div key={x} style={{ position: 'absolute', left: `calc(50% + ${x}px)`, width: '3px', height: '3px', borderRadius: '50%', background: '#000' }} />
          ))}
        </div>

        {/* TOP FACE */}
        <div style={{
          position: 'absolute',
          top: '-1px', left: '32px',
          width: 'calc(100% - 64px)',
          height: '20px',
          background: 'linear-gradient(180deg, #0f172a 0%, #334155 30%, #475569 50%, #334155 70%, #0f172a 100%)',
          transform: 'rotateX(90deg) translateZ(0px) translateY(-10px)',
          transformOrigin: 'top center',
          boxShadow: 'inset 10px 0 20px rgba(0,0,0,0.8), inset -10px 0 20px rgba(0,0,0,0.8)',
        }} />

        {/* BACK FACE */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '40px',
          background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)',
          transform: 'translateZ(-10px)',
          backfaceVisibility: 'hidden',
          boxShadow: '0 0 0 1px rgba(0,0,0,0.8)',
        }}>
          {/* camera bump */}
          <div style={{
            position: 'absolute', top: '24px', left: '20px',
            width: '48px', height: '48px', borderRadius: '16px',
            background: 'linear-gradient(135deg, #334155, #0f172a)',
            border: '1px solid rgba(255,255,255,0.05)',
            boxShadow: '2px 4px 10px rgba(0,0,0,0.5)',
            display: 'flex', flexWrap: 'wrap', gap: '4px',
            padding: '8px', boxSizing: 'border-box',
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#000', border: '1px solid rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 4px rgba(255,255,255,0.2)' }} />
            ))}
          </div>
        </div>

      </div>{/* end showcase-scene */}

      {/* floating card: top-right — Order Confirmed */}
      <div className="showcase-card-tr" style={{
        position: 'absolute', top: '8%', right: '-5%',
        background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '20px', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '12px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,1)',
        border: '1px solid rgba(226,232,240,0.8)',
        animation: 'showcaseCard1 6s ease-in-out infinite', zIndex: 30, minWidth: '180px',
      }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FiCheckCircle size={18} color="#10b981" />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>Order Confirmed</div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>WL-A3F9 · Just now</div>
        </div>
      </div>

      {/* floating card: bottom-left — Payment */}
      <div className="showcase-card-bl" style={{
        position: 'absolute', bottom: '10%', left: '-5%',
        background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderRadius: '20px', padding: '12px 16px',
        display: 'flex', alignItems: 'center', gap: '12px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,1)',
        border: '1px solid rgba(226,232,240,0.8)',
        animation: 'showcaseCard2 7s ease-in-out infinite', zIndex: 30, minWidth: '160px',
      }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '12px', background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <FiPackage size={18} color="#6366f1" />
        </div>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>₱210.00</div>
          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>Wash & Dry · 3.5kg</div>
        </div>
      </div>

      {/* ground shadow */}
      <div style={{
        position: 'absolute', bottom: '-4%', left: '50%', transform: 'translateX(-40%)',
        width: '220px', height: '24px',
        background: 'radial-gradient(ellipse, rgba(0,0,0,0.6) 0%, transparent 70%)',
        filter: 'blur(12px)', zIndex: 1, pointerEvents: 'none',
      }} />

      <style>{`
        .showcase-scene {
          transform: perspective(1000px) rotateX(10deg) rotateY(-20deg) rotateZ(2deg);
          transform-style: preserve-3d;
        }
        @keyframes showcaseFloat {
          0%,100% { transform: perspective(1000px) rotateX(10deg) rotateY(-20deg) rotateZ(2deg) translateY(0px); }
          50%      { transform: perspective(1000px) rotateX(10deg) rotateY(-20deg) rotateZ(2deg) translateY(-20px); }
        }
        @keyframes showcaseCard1 {
          0%,100% { transform: translateY(0px) translateX(0px); }
          50%      { transform: translateY(-10px) translateX(5px); }
        }
        @keyframes showcaseCard2 {
          0%,100% { transform: translateY(0px) translateX(0px); }
          50%      { transform: translateY(10px) translateX(-5px); }
        }
        @media (max-width: 1023px) {
          .showcase-scene {
            transform: perspective(1000px) rotateX(8deg) rotateY(-15deg) rotateZ(1deg) scale(0.85) !important;
          }
          @keyframes showcaseFloat {
            0%,100% { transform: perspective(1000px) rotateX(8deg) rotateY(-15deg) rotateZ(1deg) scale(0.85) translateY(0px); }
            50%      { transform: perspective(1000px) rotateX(8deg) rotateY(-15deg) rotateZ(1deg) scale(0.85) translateY(-15px); }
          }
          .showcase-card-tr { right: 5% !important; top: 0% !important; transform: scale(0.9); }
          .showcase-card-bl { left: 5% !important; bottom: 0% !important; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
}
