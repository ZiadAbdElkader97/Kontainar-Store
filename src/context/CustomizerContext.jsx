import { createContext, useState, useEffect } from 'react';
import config from './config';

// Create the context with an initial value
export const CustomizerContext = createContext(undefined);

const STORAGE_KEY = 'customizer'; // مفتاح التخزين

// دالة أمان لاسترجاع القيم من localStorage
function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// Create the provider component
export const CustomizerContextProvider = ({ children }) => {
  const stored = loadStored();

  // استخدم lazy initializer عشان ما نحاولش نقرأ localStorage قبل وقتها
  const [activeDir, setActiveDir] = useState(() => stored.activeDir ?? config.activeDir);
  const [activeMode, setActiveMode] = useState(() => stored.activeMode ?? config.activeMode);
  const [activeTheme, setActiveTheme] = useState(() => stored.activeTheme ?? config.activeTheme);
  const [activeLayout, setActiveLayout] = useState(
    () => stored.activeLayout ?? config.activeLayout,
  );
  const [isCardShadow, setIsCardShadow] = useState(
    () => stored.isCardShadow ?? config.isCardShadow,
  );
  const [isLayout, setIsLayout] = useState(() => stored.isLayout ?? config.isLayout);
  const [isBorderRadius, setIsBorderRadius] = useState(
    () => stored.isBorderRadius ?? config.isBorderRadius,
  );
  const [isCollapse, setIsCollapse] = useState(() => stored.isCollapse ?? config.isCollapse);
  const [isLanguage, setIsLanguage] = useState(() => stored.isLanguage ?? config.isLanguage);
  const [isSidebarHover, setIsSidebarHover] = useState(() => stored.isSidebarHover ?? false);
  const [isMobileSidebar, setIsMobileSidebar] = useState(() => stored.isMobileSidebar ?? false);

  // Set attributes immediately
  useEffect(() => {
    document.documentElement.setAttribute('class', activeMode);
    document.documentElement.setAttribute('dir', activeDir);
    document.documentElement.setAttribute('data-color-theme', activeTheme);
    document.documentElement.setAttribute('data-layout', activeLayout);
    document.documentElement.setAttribute('data-boxed-layout', isLayout);
    document.documentElement.setAttribute('data-sidebar-type', isCollapse);
  }, [activeMode, activeDir, activeTheme, activeLayout, isLayout, isCollapse]);

  // ✅ خزّن كل الإعدادات في localStorage عند أي تغيير
  useEffect(() => {
    const payload = {
      activeDir,
      activeMode,
      activeTheme,
      activeLayout,
      isCardShadow,
      isLayout,
      isBorderRadius,
      isCollapse,
      isLanguage,
      isSidebarHover,
      isMobileSidebar,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [
    activeDir,
    activeMode,
    activeTheme,
    activeLayout,
    isCardShadow,
    isLayout,
    isBorderRadius,
    isCollapse,
    isLanguage,
    isSidebarHover,
    isMobileSidebar,
  ]);

  // اختياري: وفّر توجّل سريع للوضع الليلي/النهاري
  const toggleMode = () => setActiveMode((m) => (m === 'dark' ? 'light' : 'dark'));

  return (
    <CustomizerContext.Provider
      value={{
        activeDir,
        setActiveDir,
        activeMode,
        setActiveMode,
        toggleMode, // ← متاح للاستخدام
        activeTheme,
        setActiveTheme,
        activeLayout,
        setActiveLayout,
        isCardShadow,
        setIsCardShadow,
        isLayout,
        setIsLayout,
        isBorderRadius,
        setIsBorderRadius,
        isCollapse,
        setIsCollapse,
        isLanguage,
        setIsLanguage,
        isSidebarHover,
        setIsSidebarHover,
        isMobileSidebar,
        setIsMobileSidebar,
      }}
    >
      {children}
    </CustomizerContext.Provider>
  );
};


