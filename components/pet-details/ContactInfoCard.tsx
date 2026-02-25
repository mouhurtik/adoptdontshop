'use client';

import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, User, MessageCircle, Loader2, Send, X, ArrowLeft } from 'lucide-react';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/contexts/AuthContext';
import { useStartConversation, useConversationMessages, useSendMessage, useMessageRealtime } from '@/hooks/useMessages';
import { formatDistanceToNow } from 'date-fns';

interface ContactInfoCardProps {
  petId?: string;
  petLocation?: string;
}

type CaregiverInfo = {
  caregiver_name: string;
  mobile: string;
  location: string;
  user_id: string | null;
};

const ContactInfoCard = ({ petId, petLocation }: ContactInfoCardProps) => {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const startConversation = useStartConversation();

  const [caregiverInfo, setCaregiverInfo] = useState<CaregiverInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading: messagesLoading } = useConversationMessages(conversationId);
  const sendMessage = useSendMessage();
  useMessageRealtime(conversationId);

  useEffect(() => {
    const fetchCaregiverInfo = async () => {
      if (!petId) { setIsLoading(false); return; }
      try {
        const { data, error } = await supabase
          .from('pet_listings')
          .select('caregiver_name, mobile, location, user_id')
          .eq('id', petId)
          .single();
        if (error) return;
        setCaregiverInfo(data);
      } catch (error) {
        console.error('Failed to fetch caregiver info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCaregiverInfo();
  }, [petId]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOpenChat = useCallback(async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (!caregiverInfo?.user_id || !petId) return;

    setIsStarting(true);
    try {
      const convId = await startConversation.mutateAsync({
        recipientId: caregiverInfo.user_id,
        petListingId: petId,
        initialMessage: `Hi! I'm interested in adopting this pet.`,
      });
      setConversationId(convId);
      setChatOpen(true);
    } catch (error) {
      console.error('Failed to start conversation:', error);
    } finally {
      setIsStarting(false);
    }
  }, [isAuthenticated, caregiverInfo, petId, router, startConversation]);

  const handleSend = useCallback(() => {
    if (!messageInput.trim() || !conversationId) return;
    sendMessage.mutate({ conversationId, content: messageInput.trim() });
    setMessageInput('');
  }, [messageInput, conversationId, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isOwnPet = user?.id === caregiverInfo?.user_id;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-soft border border-gray-100 w-full lg:w-96 flex-shrink-0 h-fit sticky top-24"
      >
        <h3 className="text-xl lg:text-2xl font-heading font-bold text-playful-text mb-4 lg:mb-6">
          Contact Information
        </h3>

        <div className="space-y-4 lg:space-y-6">
          <div className="flex items-start gap-4">
            <div className="bg-playful-coral/10 p-3 rounded-full text-playful-coral"><User className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-gray-800">Caregiver</p>
              {isLoading ? <Skeleton className="h-5 w-32 mt-1" /> : <p className="text-gray-600">{caregiverInfo?.caregiver_name || 'Not available'}</p>}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-playful-teal/10 p-3 rounded-full text-playful-teal"><Phone className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-gray-800">Phone</p>
              {isLoading ? <Skeleton className="h-5 w-32 mt-1" /> : <p className="text-gray-600">{caregiverInfo?.mobile || 'Not available'}</p>}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-playful-lavender/30 p-3 rounded-full text-purple-600"><MapPin className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-gray-800">Location</p>
              {isLoading ? <Skeleton className="h-5 w-32 mt-1" /> : <p className="text-gray-600">{caregiverInfo?.location || petLocation || 'Not available'}</p>}
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="bg-playful-yellow/20 p-3 rounded-full text-yellow-600"><Clock className="w-5 h-5" /></div>
            <div>
              <p className="font-bold text-gray-800">Availability</p>
              <p className="text-gray-600">Contact for details</p>
            </div>
          </div>
        </div>

        {/* Message Caregiver Button */}
        {!isOwnPet && caregiverInfo?.user_id && (
          <button
            onClick={handleOpenChat}
            disabled={isStarting}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-playful-teal text-white py-3 px-6 rounded-full font-bold hover:bg-playful-teal/90 transition-all shadow-md hover:shadow-lg disabled:opacity-60"
          >
            {isStarting ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Opening Chat...</>
            ) : (
              <><MessageCircle className="w-5 h-5" /> Message Caregiver</>
            )}
          </button>
        )}

        {/* Map Placeholder */}
        <div className="mt-6 rounded-2xl overflow-hidden h-48 bg-gray-100 relative group">
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600"
            alt="Map location"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-transparent transition-colors">
            <div className="bg-white p-2 rounded-full shadow-lg">
              <MapPin className="w-6 h-6 text-playful-coral" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Floating Chat Popout ── */}
      {chatOpen && conversationId && (
        <div className="fixed bottom-4 right-4 z-[60] w-[380px] max-w-[calc(100vw-2rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="flex items-center gap-3 px-4 py-3 bg-playful-teal text-white rounded-t-2xl shrink-0">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{caregiverInfo?.caregiver_name || 'Caregiver'}</p>
              <p className="text-xs text-white/70">Pet conversation</p>
            </div>
            <button
              onClick={() => router.push(`/messages?conv=${conversationId}`)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
              title="Open full messages"
            >
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </button>
            <button
              onClick={() => setChatOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
            {messagesLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="w-6 h-6 animate-spin text-playful-coral" />
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                Start the conversation!
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.is_mine ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${msg.is_mine
                      ? 'bg-playful-coral text-white rounded-br-md'
                      : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                    }`}>
                    <p>{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${msg.is_mine ? 'text-white/60' : 'text-gray-400'}`}>
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-2 border-t border-gray-100 bg-white shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 text-sm rounded-full bg-gray-100 focus:bg-white focus:ring-2 focus:ring-playful-coral/30 border border-transparent focus:border-playful-coral/30 outline-none transition-all"
                autoFocus
              />
              <button
                onClick={handleSend}
                disabled={!messageInput.trim() || sendMessage.isPending}
                className="p-2 bg-playful-coral text-white rounded-full hover:bg-playful-coral/90 disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ContactInfoCard;
