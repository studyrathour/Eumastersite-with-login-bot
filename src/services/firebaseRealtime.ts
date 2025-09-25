import { 
  ref, 
  push, 
  set, 
  onValue, 
  query, 
  orderByChild, 
  limitToLast, 
  startAt,
  serverTimestamp,
  off
} from 'firebase/database';
import { realtimeDb } from '../firebase/realtimeConfig';
import { ChatMessage, DoubtQuestion, ChatMessageWithoutId, DoubtQuestionWithoutId } from '../types/chat';

export class FirebaseRealtimeService {
  // Chat Operations
  static async addChatMessage(roomId: string, message: ChatMessageWithoutId): Promise<void> {
    try {
      const chatRef = ref(realtimeDb, `rooms/${roomId}/chats`);
      const newChatRef = push(chatRef);
      await set(newChatRef, { 
        ...message, 
        timestamp: serverTimestamp() 
      });
    } catch (error) {
      console.error('Error adding chat message:', error);
      throw error;
    }
  }

  static subscribeToChatMessages(
    roomId: string, 
    callback: (messages: ChatMessage[]) => void,
    startTime?: number
  ): () => void {
    const chatRef = ref(realtimeDb, `rooms/${roomId}/chats`);
    
    const chatQuery = startTime
      ? query(chatRef, orderByChild('timestamp'), startAt(startTime))
      : query(chatRef, orderByChild('timestamp'), limitToLast(500));

    const unsubscribe = onValue(chatQuery, (snapshot) => {
      const messages: ChatMessage[] = [];
      
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        messages.push({
          id: childSnapshot.key!,
          ...data,
          timestamp: data.timestamp || Date.now()
        });
      });

      // Sort by timestamp ascending
      messages.sort((a, b) => a.timestamp - b.timestamp);
      callback(messages);
    });

    return () => off(chatQuery, 'value', unsubscribe);
  }

  // Doubt Operations
  static async addDoubtQuestion(roomId: string, doubt: DoubtQuestionWithoutId): Promise<void> {
    try {
      const doubtRef = ref(realtimeDb, `rooms/${roomId}/doubts`);
      const newDoubtRef = push(doubtRef);
      await set(newDoubtRef, { 
        ...doubt, 
        timestamp: serverTimestamp() 
      });
    } catch (error) {
      console.error('Error adding doubt question:', error);
      throw error;
    }
  }

  static subscribeToDoubtQuestions(
    roomId: string, 
    callback: (doubts: DoubtQuestion[]) => void
  ): () => void {
    const doubtRef = ref(realtimeDb, `rooms/${roomId}/doubts`);
    const doubtQuery = query(doubtRef, orderByChild('timestamp'));

    const unsubscribe = onValue(doubtQuery, (snapshot) => {
      const doubts: DoubtQuestion[] = [];
      
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        doubts.push({
          id: childSnapshot.key!,
          ...data,
          timestamp: data.timestamp || Date.now()
        });
      });

      // Sort by timestamp descending (newest first)
      doubts.sort((a, b) => b.timestamp - a.timestamp);
      callback(doubts);
    });

    return () => off(doubtQuery, 'value', unsubscribe);
  }

  // Utility function to capture video frame
  static captureVideoFrame(videoElement: HTMLVideoElement): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return '';
      
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      
      ctx.drawImage(videoElement, 0, 0);
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error('Error capturing video frame:', error);
      return '';
    }
  }

  // Generate AI response for doubt (placeholder)
  static async generateAIResponse(question: string): Promise<string> {
    // This is a placeholder - in real implementation, you'd call your AI service
    const responses = [
      "Aapka question bahut accha hai! Main iska jawab de raha hun...",
      "Ye concept samjhane ke liye main ek example deta hun...",
      "Is topic ke bare mein detail mein baat karte hain...",
      "Aapko jo doubt hai, wo bilkul valid hai. Iska solution ye hai..."
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return responses[Math.floor(Math.random() * responses.length)];
  }
}