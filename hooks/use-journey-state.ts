"use client";

import { useEffect, useState } from "react";

import {
  EMPTY_JOURNEY_STATE,
  readJourneyState,
  writeJourneyState,
} from "@/lib/journey-state";
import type { AgeGroup, JourneyState } from "@/types/journey";

export function useJourneyState() {
  const [journeyState, setJourneyState] =
    useState<JourneyState>(EMPTY_JOURNEY_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setJourneyState(readJourneyState());
    setIsLoaded(true);
  }, []);

  function setAgeGroup(ageGroup: AgeGroup) {
    const nextState: JourneyState = { ageGroup };
    writeJourneyState(nextState);
    setJourneyState(nextState);
  }

  return {
    ageGroup: journeyState.ageGroup,
    isLoaded,
    setAgeGroup,
  };
}
