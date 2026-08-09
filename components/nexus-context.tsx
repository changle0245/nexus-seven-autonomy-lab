"use client";

import { createContext, useContext } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { Copy } from "@/lib/i18n";
import type { NexusAction, NexusState } from "@/lib/types";

interface NexusContextValue {
  state: NexusState;
  dispatch: Dispatch<NexusAction>;
  t: Copy;
  commandOpen: boolean;
  setCommandOpen: Dispatch<SetStateAction<boolean>>;
  copilotOpen: boolean;
  setCopilotOpen: Dispatch<SetStateAction<boolean>>;
}

export const NexusContext = createContext<NexusContextValue | null>(null);

export function useNexus(): NexusContextValue {
  const value = useContext(NexusContext);
  if (!value) {
    throw new Error("useNexus must be used inside NexusContext.Provider");
  }
  return value;
}
