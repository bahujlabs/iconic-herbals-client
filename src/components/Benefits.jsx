import { motion } from "framer-motion";
import { Heart, Shield, Zap, Droplets, Leaf, Sparkles } from "lucide-react";

const benefits = [
  { icon: Heart, title: "Heart Health", desc: "Supports cardiovascular wellness with powerful antioxidants." },
  { icon: Shield, title: "Immune Boost", desc: "Strengthens your body's natural defense system." },
  { icon: Zap, title: "Natural Energy", desc: "Sustained vitality without caffeine crashes." },
  { icon: Droplets, title: "Detox & Cleanse", desc: "Gently purifies your body from within." },
  { icon: Leaf, title: "100% Organic", desc: "Sourced from certified organic botanical gardens." },
  { icon: Sparkles, title: "Anti-Aging", desc: "Rich in compounds that promote cellular renewal." },
];

const Benefits = () => {
  return (
    <section id="benefits" className="py-24 bg-[hsl(var(--muted))]/50">
        <div className="container mx-auto px-6">
            <motion.div 
                initial={{opacity:0, y:40}}
                animate = {{opacity:1, y:0}}
                transition={{duration:0.6}}
                className="text-center mb-16"
                >
                <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] mb-4">Why <span className="text-[hsl(var(--primary))]">Iconic Herbal Mixture</span>?</h2>
                <p className="text-[hsl(var(--muted-foreground))]"> Every drop is packed with nature's most potent healing compounds.</p>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit,i)=>(
                   <motion.div
                        initial={{opacity:0, y:40}}
                        animate={{opacity:1, y:0}}
                        transition={{duration:0.5, delay: i * 0.2}}
                        className="glass-strong rounded-2xl group p-6 cursor-default"
                   >
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-[hsl(var(--primary))]/20 transition-colors">
                            <benefit.icon className="w-6 h-6 text-[hsl(var(--primary))]"/>
                        </div>
                        <h3 className="font-[var(--display)] text-lg font-semibold text-[hsl(var(--foreground))] mb-2">{benefit.title}</h3>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{benefit.desc}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  )
}

export default Benefits