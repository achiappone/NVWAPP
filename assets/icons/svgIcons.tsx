import React from "react";
import Svg, { Path } from "react-native-svg";

export const BackIcon = () => (
  <Svg width={24} height={24} fill="white"><Path d="M15 6l-6 6 6 6" /></Svg>
);

export const NextIcon = () => (
  <Svg width={24} height={24} fill="white"><Path d="M9 6l6 6-6 6" /></Svg>
);

export const HomeIcon = () => (
  <Svg width={24} height={24} fill="white"><Path d="M3 10l9-7 9 7v10h-6v-6H9v6H3z"/></Svg>
);

export const ExportIcon = BackIcon;
export const EditIcon = BackIcon;
