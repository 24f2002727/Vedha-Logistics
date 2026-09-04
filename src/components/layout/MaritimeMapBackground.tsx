import React from 'react';

export const MaritimeMapBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Soft Blue Ocean Tint Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#EBF5FB]/90 via-[#F1F8FD]/80 to-[#F8FAFC]"></div>

      {/* SVG Global Maritime Shipping Network Vector Map (High-density Nautical Chart) */}
      <svg
        viewBox="0 0 1600 850"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-70"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="heroOceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F0F9FF" stopOpacity="0.4" />
          </linearGradient>

          <linearGradient id="heroCyanArc" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.65" />
          </linearGradient>

          <linearGradient id="heroRedTrunk" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#F97316" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {/* Global Grid Latitude/Longitude Lines & Time Zones */}
        <g stroke="#BAE6FD" strokeWidth="0.6" strokeDasharray="3 4" opacity="0.65">
          {/* Meridians */}
          <line x1="50" y1="0" x2="50" y2="850" />
          <line x1="175" y1="0" x2="175" y2="850" />
          <line x1="300" y1="0" x2="300" y2="850" />
          <line x1="425" y1="0" x2="425" y2="850" />
          <line x1="612" y1="0" x2="612" y2="850" />
          <line x1="800" y1="0" x2="800" y2="850" />
          <line x1="925" y1="0" x2="925" y2="850" />
          <line x1="1112" y1="0" x2="1112" y2="850" />
          <line x1="1237" y1="0" x2="1237" y2="850" />
          <line x1="1362" y1="0" x2="1362" y2="850" />
          <line x1="1425" y1="0" x2="1425" y2="850" />
          <line x1="1550" y1="0" x2="1550" y2="850" />

          {/* Parallels */}
          <line x1="0" y1="130" x2="1600" y2="130" />
          <line x1="0" y1="280" x2="1600" y2="280" />
          <line x1="0" y1="420" x2="1600" y2="420" stroke="#7DD3FC" strokeWidth="1" strokeDasharray="none" />
          <line x1="0" y1="560" x2="1600" y2="560" />
          <line x1="0" y1="710" x2="1600" y2="710" />
        </g>

        {/* Continents Silhouettes */}
        <g fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="0.8" opacity="0.85">
          {/* North America */}
          <path d="M 190 120 Q 250 90 340 130 Q 380 170 360 250 Q 340 280 300 290 Q 240 310 220 270 Q 180 200 190 120 Z" />
          <path d="M 330 180 Q 420 160 480 200 Q 510 250 490 310 Q 430 330 350 280 Q 320 230 330 180 Z" />
          <path d="M 430 300 Q 460 340 480 390 Q 450 400 420 360 Q 400 320 430 300 Z" />
          
          {/* South America */}
          <path d="M 490 400 Q 590 420 640 470 Q 660 550 620 640 Q 570 730 540 730 Q 520 640 500 530 Q 470 440 490 400 Z" />
          
          {/* Europe */}
          <path d="M 760 140 Q 840 120 890 160 Q 900 220 840 250 Q 780 260 740 220 Q 730 170 760 140 Z" />
          
          {/* Africa */}
          <path d="M 760 270 Q 880 260 920 330 Q 960 430 940 550 Q 910 650 860 660 Q 800 660 780 570 Q 730 460 730 360 Q 730 290 760 270 Z" />

          {/* Eurasia */}
          <path d="M 890 120 Q 1100 80 1320 110 Q 1460 160 1440 250 Q 1340 310 1240 330 Q 1120 310 990 260 Q 910 200 890 120 Z" />

          {/* China & East Asia */}
          <path d="M 1200 240 Q 1340 230 1370 300 Q 1320 380 1220 390 Q 1160 360 1180 300 Z" />

          {/* India Subcontinent */}
          <path d="M 1040 270 Q 1120 275 1135 320 Q 1120 400 1090 430 Q 1060 400 1035 330 Q 1020 290 1040 270 Z" fill="#CBD5E1" stroke="#0284C7" strokeWidth="1.2" />

          {/* Southeast Asia */}
          <path d="M 1190 380 Q 1240 390 1250 440 Q 1200 460 1180 410 Z" />
          <path d="M 1240 430 Q 1300 430 1300 480 Q 1240 490 1230 450 Z" />

          {/* Australia */}
          <path d="M 1320 520 Q 1460 490 1480 580 Q 1470 670 1360 680 Q 1280 620 1320 520 Z" />
        </g>

        {/* Global Sea Routes Network (Intricate Curved Lines) */}
        <g fill="none">
          
          {/* Ambient Blue Sea Lanes */}
          <g stroke="#0284C7" strokeWidth="1.2" opacity="0.35">
            {/* Transpacific */}
            <path d="M 1375 250 Q 1550 200 1600 240" />
            <path d="M 0 240 Q 150 280 310 260" />
            <path d="M 1320 265 Q 1520 220 1600 260" />
            <path d="M 0 260 Q 160 300 310 280" />
            
            {/* Transatlantic */}
            <path d="M 495 245 Q 640 220 810 185" />
            <path d="M 430 280 Q 600 260 760 270" />
            <path d="M 635 530 Q 720 420 810 185" />
            <path d="M 635 530 Q 750 560 860 660" />

            {/* Asia-Europe-India Mega Corridor */}
            <path d="M 1320 265 Q 1280 360 1240 425 Q 1150 435 975 365 Q 945 310 885 270 Q 840 225 810 185" />
            <path d="M 1015 320 Q 1060 350 1115 305" />
          </g>

          {/* Australia to India East Coast (Paradip, Vizag, Haldia, Dhamra) */}
          <path d="M 1425 570 Q 1310 470 1230 435 Q 1160 410 1115 305" stroke="#0066CC" strokeWidth="2.2" opacity="0.75" />
          <path d="M 1430 590 Q 1320 480 1235 440 Q 1165 415 1118 300" stroke="#0066CC" strokeWidth="1.8" opacity="0.65" />
          <path d="M 1435 635 Q 1330 500 1240 445 Q 1170 420 1125 290" stroke="#0066CC" strokeWidth="1.8" opacity="0.65" />

          {/* Indonesia to India East Coast */}
          <path d="M 1260 450 Q 1200 425 1115 305" stroke="#0284C7" strokeWidth="2" opacity="0.75" />
          <path d="M 1275 435 Q 1205 420 1125 290" stroke="#0284C7" strokeWidth="1.8" opacity="0.7" />

          {/* South Africa to India */}
          <path d="M 935 615 Q 1020 500 1105 325" stroke="#0066CC" strokeWidth="2" opacity="0.7" />

          {/* Red Strategic Trunk Corridors (Matching reference image) */}
          <path d="M 1375 250 Q 1550 180 1600 200 M 0 200 Q 180 220 310 260 Q 400 330 490 395" stroke="#EF4444" strokeWidth="2.4" opacity="0.7" />
          <path d="M 810 185 Q 650 170 495 235" stroke="#EF4444" strokeWidth="2.2" opacity="0.65" />
        </g>

        {/* Global Major Port Nodes */}
        <g fill="#0284C7" opacity="0.7">
          <circle cx="1115" cy="305" r="4.5" fill="#EF4444" /> {/* Paradip */}
          <circle cx="1105" cy="325" r="3.5" /> {/* Vizag */}
          <circle cx="1125" cy="290" r="3.5" /> {/* Haldia */}
          <circle cx="1240" cy="425" r="4" fill="#0EA5E9" /> {/* Singapore */}
          <circle cx="1425" cy="570" r="4" fill="#0EA5E9" /> {/* Hay Point */}
          <circle cx="1320" cy="265" r="4" /> {/* Shanghai */}
          <circle cx="810" cy="185" r="4" /> {/* Rotterdam */}
          <circle cx="495" cy="245" r="4" /> {/* Norfolk */}
        </g>
      </svg>
    </div>
  );
};
