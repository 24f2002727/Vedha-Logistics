import React from 'react';

export const WorldMapHeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none">
      {/* Dark Maritime Gradient Layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1329] via-[#0F172A]/95 to-[#090E1A]"></div>

      {/* Radial Glow highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-10 left-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>

      {/* SVG Global Vector World Map with Shipping Corridors */}
      <svg
        viewBox="0 0 1600 850"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-60"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="routeCyanGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284C7" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="routeOrangeGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FB923C" stopOpacity="1.0" />
            <stop offset="100%" stopColor="#F97316" stopOpacity="0.9" />
          </linearGradient>
        </defs>

        {/* Latitude & Longitude Nautical Grid */}
        <g stroke="#1E293B" strokeWidth="0.8" strokeDasharray="3 4" opacity="0.6">
          {/* Meridians */}
          <line x1="100" y1="0" x2="100" y2="850" />
          <line x1="250" y1="0" x2="250" y2="850" />
          <line x1="400" y1="0" x2="400" y2="850" />
          <line x1="600" y1="0" x2="600" y2="850" />
          <line x1="800" y1="0" x2="800" y2="850" />
          <line x1="1000" y1="0" x2="1000" y2="850" />
          <line x1="1100" y1="0" x2="1100" y2="850" stroke="#0369A1" strokeWidth="1" strokeDasharray="none" opacity="0.4" /> {/* East Coast Meridian */}
          <line x1="1250" y1="0" x2="1250" y2="850" />
          <line x1="1400" y1="0" x2="1400" y2="850" />
          <line x1="1550" y1="0" x2="1550" y2="850" />

          {/* Parallels */}
          <line x1="0" y1="140" x2="1600" y2="140" />
          <line x1="0" y1="280" x2="1600" y2="280" />
          <line x1="0" y1="425" x2="1600" y2="425" stroke="#0284C7" strokeWidth="1" strokeDasharray="none" opacity="0.3" /> {/* Equator */}
          <line x1="0" y1="570" x2="1600" y2="570" />
          <line x1="0" y1="710" x2="1600" y2="710" />
        </g>

        {/* Continental Landmasses (High-Tech Vector Silhouettes) */}
        <g fill="#1E293B" stroke="#334155" strokeWidth="1" opacity="0.75">
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

          {/* India Subcontinent (Highlighted in Cyan) */}
          <path 
            d="M 1040 270 Q 1120 275 1135 320 Q 1120 400 1090 430 Q 1060 400 1035 330 Q 1020 290 1040 270 Z" 
            fill="#0F2D4A" 
            stroke="#0284C7" 
            strokeWidth="1.8" 
          />

          {/* Southeast Asia & Malacca */}
          <path d="M 1190 380 Q 1240 390 1250 440 Q 1200 460 1180 410 Z" />
          <path d="M 1240 430 Q 1300 430 1300 480 Q 1240 490 1230 450 Z" />

          {/* Australia */}
          <path 
            d="M 1320 520 Q 1460 490 1480 580 Q 1470 670 1360 680 Q 1280 620 1320 520 Z" 
            fill="#1E293B" 
            stroke="#0284C7" 
            strokeWidth="1.2" 
          />
        </g>

        {/* Global Maritime Sea Routes & Shipping Corridors */}
        <g fill="none">
          {/* Ambient Global Shipping Lanes */}
          <g stroke="#0369A1" strokeWidth="1.2" opacity="0.35">
            {/* Transpacific */}
            <path d="M 1375 250 Q 1550 200 1600 240" />
            <path d="M 0 240 Q 150 280 310 260" />
            <path d="M 1320 265 Q 1520 220 1600 260" />
            
            {/* Transatlantic */}
            <path d="M 495 245 Q 640 220 810 185" />
            <path d="M 430 280 Q 600 260 760 270" />
            <path d="M 635 530 Q 720 420 810 185" />
            <path d="M 635 530 Q 750 560 860 660" />

            {/* Europe-Asia Corridor */}
            <path d="M 810 185 Q 885 270 945 310 Q 975 365 1150 435 Q 1240 425 1320 265" />
          </g>

          {/* Glowing Major Trade Corridors into East Coast India */}
          
          {/* 1. Australia (Hay Point/Gladstone) to India East Coast (Paradip / Dhamra / Vizag) */}
          <path 
            d="M 1425 570 Q 1310 470 1230 435 Q 1160 410 1115 305" 
            stroke="url(#routeOrangeGlow)" 
            strokeWidth="2.8" 
            strokeDasharray="6 3"
            opacity="0.9" 
          />
          <path 
            d="M 1435 635 Q 1330 500 1240 445 Q 1170 420 1105 325" 
            stroke="#0284C7" 
            strokeWidth="2.0" 
            opacity="0.75" 
          />

          {/* 2. Indonesia (Taboneo/Samarinda) to Haldia / Paradip */}
          <path 
            d="M 1260 450 Q 1200 425 1115 305" 
            stroke="url(#routeCyanGlow)" 
            strokeWidth="2.4" 
            opacity="0.85" 
          />
          <path 
            d="M 1275 435 Q 1205 420 1125 290" 
            stroke="#38BDF8" 
            strokeWidth="2.0" 
            strokeDasharray="4 2"
            opacity="0.8" 
          />

          {/* 3. South Africa (Richards Bay) to Vizag / Gangavaram */}
          <path 
            d="M 935 615 Q 1020 500 1105 325" 
            stroke="#F97316" 
            strokeWidth="2.2" 
            opacity="0.8" 
          />

          {/* 4. US East Coast (Norfolk) to India via Cape of Good Hope */}
          <path 
            d="M 495 245 Q 630 400 860 660 Q 980 540 1115 305" 
            stroke="#0EA5E9" 
            strokeWidth="2.0" 
            strokeDasharray="5 3"
            opacity="0.7" 
          />
        </g>

        {/* Major Global & Indian Port Nodes with Pulsing Radar Effect */}
        <g>
          {/* East Coast India Cluster (Highlighted) */}
          <g>
            <circle cx="1115" cy="305" r="5.5" fill="#F97316" /> {/* Paradip */}
            <circle cx="1115" cy="305" r="9" fill="none" stroke="#F97316" strokeWidth="1.2" opacity="0.6" />
            <text x="1125" y="308" fill="#FFFFFF" fontSize="11" fontFamily="sans-serif" fontWeight="bold">Paradip / Dhamra</text>

            <circle cx="1105" cy="325" r="4.5" fill="#38BDF8" /> {/* Vizag / Gangavaram */}
            <text x="1035" y="340" fill="#BAE6FD" fontSize="10" fontFamily="sans-serif">Vizag / Gangavaram</text>

            <circle cx="1125" cy="290" r="4.5" fill="#38BDF8" /> {/* Haldia / Sandheads */}
            <text x="1135" y="285" fill="#BAE6FD" fontSize="10" fontFamily="sans-serif">Haldia</text>
          </g>

          {/* Global Origin Nodes */}
          <g fill="#94A3B8" fontSize="10" fontFamily="sans-serif">
            {/* Australia */}
            <circle cx="1425" cy="570" r="5" fill="#F97316" />
            <circle cx="1425" cy="570" r="8" fill="none" stroke="#F97316" strokeWidth="1" opacity="0.5" />
            <text x="1435" y="575" fill="#FED7AA" fontWeight="bold">Hay Point / DBCT</text>

            {/* Indonesia */}
            <circle cx="1260" cy="450" r="4.5" fill="#0EA5E9" />
            <text x="1270" y="455" fill="#BAE6FD">Taboneo</text>

            {/* Singapore Chokepoint */}
            <circle cx="1240" cy="425" r="4" fill="#38BDF8" />
            <text x="1248" y="420" fill="#94A3B8" fontSize="9">Malacca St.</text>

            {/* South Africa */}
            <circle cx="935" cy="615" r="4.5" fill="#F97316" />
            <text x="850" y="620" fill="#FED7AA">Richards Bay</text>

            {/* US East Coast */}
            <circle cx="495" cy="245" r="4.5" fill="#0EA5E9" />
            <text x="430" y="240" fill="#BAE6FD">Norfolk / US</text>

            {/* China / East Asia */}
            <circle cx="1320" cy="265" r="4" fill="#64748B" />
            <text x="1330" y="270" fill="#94A3B8">Qingdao</text>
          </g>
        </g>
      </svg>
    </div>
  );
};
