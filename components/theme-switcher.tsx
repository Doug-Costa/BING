"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "@/lib/theme-context";
import { Sun, Moon, Check, Sparkles } from "lucide-react";

export function ThemeSwitcher({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme, availableThemes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="theme-switcher-container" ref={dropdownRef}>
      <button
        type="button"
        className={`theme-toggle-btn ${compact ? "compact" : ""} ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Selecionar tema"
        aria-expanded={isOpen}
        title="Alterar tema visual"
      >
        {theme === "light" ? (
          <Sun className="theme-icon light-icon" />
        ) : (
          <Moon className="theme-icon dark-icon" />
        )}
        {!compact && (
          <span className="theme-current-label">
            {theme === "light" ? "Claro" : "Azul Live"}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="theme-menu-dropdown" role="menu">
          <div className="theme-menu-header">
            <Sparkles className="sparkle-icon" />
            <span>Aparência</span>
          </div>
          <div className="theme-menu-list">
            {availableThemes.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`theme-menu-item ${theme === item.id ? "active" : ""}`}
                onClick={() => {
                  setTheme(item.id);
                  setIsOpen(false);
                }}
                role="menuitem"
              >
                <span className="theme-item-icon">{item.icon}</span>
                <div className="theme-item-info">
                  <strong>{item.name}</strong>
                  <small>{item.description}</small>
                </div>
                {theme === item.id && <Check className="theme-check-icon" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
