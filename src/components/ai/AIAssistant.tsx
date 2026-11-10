import { useState, useEffect, useRef } from "react";
import { api } from "../../api/client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your AI shopping assistant. Looking for a phone? Ask me anything!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // --- VOICE STATES ---
  const [isListening, setIsListening] = useState(false);
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true); // Toggle for auto-speak
  const recognitionRef = useRef<any>(null);

  // Setup Speech Recognition (Voice Input)
  useEffect(() => {
    // Check if browser supports it
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      }
    }
  };

  // Setup Text to Speech (Voice Output)
  const speakText = (text: string) => {
    if (!isSpeechEnabled || !window.speechSynthesis) return;
    
    // Stop any currently playing audio
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1; // Speed
    utterance.pitch = 1; // Tone
    // Optional: Try to find a specific voice
    // const voices = window.speechSynthesis.getVoices();
    // utterance.voice = voices.find(v => v.lang === "en-US") || voices[0];
    
    window.speechSynthesis.speak(utterance);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const { data } = await api.post("/catalog/ai-assistant/", { message: userMsg });
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      
      // READ THE REPLY OUT LOUD
      speakText(data.reply);
      
    } catch (error) {
      const errorMsg = "Sorry, I'm having trouble connecting right now.";
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
      speakText(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-xl">✨</span>
              <h3 className="font-bold">AI Assistant</h3>
            </div>
            <div className="flex items-center gap-3">
              {/* Speaker Toggle */}
              <button 
                onClick={() => {
                  setIsSpeechEnabled(!isSpeechEnabled);
                  if (isSpeechEnabled) window.speechSynthesis.cancel(); // Stop talking if turned off
                }}
                title="Toggle Voice Output"
                className={`text-lg transition-opacity ${isSpeechEnabled ? "opacity-100" : "opacity-40"}`}
              >
                {isSpeechEnabled ? "🔊" : "🔇"}
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">✕</button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 p-3 rounded-xl rounded-bl-none shadow-sm text-gray-500 text-sm flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce delay-100">●</span>
                  <span className="animate-bounce delay-200">●</span>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 items-center">
            
            {/* Microphone Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2 rounded-lg transition-colors ${
                isListening ? "bg-red-100 text-red-600 animate-pulse" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
              title="Speak your question"
            >
              🎤
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask about a phone..."}
              className="flex-1 input text-sm py-2"
              disabled={isListening}
            />
            
            <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-4 py-2 text-sm rounded-lg">
              Send
            </button>
          </form>
        </div>
      ) : (
        /* Floating Button */
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open AI shopping assistant"
          title="AI Shopping Assistant"
          className="robot-button w-16 h-16 rounded-full overflow-hidden shadow-xl border-2 border-blue-400 hover:scale-105 transition-transform"
        >
          <img
            src="ai-robot.png"
            alt="AI Shopping Assistant"
            className="robot-image w-full h-full object-cover"
          />
        </button>
      )}
    </div>
  );
}