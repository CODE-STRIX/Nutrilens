/**
 * NutriIcon — Central SVG icon component for NutriLens Mobile
 * Replaces all emoji usage with clean, consistent SVG icons.
 */
import React from 'react';
import Svg, {
  Circle, ClipPath, Defs, Ellipse, G, Line, Path, Polygon, Polyline, Rect, Stop,
  LinearGradient,
} from 'react-native-svg';

export type IconName =
  | 'scan'         // barcode / scanner
  | 'camera'       // camera
  | 'gallery'      // image / gallery
  | 'intel'        // brain / intelligence
  | 'health'       // heart / health
  | 'trends'       // chart / trends
  | 'community'    // people / community
  | 'learning'     // book / learning
  | 'profile'      // person / profile
  | 'alert'        // warning triangle
  | 'shield'       // shield / safety
  | 'check'        // checkmark
  | 'close'        // X / close
  | 'arrow-right'  // →
  | 'arrow-down'   // ↓
  | 'arrow-up'     // ↑
  | 'info'         // info circle
  | 'flame'        // 🔥 streak
  | 'star'         // ★ rating
  | 'leaf'         // 🌿 natural / fiber
  | 'factory'      // 🏭 manufacturing
  | 'flask'        // 🔬 science / additive
  | 'clock'        // ⏱ frequency
  | 'shop'         // 🛒 common foods
  | 'bulb'         // 💡 insight / tip
  | 'chart'        // 📊 nutrition chart
  | 'fire'         // 🔥 calories
  | 'protein'      // 💪 protein
  | 'grain'        // 🌾 carbs
  | 'fat'          // 🧈 fat
  | 'salt'         // 🧂 sodium
  | 'sugar'        // 🍬 sugar
  | 'recall'       // ⚠️ recall
  | 'verified'     // ✓ verified badge
  | 'target'       // 🎯 goal
  | 'plus'         // + add
  | 'snack'        // 🍟 snack
  | 'noodle'       // 🍜 noodle
  | 'refresh'      // 🔄 refresh
  | 'send'         // ✉️ submit
  | 'photo'        // 📷 photo
  | 'book'         // 📖 learning
  | 'trophy'       // 🏆 mastery
  | 'lock'         // 🔒 locked lesson
  | 'allergy'      // 🚨 allergy
  | 'body'         // 🫀 body effect
  | 'cost'         // 💰 cost
  | 'shelf'        // 📦 shelf life
  | 'texture'      // 🫙 texture
  | 'flavour'      // ✨ flavour
  | 'dots'         // ⚙️ processing
  | 'separator';   // • dot separator

interface Props {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export const NutriIcon: React.FC<Props> = ({ name, size = 20, color = '#0F172A', strokeWidth = 1.8 }) => {
  const s = size;
  const sw = strokeWidth;
  const props = { width: s, height: s, viewBox: '0 0 24 24' };
  const stroke = { stroke: color, strokeWidth: sw, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, fill: 'none' };

