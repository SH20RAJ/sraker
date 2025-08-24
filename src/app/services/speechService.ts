// Define types for SpeechRecognition API
interface SpeechRecognitionResult {
  [key: number]: {
    transcript: string;
  };
  isFinal: boolean;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResult[] & {
    [key: number]: SpeechRecognitionResult;
  };
  resultIndex: number;
  error?: string;
}

interface SpeechRecognition {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
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
  private onResultCallback: ((text: string) => void) | null = null;
  private onErrorCallback: ((error: string) => void) | null = null;
  private currentTranscript: string = "";

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
    // If already listening, stop first
    if (this.isListening) {
      this.stopRecognition();
    }
    
    if (!this.isSupported()) {
      onError?.("Speech recognition not supported in this browser.");
      return;
    }

    this.isListening = true;
    this.onResultCallback = onResult;
    this.onErrorCallback = onError || null;
    
    const SpeechRecognitionConstructor: SpeechRecognitionConstructor = 
      window.SpeechRecognition || 
      window.webkitSpeechRecognition;
    
    this.recognition = new SpeechRecognitionConstructor();
    this.recognition.lang = "en-US";
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 1;
    this.recognition.continuous = true; // Enable continuous listening

    this.recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          this.currentTranscript += transcript + " ";
        } else {
          interimTranscript = transcript;
        }
      }
      
      // Call the callback with the current transcript + interim transcript
      this.onResultCallback?.(this.currentTranscript + interimTranscript);
    };

    this.recognition.onerror = (event: SpeechRecognitionEvent) => {
      this.onErrorCallback?.(`Speech recognition error: ${event.error || 'Unknown error'}`);
      this.isListening = false;
    };

    this.recognition.onend = () => {
      // If still listening, restart recognition
      if (this.isListening) {
        this.recognition?.start();
      } else {
        this.currentTranscript = "";
      }
    };

    try {
      this.recognition.start();
    } catch (error) {
      this.onErrorCallback?.(`Failed to start speech recognition: ${error}`);
      this.isListening = false;
    }
  }

  // Stop speech recognition
  stopRecognition(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
      this.currentTranscript = "";
    }
  }

  // Check if currently listening
  getIsListening(): boolean {
    return this.isListening;
  }
}

// Export a singleton instance
export const speechService = new SpeechService();