import { useState,useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
const testimonials = [
  { name: "Sarah M.", role: "Wellness Coach", text: "HerbaVita transformed my morning routine. I feel more energized and focused throughout the day — completely naturally.", rating: 5 },
  { name: "James K.", role: "Fitness Trainer", text: "I've tried dozens of supplements. Nothing compares to the purity and effectiveness of HerbaVita. My clients love it too.", rating: 5 },
  { name: "Amira R.", role: "Yoga Instructor", text: "The quality is unmatched. You can taste the difference — fresh, clean, and powerful. It's become an essential part of my practice.", rating: 5 },
  { name: "David L.", role: "Nutritionist", text: "Finally a herbal product that delivers on its promises. I recommend HerbaVita to all my clients seeking natural wellness solutions.", rating: 5 },
]
const Testimonials = () => {
    const [current, setCurrent] = useState(0)
    const ref = useRef(null)
    const inView = useInView(ref, {once:true, amount:0.2})

    const prev = ()=>setCurrent((c)=>c === 0 ? testimonials.length - 1 : c -1 )
    const next = ()=>setCurrent((c)=> c=== testimonials.length-1 ? 0: c + 1)

  return (
    <section className="py-24 bg-[hsl(var(--muted))]/50" ref={ref}>
        <div className="container mx-auto px-6">
           <motion.div
            initial={{opacity:0, y:40}}
            animate={inView ? {opacity:1, y:0}:{}}
            transition={{duration:0.6}}
            className="text-center mb-16"
           >
                <h2 className="text-3xl sm:text-4xl font-bold text-[hsl(var(--foreground))] mb-4">Loved by <span className="text-[hsl(var(--primary))]">Thousands</span></h2>
                <p className="text-[hsl(var(--muted-foreground mx-auto))]">Real Stories from real People trust iconic herbal mix with their natural wellness</p>
           </motion.div> 
           <div className="max-w-2xl mx-auto relative">
             <AnimatePresence mode="wait">
                <motion.div 
                    key={current}
                    initial={{opacity:0, scale:0.95, x:40}}
                    animate = {{opacity: 1, scale:1, x:0}}
                    exit={{opacity:0, scale:0.95,x:-40}}
                    transition={{duration:0.4}}
                    className="glass-strong rounded-xl p-8 text-center">
                    <div className="flex justify-center gap-1 mb-4">
                        {[...Array(testimonials[current].rating)].map((_,i)=>(
                            <Star key={i} className="w-5 h-5 text-[hsl(var(--accent))] fill-[hsl(var(--accent))]"/>
                        ))}
                    </div>
                    <p className ='font-[var(--display)] font-semibold text-lg leading-relaxed mb-6 italic'>{testimonials[current].text}</p>
                    <p className = 'font-[var(--display)] font-semibold text-[hsl(var(--foreground))]'>{testimonials[current].name}</p>
                    <p className="text-sm text-[hsl(var(--muted-foreground))]">{testimonials[current].role}</p>
                </motion.div>
             </AnimatePresence>
                <div className="flex justify-center gap-4 mt-8">
                   <motion.button
                    whileTap={{scale:0.9}}
                    onClick={prev}
                    className="w-10 h-10 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-center justify-center hover:bg-[hsl(var(--muted))]"
                   >
                      <ChevronLeft className="h-4 w-4"/>
                   </motion.button>
                    <div>
                         {testimonials.map((_, i) => (
                            <button
                            key={i}
                            onClick={() => setCurrent(i)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                i === current
                                ? 'bg-[hsl(var(--primary))] w-6'
                                : 'border-[hsl(var(--border))] border'
                            }`}
                            />
                        ))}
                    </div>
                    <button
                        whileTap={{scale:0.9}}
                        onClick={next}
                        className="w-10 h-10 rounded-full bg-[hsl(var(--card))] border border-[hsl(var(--border))] flex items-center justify-center hover:bg-[hsl(var(--muted))]"
                    >
                        <ChevronRight className="w-4 h-4"/>
                    </button>
                </div>
           </div>
        </div>
    </section>
  )
}

export default Testimonials