"use client";

import { FileText, BookOpen } from "lucide-react";
import { type PersonaType, PERSONAS } from "../lib/types";
import { cn } from "@ai-prototypes/ui/lib";

interface PersonaSelectorProps {
  selected: PersonaType;
  onSelect: (persona: PersonaType) => void;
  disabled?: boolean;
}

const ICONS = {
  FileText,
  BookOpen,
} as const;

export function PersonaSelector({
  selected,
  onSelect,
  disabled,
}: PersonaSelectorProps) {
  return (
    <div className="flex gap-2 p-2">
      {Object.values(PERSONAS).map((persona) => {
        const Icon = ICONS[persona.icon];
        const isSelected = selected === persona.id;

        return (
          <button
            key={persona.id}
            onClick={() => onSelect(persona.id)}
            disabled={disabled}
            className={cn(
              "flex-1 flex flex-col items-center gap-1.5 p-3 rounded-lg border-2 transition-all",
              "hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-transparent bg-muted/30"
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                isSelected ? "text-primary" : "text-muted-foreground"
              )}
            >
              {persona.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
