"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type RecognitionResult = { 0: { transcript: string }; isFinal: boolean };
type RecognitionEvent = {
  resultIndex: number;
  results: ArrayLike<RecognitionResult>;
};
type RecognitionErrorEvent = { error: string };
type Recognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onend: (() => void) | null;
  onerror: ((event: RecognitionErrorEvent) => void) | null;
  onresult: ((event: RecognitionEvent) => void) | null;
  start: () => void;
  stop: () => void;
};
type RecognitionConstructor = new () => Recognition;

declare global {
  interface Window {
    SpeechRecognition?: RecognitionConstructor;
    webkitSpeechRecognition?: RecognitionConstructor;
  }
}

export function useVoice(onTranscript: (text: string) => void) {
  const recognitionRef = useRef<Recognition | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);

  useEffect(() => {
    setSpeechSupported(
      "speechSynthesis" in window && "SpeechSynthesisUtterance" in window,
    );
    setRecognitionSupported(
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
    );
    return () => {
      window.speechSynthesis?.cancel();
      recognitionRef.current?.stop();
    };
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!speechSupported) {
        setVoiceError("Spoken instructions are not supported in this browser.");
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => {
        setVoiceError(null);
        setIsSpeaking(true);
      };
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = (event) => {
        setIsSpeaking(false);
        if (event.error !== "canceled")
          setVoiceError("Asobi could not speak this instruction.");
      };
      window.speechSynthesis.speak(utterance);
    },
    [speechSupported],
  );

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    const Constructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Constructor) {
      setVoiceError(
        "Spoken answers are not supported in this browser. You can type your answer instead.",
      );
      return;
    }
    recognitionRef.current?.stop();
    const recognition = new Constructor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const transcript = Array.from(
        { length: event.results.length - event.resultIndex },
        (_, index) => event.results[event.resultIndex + index][0].transcript,
      )
        .join(" ")
        .trim();
      if (transcript) onTranscript(transcript);
    };
    recognition.onerror = (event) => {
      setIsListening(false);
      setVoiceError(
        event.error === "not-allowed" || event.error === "service-not-allowed"
          ? "Microphone access was denied. You can type your answer instead."
          : event.error === "no-speech"
            ? "No speech was heard. Please try again or type your answer."
            : "Asobi could not hear that answer. Please try again or type it.",
      );
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    setVoiceError(null);
    setIsListening(true);
    try {
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceError(
        "The microphone is already busy. Please try again or type your answer.",
      );
    }
  }, [onTranscript]);

  return {
    isSpeaking,
    isListening,
    speechSupported,
    recognitionSupported,
    voiceError,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  };
}
