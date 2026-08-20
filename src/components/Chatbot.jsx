import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { chatApi } from "../api/aichatApi.js";

const CONVERSATION_ID_KEY = "iconic_chat_conversation_id";

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
  const [error, setError] = useState(null);

  const scrollRef = useRef(null);
  const conversationIdRef = useRef(
    typeof window !== "undefined"
      ? localStorage.getItem(CONVERSATION_ID_KEY)
      : null,
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing]);

  const send = async () => {
    if (!input.trim() || typing) return;
    const userMsg = input.trim();
    setInput("");
    setError(null);
    setMessages((m) => [...m, { role: "user", text: userMsg }]);
    setTyping(true);

    try {
      // ── Adjust this payload if ChatController expects a different shape ──
      const data = await chatApi.ask({
        message: userMsg,
        conversationId: conversationIdRef.current || undefined,
      });

      // ── Adjust this destructuring if the response shape differs ──
      const { reply, conversationId } = data;

      if (conversationId) {
        conversationIdRef.current = conversationId;
        localStorage.setItem(CONVERSATION_ID_KEY, conversationId);
      }

      setMessages((m) => [...m, { role: "bot", text: reply }]);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: "Sorry, I couldn't process that. Please try again in a moment.",
        },
      ]);
    } finally {
      setTyping(false);
    }
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
              <button
                onClick={() => setOpen(false)}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
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
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
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
              {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                  placeholder="Type a message"
                  disabled={typing}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[hsl(var(--muted))] text-[hsl(var(--foreground))] text-sm placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]/30 disabled:opacity-60"
                />
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={send}
                  disabled={typing || !input.trim()}
                  className="w-10 h-10 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] flex items-center justify-center disabled:opacity-60"
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
