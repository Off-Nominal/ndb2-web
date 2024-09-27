import { PredictionLifeCycle } from "@/types/predictions";

export const statusLabel = {
  [PredictionLifeCycle.OPEN]: "Open",
  [PredictionLifeCycle.CLOSED]: "Closed",
  [PredictionLifeCycle.RETIRED]: "Retired",
  [PredictionLifeCycle.SUCCESSFUL]: "Success",
  [PredictionLifeCycle.FAILED]: "Failed",
  [PredictionLifeCycle.CHECKING]: "Open",
};
