import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, MessageCircle, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'customer' | 'provider';
  timestamp: Date;
  senderName: string;
}

interface ChatModalProps {
  trigger: React.ReactNode;
  providerName: string;
  providerId: number;
  customerName: string;
}

export const ChatModal = ({ trigger, providerName, providerId, customerName }: ChatModalProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Load messages from localStorage
  useEffect(() => {
    const chatKey = `chat_${providerId}`;
    const storedMessages = localStorage.getItem(chatKey);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, [providerId]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'customer',
      timestamp: new Date(),
      senderName: customerName
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    
    // Store in localStorage
    const chatKey = `chat_${providerId}`;
    localStorage.setItem(chatKey, JSON.stringify(updatedMessages));
    
    setNewMessage("");
    setIsTyping(true);

    // Simulate typing and varied responses
    const responses = [
      "Sure! I can make it less spicy for you. Would you like it mild or completely non-spicy?",
      "Of course! I'll prepare it with no spice. Any other customizations needed?",
      "No problem! I can make it very mild. Would you like extra vegetables instead?",
      "Absolutely! I'll make it without any spicy ingredients. Thanks for letting me know!",
      "I can definitely adjust the spice level. Would you prefer it completely bland or just mildly seasoned?"
    ];

    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const responseTime = Math.random() * 2000 + 1500; // 1.5-3.5 seconds

    setTimeout(() => {
      setIsTyping(false);
      const providerMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse,
        sender: 'provider',
        timestamp: new Date(),
        senderName: providerName
      };

      const allMessages = [...updatedMessages, providerMessage];
      setMessages(allMessages);
      localStorage.setItem(chatKey, JSON.stringify(allMessages));
    }, responseTime);

    toast({
      title: "Message sent",
      description: "Your message has been sent to the provider",
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[90vh] flex flex-col sm:max-w-lg md:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Chat with {providerName}
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className="text-xs text-muted-foreground">{isOnline ? 'Online' : 'Offline'}</span>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <Card className="flex-1 flex flex-col shadow-card border-0">
          <CardHeader className="pb-3">
            <CardDescription className="text-xs text-muted-foreground">
              Customize your order or ask questions
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4 max-h-80" ref={scrollAreaRef}>
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <MessageCircle className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Start a conversation with {providerName}</p>
                    <p className="text-xs">Ask about customizations, ingredients, or special requests</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === 'customer'
                            ? 'bg-gradient-primary text-white'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          <User className="w-3 h-3" />
                          <span className="text-xs font-medium">
                            {message.senderName}
                          </span>
                        </div>
                        <p className="text-sm">{message.text}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3 opacity-70" />
                          <span className="text-xs opacity-70">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-lg p-3 bg-muted text-foreground">
                      <div className="flex items-center gap-1 mb-1">
                        <User className="w-3 h-3" />
                        <span className="text-xs font-medium">{providerName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                        <span className="text-xs opacity-70 ml-2">typing...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="border-t p-3 sm:p-4">
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  disabled={isTyping}
                />
                <Button 
                  onClick={sendMessage}
                  variant="hero"
                  size="sm"
                  disabled={!newMessage.trim() || isTyping}
                  className="shrink-0"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2 px-1">
                Ask about ingredients, portion sizes, spice levels, or special requests
              </p>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};