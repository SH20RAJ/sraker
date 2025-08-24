// Define types for SpeechRecognition API
interface SpeechRecognitionEvent {
  results: {
    [key: number]: {
      [key: number]: {
        transcript: string;
      };
    };
  };
  error?: string;
}

interface SpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionEvent) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognition;
}

// Extend Window interface to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionConstructor;
    webkitSpeechRecognition: SpeechRecognitionConstructor;
  }
}

// Speech recognition service
export class SpeechService {
 private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;

  // Check if speech recognition is supported
  isSupported(): boolean {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = 
        window.SpeechRecognition || 
        window.webkitSpeechRecognition;
      return !!SpeechRecognition;
    }
    return false;
  }

  // Start speech recognition
  startRecognition(onResult: (text: string) => void, onError?: (error: string) => void): void {
    if (this.isListening) return;
    
    if (!this.isSupported()) {
      onError?.("Speech recognition not supported in this browser.");
      return;
    }

    this.isListening = true;
    
    const SpeechRecognitionConstructor: SpeechRecognitionConstructor = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition;
    
    this.recognition = new SpeechRecognitionConstructor();
    this.recognition.lang = "en-US";
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      this.isListening = false;
    };

    this.recognition.onerror = (event: SpeechRecognitionEvent) => {
      onError?.(`Speech recognition error: ${event.error || 'Unknown error'}`);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      this.isListening = false;
    };

    try {
      this.recognition.start();
    } catch (error) {
      onError?.(`Failed to start speech recognition: ${error}`);
      this.isListening = false;
    }
  }

  // Stop speech recognition
  stopRecognition(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }
}

// Export a singleton instance
export const speechService = new SpeechService();