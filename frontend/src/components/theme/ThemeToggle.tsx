import React from 'react';
import { Button } from '../ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center space-x-2"
    >
      {theme === 'light' ? (
        <>
          <Moon className="w-4 h-4" />
          <span>Modo Oscuro</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          <span>Modo Claro</span>
        </>
      )}
    </Button>
  );
}