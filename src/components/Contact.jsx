import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, Clock, ArrowRight } from "lucide-react";

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "hello@herbavita.com",
    href: "mailto:hello@herbavita.com",
    color: "from-primary to-emerald-400",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (800) 432-7228",
    href: "tel:+18004327228",
    color: "from-amber-400 to-orange-500",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "123 Botanical Ave, Portland",
    href: "#",
    color: "from-sky-400 to-blue-500",
  },
  {
    icon: Clock,
    label: "Working Hours",
    value: "Mon – Fri, 9AM – 6PM",
    href: "#",
    color: "from-violet-400 to-purple-500",
  },
];

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setSent(true);

    setTimeout(() => {
      setSent(false);
    }, 3000);

    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-primary/5 blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-accent/5 blur-3xl"
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4"
          >
            Get In Touch
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            We'd Love to <span className="text-primary">Hear From You</span>
          </h2>

          <p className="text-muted-foreground max-w-lg mx-auto">
            Have a question about our products or need guidance? Reach out — our
            team is here to help you on your wellness journey.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10 items-start">
          {/* Contact Cards */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="lg:col-span-2 flex flex-col gap-4"
          >
            {contactInfo.map((item, i) => {
              const Icon = item.icon;

              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{
                    opacity: 0,
                    x: -30,
                  }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.2,
                  }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + i * 0.1,
                  }}
                  whileHover={{
                    x: 6,
                    scale: 1.02,
                  }}
                  className="group flex items-center gap-4 p-5 rounded-2xl glass-strong hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shrink-0 shadow-md`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                      {item.label}
                    </p>

                    <p className="text-sm font-bold text-foreground truncate">
                      {item.value}
                    </p>
                  </div>

                  <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.a>
              );
            })}

            {/* Social proof */}
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
                delay: 0.7,
              }}
              className="mt-2 p-5 rounded-2xl bg-primary/5 border border-primary/10"
            >
              <p className="text-sm font-semibold text-foreground mb-1">
                ⚡ Quick Response
              </p>

              <p className="text-xs text-muted-foreground">
                Average reply time under 2 hours. We respond to every message
                personally.
              </p>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
            className="lg:col-span-3"
          >
            <form
              onSubmit={handleSubmit}
              className="glass-strong rounded-3xl p-8 sm:p-10 relative overflow-hidden"
            >
              {/* Decorative corner glow */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.5,
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.8,
                }}
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-primary/10 blur-2xl pointer-events-none"
              />

              <div className="grid sm:grid-cols-2 gap-5 mb-5 relative z-10">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Your Name
                  </label>

                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                    Email Address
                  </label>

                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div className="mb-6 relative z-10">
                <label className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                  Your Message
                </label>

                <motion.textarea
                  whileFocus={{ scale: 1.005 }}
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      message: e.target.value,
                    })
                  }
                  placeholder="Tell us how we can help..."
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                />
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity relative z-10"
              >
                {sent ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    ✓ Message Sent!
                  </motion.span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
