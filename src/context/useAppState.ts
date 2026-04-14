import { useContext } from "react";
import { AppActionsContext, AppStateContext } from "./appStateStore";

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within AppStateProvider");
  }
  return context;
}

export function useAppActions() {
  const context = useContext(AppActionsContext);
  if (!context) {
    throw new Error("useAppActions must be used within AppStateProvider");
  }
  return context;
}
