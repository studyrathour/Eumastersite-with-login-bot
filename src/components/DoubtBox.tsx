import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, Send, X, Camera, Clock } from 'lucide-react';
import { DoubtQuestion } from '../types/chat';
import { FirebaseRealtimeService } from '../services/firebaseRealtime';

interface DoubtBoxProps {
  roomId: string;
  userId: string;
  username: string;
  videoElement: HTMLVideoElement | null;
  currentTime: number;
  isVisible: boolean;
  onToggle: () => void;
}

const DoubtBox: React.FC<DoubtBoxProps> = ({ 
  roomId, 
  userId, 
  username, 
  videoElement,
  currentTime,
  isVisible, 
  onToggle 
}) => {
  const [doubts, setDoubts] = useState<DoubtQuestion[]>([]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [capturedFrame, setCapturedFrame] = useState<string>('');
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (roomId) {
      // Subscribe to doubt questions
      unsubscribeRef.current = FirebaseRealtimeService.subscribeToDoubtQuestions(
        roomId,
        setDoubts
      );
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [roomId]);

  const captureFrame = () => {
    if (videoElement) {
      const frame = FirebaseRealtimeService.captureVideoFrame(videoElement);
      setCapturedFrame(frame);
    }
  };

  const handleSubmitDoubt = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputQuestion.trim() || isLoading) return;

    const questionText = inputQuestion.trim();
    setInputQuestion('');
    setIsLoading(true);

    try {
      const doubtData = {
        userId,
        username,
        question: questionText,
        videoFrame: capturedFrame,
        videoTime: currentTime,
        timestamp: Date.now()
      };

      await FirebaseRealtimeService.addDoubtQuestion(roomId, doubtData);

      // Generate AI response (optional)
      try {
        const aiResponse = await FirebaseRealtimeService.generateAIResponse(questionText);
        await FirebaseRealtimeService.addDoubtQuestion(roomId, {
          userId: 'ai',
          username: 'AI Assistant',
          question: `Re: ${questionText}`,
          videoFrame: '',
          videoTime: currentTime,
          timestamp: Date.now(),
          aiResponse
        });
      } catch (aiError) {
        console.error('AI response failed:', aiError);
      }

      setCapturedFrame('');
    } catch (error) {
      console.error('Failed to submit doubt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-4 right-24 bg-orange-500 text-white p-3 rounded-full shadow-lg hover:bg-orange-600 transition-colors z-40"
        title="Ask Doubt"
      >
        <HelpCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-24 w-96 h-[500px] bg-surface border border-secondary rounded-lg shadow-xl z-40 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-secondary">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-orange-500" />
          <h3 className="font-semibold text-text-primary">Doubt Box</h3>
          <span className="text-xs text-text-tertiary">({doubts.length})</span>
        </div>
        <button
          onClick={onToggle}
          className="text-text-secondary hover:text-text-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Doubts List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {doubts.length === 0 ? (
          <div className="text-center text-text-tertiary py-8">
            <HelpCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No doubts yet</p>
            <p className="text-xs">Ask your first question!</p>
          </div>
        ) : (
          doubts.map((doubt) => (
            <div
              key={doubt.id}
              className={`p-3 rounded-lg border ${
                doubt.userId === 'ai'
                  ? 'bg-green-500/10 border-green-500/30'
                  : doubt.userId === userId
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-secondary/50 border-secondary'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-text-primary">
                    {doubt.userId === 'ai' ? '🤖 AI Assistant' : doubt.username}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-text-tertiary">
                    <Clock className="w-3 h-3" />
                    {formatTime(doubt.videoTime)}
                  </div>
                </div>
                <span className="text-xs text-text-tertiary">
                  {formatTimestamp(doubt.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-text-primary mb-2">{doubt.question}</p>
              
              {doubt.aiResponse && (
                <div className="mt-2 p-2 bg-green-500/20 rounded border border-green-500/30">
                  <p className="text-sm text-green-300">{doubt.aiResponse}</p>
                </div>
              )}
              
              {doubt.videoFrame && (
                <div className="mt-2">
                  <img
                    src={doubt.videoFrame}
                    alt="Video frame"
                    className="w-full max-w-32 h-auto rounded border border-secondary"
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-secondary">
        {capturedFrame && (
          <div className="mb-2 relative">
            <img
              src={capturedFrame}
              alt="Captured frame"
              className="w-16 h-12 object-cover rounded border border-secondary"
            />
            <button
              onClick={() => setCapturedFrame('')}
              className="absolute -top-1 -right-1 bg-danger text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
            >
              ×
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmitDoubt} className="space-y-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={captureFrame}
              disabled={!videoElement}
              className="bg-secondary text-text-primary p-2 rounded-lg hover:bg-secondary/80 disabled:opacity-50 transition-colors"
              title="Capture current frame"
            >
              <Camera className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-1 text-xs text-text-tertiary bg-background px-2 py-1 rounded">
              <Clock className="w-3 h-3" />
              {formatTime(currentTime)}
            </div>
          </div>
          
          <div className="flex gap-2">
            <textarea
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder="Ask your doubt here..."
              className="flex-1 px-3 py-2 bg-background border border-secondary rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all text-sm resize-none"
              rows={2}
              maxLength={200}
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DoubtBox;