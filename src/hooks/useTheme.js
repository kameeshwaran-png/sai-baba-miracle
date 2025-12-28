import { useSelector } from 'react-redux';

export const useTheme = () => {
  const themeMode = useSelector((state) => state.theme.mode);
  const themeColors = useSelector((state) => state.theme.colors);
  
  return {
    mode: themeMode,
    colors: themeColors[themeMode],
  };
};

