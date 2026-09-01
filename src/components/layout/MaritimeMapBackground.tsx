import React from 'react';

export const MaritimeMapBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft Blue Ocean Tint Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EBF5FB] via-[#F1F8FD] to-[#F8FAFC]"></div>

      {/* SVG Global Maritime Shipping Network Vector Map */}
      <svg
        viewBox="0 0 1600 800"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-65"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="routeLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.45" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.45" />
          </linearGradient>
        </defs>

        {/* Global Grid Latitude/Longitude Lines */}
        <g stroke="#BAE6FD" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.4">
          <line x1="0" y1="200" x2="1600" y2="200" />
          <line x1="0" y1="400" x2="1600" y2="400" />
          <line x1="0" y1="600" x2="1600" y2="600" />
          <line x1="400" y1="0" x2="400" y2="800" />
          <line x1="800" y1="0" x2="800" y2="800" />
          <line x1="1200" y1="0" x2="1200" y2="800" />
        </g>

        {/* Stylized Continent Silhouettes (Very soft light blue-gray) */}
        <g fill="#E2E8F0" opacity="0.65">
          {/* North America */}
          <path d="M 180 120 Q 240 100 320 140 Q 360 180 340 260 Q 300 300 240 310 Q 220 280 200 220 Q 160 180 180 120 Z" />
          {/* South America */}
          <path d="M 330 380 Q 420 400 400 500 Q 360 620 320 650 Q 290 580 300 460 Q 310 400 330 380 Z" />
          {/* Europe */}
          <path d="M 680 140 Q 760 120 820 160 Q 840 220 780 260 Q 720 250 670 200 Q 660 160 680 140 Z" />
          {/* Africa */}
          <path d="M 680 280 Q 820 270 850 360 Q 880 480 820 620 Q 760 630 720 540 Q 670 420 660 340 Q 660 290 680 280 Z" />
          {/* Asia / Eurasia */}
          <path d="M 840 140 Q 1100 110 1280 180 Q 1340 300 1250 380 Q 1120 400 980 330 Q 900 260 840 140 Z" />
          {/* India Subcontinent */}
          <path d="M 980 310 Q 1060 330 1030 440 Q 990 470 960 410 Q 950 340 980 310 Z" />
          {/* Southeast Asia / Indonesia archipelago */}
          <path d="M 1120 420 Q 1240 440 1260 510 Q 1180 540 1120 480 Z" />
          {/* Australia */}
          <path d="M 1240 520 Q 1380 500 1420 590 Q 1380 680 1280 670 Q 1220 600 1240 520 Z" />
        </g>

        {/* Global Maritime Trade Routes Network (Intricate curved great circle paths) */}
        <g stroke="#0284C7" strokeWidth="1" opacity="0.32" fill="none">
          
          {/* Primary Asia - India - Middle East - Europe corridors */}
          <path d="M 1320 300 Q 1180 440 1010 420 Q 960 400 860 320 Q 780 260 700 220" />
          <path d="M 1300 280 Q 1160 430 1000 425 Q 940 395 850 315 Q 770 250 680 200" />
          <path d="M 1340 320 Q 1200 450 1020 430 Q 970 410 870 330 Q 790 270 710 230" />
          
          {/* Australia to India East Coast (Paradip, Vizag, Dhamra, Haldia) */}
          <path d="M 1380 560 Q 1240 480 1020 420" stroke="#0066CC" strokeWidth="1.8" opacity="0.6" />
          <path d="M 1360 540 Q 1220 470 1015 415" stroke="#0066CC" strokeWidth="1.5" opacity="0.5" />
          <path d="M 1400 580 Q 1260 490 1025 425" stroke="#0066CC" strokeWidth="1.5" opacity="0.5" />
          <path d="M 1260 560 Q 1160 490 1010 420" stroke="#0066CC" strokeWidth="1.6" opacity="0.55" />
          
          {/* Indonesia (Kalimantan / Taboneo / Samarinda) to India East Coast */}
          <path d="M 1180 470 Q 1100 440 1020 420" stroke="#0284C7" strokeWidth="2" opacity="0.65" />
          <path d="M 1160 460 Q 1090 435 1015 415" stroke="#0284C7" strokeWidth="1.7" opacity="0.6" />
          <path d="M 1200 480 Q 1110 445 1025 425" stroke="#0284C7" strokeWidth="1.7" opacity="0.6" />

          {/* Mozambique / South Africa to India East Coast */}
          <path d="M 830 580 Q 900 490 1015 425" stroke="#0066CC" strokeWidth="1.8" opacity="0.55" />
          <path d="M 810 610 Q 880 500 1010 420" stroke="#0066CC" strokeWidth="1.5" opacity="0.5" />

          {/* US East Coast & Gulf to India via Cape of Good Hope */}
          <path d="M 320 240 Q 480 420 780 640 Q 880 540 1015 425" stroke="#0284C7" strokeWidth="1.8" opacity="0.5" />
          <path d="M 280 290 Q 460 440 760 650 Q 870 550 1010 420" stroke="#0284C7" strokeWidth="1.5" opacity="0.45" />

          {/* Russia (Black Sea / Taman) to India via Suez */}
          <path d="M 820 220 Q 860 300 870 330 Q 940 400 1015 420" stroke="#0066CC" strokeWidth="1.7" opacity="0.5" />
          {/* Russia (Far East / Vostochny) to India */}
          <path d="M 1320 220 Q 1220 350 1140 450 Q 1060 430 1020 420" stroke="#0066CC" strokeWidth="1.6" opacity="0.5" />

          {/* Transatlantic & Transpacific Global Routes */}
          <path d="M 320 220 Q 500 180 680 180" />
          <path d="M 340 240 Q 520 200 700 200" />
          <path d="M 300 200 Q 480 160 660 160" />
          <path d="M 380 460 Q 550 560 760 630" />
          <path d="M 330 260 Q 160 350 40 400" />
          <path d="M 1360 280 Q 1500 240 1590 220" />
          <path d="M 1400 580 Q 1520 620 1590 640" />

          {/* Dense Indian Ocean Hub Lines */}
          <path d="M 1015 420 Q 940 450 860 480 Q 780 540 740 600" />
          <path d="M 1015 420 Q 1080 390 1140 360 Q 1240 320 1320 280" />
          <path d="M 1015 420 Q 1060 460 1120 500 Q 1200 560 1300 620" />
          <path d="M 1015 420 Q 940 360 880 320" />
          <path d="M 1015 420 Q 980 480 940 550" />
        </g>

        {/* Choke Point & Port Convergence Radar Dots */}
        <g fill="#0284C7">
          {/* India East Coast Ports Focal Glow */}
          <circle cx="1015" cy="420" r="5" fill="#FF5B26" />
          <circle cx="1015" cy="420" r="14" fill="none" stroke="#FF5B26" strokeWidth="1" opacity="0.4" />
          
          {/* Malacca Strait */}
          <circle cx="1140" cy="450" r="3.5" opacity="0.7" />
          {/* Suez */}
          <circle cx="860" cy="320" r="3.5" opacity="0.7" />
          {/* Cape */}
          <circle cx="780" cy="640" r="3.5" opacity="0.7" />
          {/* Hay Point / Australia */}
          <circle cx="1380" cy="560" r="4" fill="#0066CC" opacity="0.8" />
          {/* Singapore */}
          <circle cx="1150" cy="455" r="4" fill="#0066CC" opacity="0.8" />
          {/* Norfolk US */}
          <circle cx="320" cy="240" r="4" fill="#0066CC" opacity="0.8" />
        </g>
      </svg>
    </div>
  );
};
