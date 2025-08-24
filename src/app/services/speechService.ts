// Speech recognition service
export class SpeechService {
    private recognition: any = null;
    private isListening: boolean = false;

    // Check if speech recognition is supported
    isSupported(): boolean {
        if (typeof window !== 'undefined') {
            const SpeechRecognition =
                (window as any).SpeechRecognition ||
                (window as any).webkitSpeechRecognition;
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

        const SpeechRecognition =
            (window as any).SpeechRecognition ||
            (window as any).webkitSpeechRecognition;

        this.recognition = new SpeechRecognition();
        this.recognition.lang = "en-US";
        this.recognition.interimResults = false;
        this.recognition.maxAlternatives = 1;

        this.recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            onResult(transcript);
            this.isListening = false;
        };

        this.recognition.onerror = (event: any) => {
            onError?.(`Speech recognition error: ${event.error}`);
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