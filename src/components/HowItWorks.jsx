import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Leaf, FlaskConical, Droplets, HeartPulse } from "lucide-react";

const steps = [
  { icon: Leaf, title: "Harvest", desc: "Hand-picked herbs from organic farms at peak potency." },
  { icon: FlaskConical, title: "Extract", desc: "Cold-pressed extraction preserves all vital nutrients." },
  { icon: Droplets, title: "Purify", desc: "Triple-filtered for ultimate purity and consistency." },
  { icon: HeartPulse, title: "Nourish", desc: "Enjoy daily for lasting health transformation." },
];

// ✅ Each step is its own component — hooks are always called at the top level
const StepCard = ({ step, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      key={step.title}
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.3 }}
      className="text-center relative z-10"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-4 shadow-soft"
      >
        <step.icon className="w-8 h-8 text-primary" />
      </motion.div>
      <span className="text-xs font-bold text-accent uppercase tracking-wider">
        Step {index + 1}
      </span>
      <h3 className="font-display text-lg font-semibold text-foreground mt-1 mb-2">
        {step.title}
      </h3>
      <p className="text-sm text-muted-foreground">{step.desc}</p>
    </motion.div>
  );
};

const HowItWorks = () => {
  const titleRef = useRef(null);
  const titleInView = useInView(titleRef, { once: true, amount: 0.2 });

  return (
    <section id="how-it-works" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          ref={titleRef}
          initial={{ opacity: 0, y:8 }}
          animate={titleInView ? { opacity: 1, y:0 } : {}}
          transition={{ duration: 0.6}}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            From farm to bottle — a journey of care and precision.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-border" />
          {steps.map((step, i) => (
            <StepCard key={step.title} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;