import { ChatContainer } from "@/components/chat";

export const metadata = {
  title: "AI Консультант | AI Legal Assistant",
  description: "Қазақстан Республикасының заңнамасы бойынша AI консультант",
};

export default function ChatPage() {
  return (
    <div className="h-[calc(100vh-140px)]">
      <ChatContainer />
    </div>
  );
}

