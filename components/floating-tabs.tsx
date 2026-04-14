"use client";

import { useState, useRef, useLayoutEffect, CSSProperties } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Tab<T extends string = string> {
  value: T;
  label: string;
  content?: React.ReactNode;
}

export interface FloatingTabsProps<T extends string = string> {
  tabs: Tab<T>[];
  defaultValue?: T;
  onChange?: (value: T) => void;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function FloatingTabs<T extends string = string>({
  tabs,
  defaultValue,
  onChange,
  className = "",
}: FloatingTabsProps<T>) {
  const [activeTab, setActiveTab] = useState<T>(
    defaultValue ?? (tabs[0]?.value as T)
  );
  const [indicatorStyle, setIndicatorStyle] = useState<CSSProperties>({
    opacity: 0,
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    updateIndicator();
  }, [activeTab]);

  function updateIndicator() {
    const container = containerRef.current;
    if (!container) return;

    const activeBtn = container.querySelector<HTMLButtonElement>(
      `[data-value="${activeTab}"]`
    );
    if (!activeBtn) return;

    setIndicatorStyle({
      left: activeBtn.offsetLeft,
      width: activeBtn.offsetWidth,
      opacity: 1,
    });
  }

  function handleTabChange(value: T) {
    setActiveTab(value);
    onChange?.(value);
  }

  const activeContent = tabs.find((t) => t.value === activeTab)?.content;

  return (
    <div className={className}>
      {/* Tab strip */}
      <div
        ref={containerRef}
        className="relative flex items-center gap-1 p-1.5 w-fit rounded-[14px] bg-muted border border-border"
      >
        {/* Sliding indicator */}
        <span
          aria-hidden
          className="pointer-events-none absolute h-[calc(100%-12px)] rounded-[10px] bg-primary transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
          style={indicatorStyle}
        />

        {tabs.map((tab) => {
          const isActive = tab.value === activeTab;
          return (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-value={tab.value}
              onClick={() => handleTabChange(tab.value)}
              className={[
                "relative z-10 px-4 py-1.5 rounded-[10px] text-sm font-medium whitespace-nowrap",
                "transition-colors duration-200 cursor-pointer",
                isActive
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab content panel */}
      {activeContent && (
        <div className="mt-4 rounded-2xl bg-card border border-border p-5 animate-in fade-in-0 duration-200">
          {activeContent}
        </div>
      )}
    </div>
  );
}