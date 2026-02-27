import { useEffect, useState } from "react";

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isMac: boolean;
  isWindows: boolean;
  isAndroid: boolean;
  isIOS: boolean;
}

export const useDeviceDetection = (): DeviceInfo => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isMac: false,
    isWindows: false,
    isAndroid: false,
    isIOS: false,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    const platform = navigator.platform.toLowerCase();

    // Check for mobile devices
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

    // Check for tablet
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);

    // Check for desktop
    const isDesktop = !isMobile && !isTablet;

    // Check for specific operating systems
    const isMac = /mac|darwin/i.test(platform) || /macintosh/i.test(userAgent);
    const isWindows = /win/i.test(platform);
    const isAndroid = /android/i.test(userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(userAgent);

    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      isMac,
      isWindows,
      isAndroid,
      isIOS,
    });
  }, []);

  return deviceInfo;
};
