'use client';

import dynamic from 'next/dynamic';

// Dynamically import the ChatBot component with no SSR to avoid hydration issues
const ChatBot = dynamic(() => import('./ChatBot'), {
  ssr: false,
  loading: () => null, // No loading indicator needed for the floating button
});

export default function ChatBotWrapper() {
  return <ChatBot />;
}
