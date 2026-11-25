interface HatLogoProps {
  size?: number
  className?: string
}

export function HatLogo({ size = 48, className }: HatLogoProps) {
  const h = Math.round(size * 36 / 60)
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 60 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="HAT Recruit"
    >
      <ellipse cx="30" cy="33" rx="27" ry="3.5" fill="#000" opacity="0.25"/>
      <path d="M2 27 Q6 24 30 23 Q54 24 58 27 Q54 30 30 30.5 Q6 30 2 27Z" fill="#d4b878"/>
      <path d="M2 27 Q6 24 30 23 Q54 24 58 27 Q54 30 30 30.5 Q6 30 2 27Z" fill="#1a1020" opacity="0.1"/>
      <path d="M6 26.5 Q30 24.5 54 26.5" stroke="rgba(255,255,255,0.18)" strokeWidth="0.8" fill="none"/>
      <path d="M15 23 C14 23 13 10 19 5 Q25 2 30 2 Q35 2 41 5 C47 10 46 23 45 23 Z" fill="#c9a85a"/>
      <path d="M15 23 C14 23 13 10 19 5 Q25 2 30 2 L30 23 Z" fill="#1a1020" opacity="0.12"/>
      <path d="M22 5 Q30 2.5 38 5" stroke="#1a1020" strokeWidth="1.2" strokeOpacity="0.25" fill="none"/>
      <path d="M25 3.5 Q30 1.5 35 3.5" stroke="#1a1020" strokeWidth="0.8" strokeOpacity="0.15" fill="none"/>
      <path d="M15 23 Q30 22 45 23" stroke="#b8943a" strokeWidth="0.5" fill="none"/>
      <path d="M15 20.5 Q30 19.5 45 20.5 L45 23 Q30 22 15 23 Z" fill="#c8a82c"/>
      <path d="M16 20.8 Q30 19.8 44 20.8" stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" fill="none"/>
    </svg>
  )
}
