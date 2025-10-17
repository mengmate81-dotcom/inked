import React from 'react';

type Theme = 'twilight' | 'daylight' | 'aurora';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themeOptions: { name: Theme; gradient: string }[] = [
  { name: 'twilight', gradient: 'bg-gradient-to-br from-[#201b43] to-[#4a3f93]' },
  { name: 'daylight', gradient: 'bg-gradient-to-br from-yellow-300 to-orange-400' },
  { name: 'aurora', gradient: 'bg-gradient-to-br from-emerald-500 to-pink-500' },
];

const themeChineseNames: Record<Theme, string> = {
  twilight: '暮光',
  daylight: '日光',
  aurora: '极光',
};

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, onThemeChange }) => {
  return (
    <div className="flex items-center space-x-2 p-1 bg-[var(--color-surface-secondary)] rounded-full backdrop-blur-sm">
      {themeOptions.map(theme => (
        <button
          key={theme.name}
          onClick={() => onThemeChange(theme.name)}
          className={`w-6 h-6 rounded-full ${theme.gradient} transition-all duration-200 ring-2 ring-offset-2 ring-offset-[var(--color-surface-primary)] ${
            currentTheme === theme.name ? 'ring-[var(--color-text-accent)]' : 'ring-transparent'
          }`}
          aria-label={`切换到 ${themeChineseNames[theme.name]} 主题`}
        />
      ))}
    </div>
  );
};