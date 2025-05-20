
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Square } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { useNotes } from "@/context/NotesContext";

interface VoiceRecorderProps {
  onStop: (transcript: string | null) => void;
}

// Define the SpeechRecognition interfaces
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
      length: number;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: (event: Event) => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: (event: Event) => void;
}

// Declare the SpeechRecognition constructor
declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onStop }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const { addNote } = useNotes();

  useEffect(() => {
    let recognition: SpeechRecognition | null = null;
    
    // Check if browser supports speech recognition
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition = new SpeechRecognitionConstructor();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      
      recognition.onstart = () => {
        setIsListening(true);
        toast({
          title: "Listening...",
          description: "Start speaking now."
        });
      };
      
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
      };
      
      recognition.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        toast({
          title: "Error",
          description: `Speech recognition error: ${event.error}`,
          variant: "destructive",
        });
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      // Start recognition
      try {
        recognition.start();
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        toast({
          title: "Error",
          description: "Failed to start speech recognition.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Not supported",
        description: "Speech recognition is not supported in this browser.",
        variant: "destructive",
      });
      onStop(null);
    }
    
    // Cleanup
    return () => {
      if (recognition) {
        try {
          recognition.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, []);

  const handleStopRecording = () => {
    if (transcript.trim()) {
      addNote(transcript);
      toast({
        title: "Voice note saved",
        description: "Your voice note has been transcribed and saved."
      });
      onStop(transcript);
    } else {
      toast({
        title: "No speech detected",
        description: "We couldn't detect any speech. Please try again.",
        variant: "destructive",
      });
      onStop(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-20">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Voice Recording</h2>
        
        {transcript && (
          <div className="bg-gray-50 p-3 rounded mb-4 max-h-60 overflow-auto">
            <p className="text-gray-700">{transcript}</p>
          </div>
        )}
        
        <div className="flex justify-center mb-4">
          {isListening ? (
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center animate-pulse">
              <Mic className="h-8 w-8 text-red-500" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Mic className="h-8 w-8 text-gray-500" />
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-4">
          <Button
            variant="destructive"
            onClick={() => onStop(null)}
            className="w-32"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStopRecording}
            className="w-32"
          >
            Save Note
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VoiceRecorder;
