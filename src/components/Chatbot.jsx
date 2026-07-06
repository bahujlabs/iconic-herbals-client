import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, animate, delay } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";

const botResponses = [
  "Thanks for reaching out! iconi mixture is made from 100% organic herbs, cold-pressed for maximum potency.",
  "Our 25cl bottle is perfect for trying it out, and the 50cl offers the best value. Both ship free over $50!",
  "Great question! We recommend taking 15ml daily, either in the morning or before bed for optimal results.",
  "We ship worldwide! Orders typically arrive within 3-5 business days.",
  "Yes, HerbaVita is completely natural with no artificial additives. It's safe for daily use.",
];

const Chatbot = () => {
  const [open, setOpen] = useState(true);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Hi! welcome to Iconic Herbals. How can i help you",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const send = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setTyping(true);

    setTimeout(() => {
      setTyping(false);

      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: botResponses[Math.floor(Math.random() * botResponses.length)],
        },
      ]);
    }, 1200);
  };
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div className="glass-strong fixed bottom-24 right-6 z-50 w-[340px] sm:w-[380px] h-[480px] rounded-2xl flex flex-col overflow-hidden shadow-elevated">
            {/* Header */}
            <div className="p-4 border-b border-[hsl(var(--border))] flex items-center justify-between bg-[hsl(var(--primary))]/5">
              <div className="">
                <h4 className="font-display text-sm text-[hsl(var(--foreground))]">
                  Iconic Herbal Support
                </h4>
                <p className="text-xs text-[hsl(var(--muted-foreground))] ">
                  We typically reply instantly
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 hover:bg-muted rounded-lg transition-colors" >
                <X className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
              </button>
            </div>

            {/* messages */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
            >
              {messages.map((msg, i) => (
                <motion.div
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] rounded-br-sm "
                        : "bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-[hsl(var(--muted))] px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-2 h-2 rounded-full bg-black"
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: i * 0.15,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-[hsl(var(--border))]">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Type a message"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={send}
                  className="w-10 h-10 bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] flex items-center justify-center"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] flex items-center justify-center shadow-elevated"
      >
        <AnimatePresence>
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="w-5 h-5" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle className="w-5 h-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default Chatbot;
