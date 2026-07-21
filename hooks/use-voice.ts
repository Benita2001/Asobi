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
  const [isNarrating, setIsNarrating] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const narrationTextRef = useRef<string | null>(null);

  useEffect(() => {
    setSpeechSupported(typeof window.Audio !== "undefined");
    setRecognitionSupported(
      Boolean(window.SpeechRecognition || window.webkitSpeechRecognition),
    );
    return () => {
      audioRef.current?.pause();
      recognitionRef.current?.stop();
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!speechSupported) {
        setVoiceError(
          "Audio playback is not supported in this browser. You can read the instructions below.",
        );
        return;
      }
      setVoiceError(null);
      if (narrationTextRef.current === text && audioRef.current) {
        audioRef.current.currentTime = 0;
        void audioRef.current
          .play()
          .catch(() => setVoiceError("Asobi could not play this instruction."));
        return;
      }
      setIsNarrating(true);
      try {
        const response = await fetch("/api/voice/narrate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        });
        if (!response.ok) throw new Error("NARRATION_FAILED");
        const blob = await response.blob();
        if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => setIsSpeaking(false);
        audio.onerror = () => {
          setIsSpeaking(false);
          setVoiceError("Asobi could not play this instruction.");
        };
        audioRef.current = audio;
        audioUrlRef.current = url;
        narrationTextRef.current = text;
        await audio.play();
      } catch {
        setVoiceError(
          "Asobi could not play narration right now. You can read the instructions below.",
        );
      } finally {
        setIsNarrating(false);
      }
    },
    [speechSupported],
  );

  const stopSpeaking = useCallback(() => {
    audioRef.current?.pause();
    if (audioRef.current) audioRef.current.currentTime = 0;
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
    isNarrating,
    recognitionSupported,
    voiceError,
    speak,
    stopSpeaking,
    startListening,
    stopListening,
  };
}
