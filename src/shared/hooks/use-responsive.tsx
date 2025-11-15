import { useMediaQuery } from "react-responsive";

export const useResponsive = () => {
  // xs diubah menjadi max-width karena ini untuk device extra small
  const isXs = useMediaQuery({ maxWidth: 575.98 });

  // Breakpoints lain menggunakan min-width untuk pendekatan mobile-first
  const isSm = useMediaQuery({ minWidth: 576 });
  const isMd = useMediaQuery({ minWidth: 768 });
  const isLg = useMediaQuery({ minWidth: 992 });
  const isXl = useMediaQuery({ minWidth: 1200 });
  const isXxl = useMediaQuery({ minWidth: 1400 });

  return {
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isXxl,
  };
};
