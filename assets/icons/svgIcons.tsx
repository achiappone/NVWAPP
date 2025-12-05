import Svg, { Path } from 'react-native-svg';

export const BackIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
      fill="white"
      fillOpacity={0.1}
    />
    <Path
      d="M13.5 8.5L9.5 12l4 3.5"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


export const NextIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
      fill="white"
      fillOpacity={0.1}
    />
    <Path
      d="M10.5 8.5L14.5 12l-4 3.5"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);


export const HomeIcon = ({ color = 'white' }: {color?: String }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 9.5L12 3l9 6.5v10.5a1 1 0 01-1 1h-5v-6h-6v6H4a1 1 0 01-1-1V9.5z"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ExportIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    {/* Box (bottom and right curve) */}
    <Path
      d="M5 20h14a2 2 0 002-2v-4"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arrow shaft (vertical line) */}
    <Path
      d="M12 4v12"
      stroke="orange"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Arrowhead */}
    <Path
      d="M16 8l-4-4-4 4"
      stroke="orange"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);



export const HomeIcon2 = ({ color = 'white' }: {color?: String }) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M49.946 970.362c-.42.01-.811.148-1.187.407l-38 30a2.07 2.07 0 0 0-.344 2.843c.645.834 2.017.968 2.844.313l36.75-29 36.75 29c.826.655 2.16.516 2.812-.313.647-.822.577-2.188-.312-2.843l-38-30c-.445-.294-.893-.415-1.313-.407zM25.01 997.27l-4 3.156v31.937a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-18h14v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2v-31.937l-4-3.156v33.093h-14v-18a2 2 0 0 0-2-2h-18a2 2 0 0 0-2 2v18h-14V997.27z"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const EditIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    {/* Box */}
    <Path
      d="M2 3C2 2.44772 2.44772 2 3 2H12V4H4V20H20V12H22V21C22 21.5523 21.5523 22 21 22H3C2.44772 22 2 21.5523 2 21V3Z"
      fill="white"
    />
    {/* Pencil */}
    <Path
      d="M17.4142 2.58579C17.7893 2.21071 18.3674 2.21071 18.7425 2.58579L21.4142 5.25736C21.7893 5.63244 21.7893 6.21071 21.4142 6.58579L10 18H7V15L17.4142 2.58579Z"
      fill="orange"
      stroke="white"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowIcon = () => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
      fill="white"
      fillOpacity={0.1}
    />
    <Path
      d="M10.5 8.5L14.5 12l-4 3.5"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);