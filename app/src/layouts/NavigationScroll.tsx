import { ReactNode, useEffect } from "react";
import { useLocation } from "react-router-dom";

// ==============================|| NAVIGATION SCROLL TO TOP ||============================== //
interface Props {
  children: ReactNode;
}

const NavigationScroll = ({ children }: Props) => {
  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }, [pathname]);

  return <>{children || null}</>;
};

export default NavigationScroll;