  switch (name) {
    case 'scan':
      return (
        <Svg {...props}>
          <Path d="M3 5h2M3 9h2M3 19h2M3 15h2M19 5h2M19 9h2M19 15h2M19 19h2" {...stroke} />
          <Rect x="7" y="3" width="10" height="18" rx="1" {...stroke} />
          <Line x1="7" y1="12" x2="17" y2="12" {...stroke} />
        </Svg>
      );
    case 'camera':
      return (
        <Svg {...props}>
          <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" {...stroke} />
          <Circle cx="12" cy="13" r="4" {...stroke} />
        </Svg>
      );
    case 'gallery':
      return (
        <Svg {...props}>
          <Rect x="3" y="3" width="18" height="18" rx="2" {...stroke} />
          <Circle cx="8.5" cy="8.5" r="1.5" {...stroke} />
          <Path d="M21 15l-5-5L5 21" {...stroke} />
        </Svg>
      );
    case 'intel':
      return (
        <Svg {...props}>
          <Path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" {...stroke} />
          <Circle cx="12" cy="12" r="10" {...stroke} />
          <Line x1="12" y1="17" x2="12" y2="17" {...stroke} strokeWidth={3} />
        </Svg>
      );
    case 'health':
      return (
        <Svg {...props}>
          <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" {...stroke} />
        </Svg>
      );
    case 'trends':
      return (
        <Svg {...props}>
          <Line x1="18" y1="20" x2="18" y2="10" {...stroke} />
          <Line x1="12" y1="20" x2="12" y2="4" {...stroke} />
          <Line x1="6" y1="20" x2="6" y2="14" {...stroke} />
        </Svg>
      );
    case 'community':
      return (
        <Svg {...props}>
          <Path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" {...stroke} />
          <Circle cx="9" cy="7" r="4" {...stroke} />
          <Path d="M23 21v-2a4 4 0 00-3-3.87" {...stroke} />
          <Path d="M16 3.13a4 4 0 010 7.75" {...stroke} />
        </Svg>
      );
    case 'learning':
      return (
        <Svg {...props}>
          <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" {...stroke} />
          <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" {...stroke} />
        </Svg>
      );
    case 'profile':
      return (
        <Svg {...props}>
          <Path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" {...stroke} />
          <Circle cx="12" cy="7" r="4" {...stroke} />
        </Svg>
      );
    case 'alert':
      return (
        <Svg {...props}>
          <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" {...stroke} />
          <Line x1="12" y1="9" x2="12" y2="13" {...stroke} />
          <Line x1="12" y1="17" x2="12.01" y2="17" {...stroke} strokeWidth={3} />
        </Svg>
      );
    case 'shield':
      return (
        <Svg {...props}>
          <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...stroke} />
        </Svg>
      );
    case 'check':
      return (
        <Svg {...props}>
          <Polyline points="20 6 9 17 4 12" {...stroke} />
        </Svg>
      );
    case 'close':
      return (
        <Svg {...props}>
          <Line x1="18" y1="6" x2="6" y2="18" {...stroke} />
          <Line x1="6" y1="6" x2="18" y2="18" {...stroke} />
        </Svg>
      );
    case 'arrow-right':
      return (
        <Svg {...props}>
          <Line x1="5" y1="12" x2="19" y2="12" {...stroke} />
          <Polyline points="12 5 19 12 12 19" {...stroke} />
        </Svg>
      );
    case 'arrow-down':
      return (
        <Svg {...props}>
          <Line x1="12" y1="5" x2="12" y2="19" {...stroke} />
          <Polyline points="19 12 12 19 5 12" {...stroke} />
        </Svg>
      );
    case 'arrow-up':
      return (
        <Svg {...props}>
          <Line x1="12" y1="19" x2="12" y2="5" {...stroke} />
          <Polyline points="5 12 12 5 19 12" {...stroke} />
        </Svg>
      );
    case 'info':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="12" r="10" {...stroke} />
          <Line x1="12" y1="16" x2="12" y2="12" {...stroke} />
          <Line x1="12" y1="8" x2="12.01" y2="8" {...stroke} strokeWidth={3} />
        </Svg>
      );
    case 'flame':
      return (
        <Svg {...props}>
          <Path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7 7 7 0 01-7-7c0-1.507.333-2.78.5-3.5.459 1 1.324 2 2.5 2z" {...stroke} />
        </Svg>
      );
    case 'star':
      return (
        <Svg {...props}>
          <Polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" {...stroke} />
        </Svg>
      );
    case 'leaf':
      return (
        <Svg {...props}>
          <Path d="M17 8C8 10 5.9 16.17 3.82 22M2 9.5C5.5 8.5 8 10 9 14.5 10 19 6 22 6 22" {...stroke} />
          <Path d="M22 2C15 2 9 7 9 14.5" {...stroke} />
        </Svg>
      );
    case 'factory':
      return (
        <Svg {...props}>
          <Path d="M2 20h20M7 20V10l5 5 5-10v15" {...stroke} />
          <Path d="M17 20v-5" {...stroke} />
          <Rect x="9" y="14" width="6" height="6" {...stroke} />
        </Svg>
      );
    case 'flask':
      return (
        <Svg {...props}>
          <Path d="M9 3h6M9 3v8l-4.5 9A2 2 0 006.5 23h11a2 2 0 001.97-2.11L15 11V3" {...stroke} />
          <Line x1="9" y1="15" x2="15" y2="15" {...stroke} />
        </Svg>
      );
    case 'clock':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="12" r="10" {...stroke} />
          <Polyline points="12 6 12 12 16 14" {...stroke} />
        </Svg>
      );
    case 'shop':
      return (
        <Svg {...props}>
          <Circle cx="9" cy="21" r="1" {...stroke} />
          <Circle cx="20" cy="21" r="1" {...stroke} />
          <Path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" {...stroke} />
        </Svg>
      );
    case 'bulb':
      return (
        <Svg {...props}>
          <Line x1="9" y1="18" x2="15" y2="18" {...stroke} />
          <Line x1="10" y1="22" x2="14" y2="22" {...stroke} />
          <Path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0018 8 6 6 0 006 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 019 14" {...stroke} />
        </Svg>
      );
    case 'chart':
      return (
        <Svg {...props}>
          <Line x1="18" y1="20" x2="18" y2="10" {...stroke} />
          <Line x1="12" y1="20" x2="12" y2="4" {...stroke} />
          <Line x1="6" y1="20" x2="6" y2="14" {...stroke} />
          <Line x1="2" y1="20" x2="22" y2="20" {...stroke} />
        </Svg>
      );
    case 'fire':
      return (
        <Svg {...props}>
          <Path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 01-7 7 7 7 0 01-7-7c0-1.507.333-2.78.5-3.5.459 1 1.324 2 2.5 2z" {...stroke} />
        </Svg>
      );
    case 'protein':
      return (
        <Svg {...props}>
          <Path d="M18 8h1a4 4 0 010 8h-1" {...stroke} />
          <Path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" {...stroke} />
          <Line x1="6" y1="1" x2="6" y2="4" {...stroke} />
          <Line x1="10" y1="1" x2="10" y2="4" {...stroke} />
          <Line x1="14" y1="1" x2="14" y2="4" {...stroke} />
        </Svg>
      );
    case 'grain':
      return (
        <Svg {...props}>
          <Path d="M12 22V12M12 12C10 9 6 8 4 10M12 12C14 9 18 8 20 10M12 12C10 15 6 16 4 14M12 12C14 15 18 16 20 14M12 12V2M4 6c0 0 2-2 8-2s8 2 8 2" {...stroke} />
        </Svg>
      );
    case 'fat':
      return (
        <Svg {...props}>
          <Path d="M8 2v20M16 2v20M2 12h20M2 7.5h20M2 16.5h20" {...stroke} />
        </Svg>
      );
    case 'salt':
      return (
        <Svg {...props}>
          <Path d="M12 2L2 7l10 5 10-5-10-5z" {...stroke} />
          <Path d="M2 17l10 5 10-5" {...stroke} />
          <Path d="M2 12l10 5 10-5" {...stroke} />
        </Svg>
      );
    case 'sugar':
      return (
        <Svg {...props}>
          <Path d="M12 2a7 7 0 017 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 017-7z" {...stroke} />
          <Circle cx="12" cy="9" r="2.5" {...stroke} />
        </Svg>
      );
    case 'recall':
      return (
        <Svg {...props}>
          <Path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" {...stroke} fill={color} fillOpacity={0.1} />
          <Line x1="12" y1="9" x2="12" y2="13" {...stroke} />
          <Line x1="12" y1="17" x2="12.01" y2="17" {...stroke} strokeWidth={3} />
        </Svg>
      );
    case 'verified':
      return (
        <Svg {...props}>
          <Path d="M22 11.08V12a10 10 0 11-5.93-9.14" {...stroke} />
          <Polyline points="22 4 12 14.01 9 11.01" {...stroke} />
        </Svg>
      );
    case 'target':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="12" r="10" {...stroke} />
          <Circle cx="12" cy="12" r="6" {...stroke} />
          <Circle cx="12" cy="12" r="2" {...stroke} />
        </Svg>
      );
    case 'plus':
      return (
        <Svg {...props}>
          <Line x1="12" y1="5" x2="12" y2="19" {...stroke} />
          <Line x1="5" y1="12" x2="19" y2="12" {...stroke} />
        </Svg>
      );
    case 'snack':
      return (
        <Svg {...props}>
          <Path d="M6 2h12a2 2 0 012 2v1a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" {...stroke} />
          <Path d="M4 7l2 14h12l2-14" {...stroke} />
        </Svg>
      );
    case 'noodle':
      return (
        <Svg {...props}>
          <Path d="M4 12c0-4.4 3.6-8 8-8s8 3.6 8 8" {...stroke} />
          <Path d="M2 14h20M6 18c0 2.2 2.7 4 6 4s6-1.8 6-4" {...stroke} />
        </Svg>
      );
    case 'refresh':
      return (
        <Svg {...props}>
          <Polyline points="23 4 23 10 17 10" {...stroke} />
          <Polyline points="1 20 1 14 7 14" {...stroke} />
          <Path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" {...stroke} />
        </Svg>
      );
    case 'send':
      return (
        <Svg {...props}>
          <Line x1="22" y1="2" x2="11" y2="13" {...stroke} />
          <Polygon points="22 2 15 22 11 13 2 9 22 2" {...stroke} />
        </Svg>
      );
    case 'photo':
      return (
        <Svg {...props}>
          <Path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" {...stroke} />
          <Circle cx="12" cy="13" r="4" {...stroke} />
        </Svg>
      );
    case 'book':
      return (
        <Svg {...props}>
          <Path d="M4 19.5A2.5 2.5 0 016.5 17H20" {...stroke} />
          <Path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" {...stroke} />
          <Line x1="8" y1="7" x2="16" y2="7" {...stroke} />
          <Line x1="8" y1="11" x2="14" y2="11" {...stroke} />
        </Svg>
      );
    case 'trophy':
      return (
        <Svg {...props}>
          <Path d="M6 9H4.5a2.5 2.5 0 010-5H6" {...stroke} />
          <Path d="M18 9h1.5a2.5 2.5 0 000-5H18" {...stroke} />
          <Path d="M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" {...stroke} />
          <Path d="M18 2H6v7a6 6 0 0012 0V2z" {...stroke} />
        </Svg>
      );
    case 'lock':
      return (
        <Svg {...props}>
          <Rect x="3" y="11" width="18" height="11" rx="2" ry="2" {...stroke} />
          <Path d="M7 11V7a5 5 0 0110 0v4" {...stroke} />
        </Svg>
      );
    case 'allergy':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="12" r="10" {...stroke} />
          <Line x1="4.93" y1="4.93" x2="19.07" y2="19.07" {...stroke} />
        </Svg>
      );
    case 'body':
      return (
        <Svg {...props}>
          <Path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" {...stroke} />
          <Line x1="12" y1="12" x2="12" y2="16" {...stroke} />
        </Svg>
      );
    case 'cost':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="12" r="10" {...stroke} />
          <Line x1="12" y1="8" x2="12" y2="16" {...stroke} />
          <Line x1="8" y1="10" x2="16" y2="10" {...stroke} />
          <Line x1="8" y1="14" x2="16" y2="14" {...stroke} />
        </Svg>
      );
    case 'shelf':
      return (
        <Svg {...props}>
          <Path d="M2 4h20v4H2zM2 10h20v4H2zM2 16h20v4H2z" {...stroke} />
        </Svg>
      );
    case 'texture':
      return (
        <Svg {...props}>
          <Path d="M12 2a5 5 0 015 5c0 5.25-5 11-5 11S7 12.25 7 7a5 5 0 015-5z" {...stroke} />
          <Circle cx="12" cy="7" r="2" {...stroke} />
        </Svg>
      );
    case 'flavour':
      return (
        <Svg {...props}>
          <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" {...stroke} />
        </Svg>
      );
    case 'dots':
      return (
        <Svg {...props}>
          <Circle cx="12" cy="12" r="3" {...stroke} />
          <Path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14" {...stroke} />
        </Svg>
      );
    case 'separator':
      return (
        <Svg width={6} height={6} viewBox="0 0 6 6">
          <Circle cx="3" cy="3" r="2" fill={color} />
        </Svg>
      );
    default:
      return null;
  }
};
