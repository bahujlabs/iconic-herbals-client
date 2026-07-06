import { useState, useEffect } from "react";
import Counter from "./Counter"; // Import the Counter component

const Stats = () => {
  const [inView, setInView] = useState(false);

  // Simulate an inView check (replace with real logic)
  useEffect(() => {
    const timer = setTimeout(() => setInView(true), 1000); // Simulate the component coming into view after 1 second
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []);

  const stats = [
    { label: "Happy Customers", target: 12500, suffix: "+" },
    { label: "Bottles Sold", target: 45000, suffix: "+" },
    { label: "Natural Ingredients", target: 24, suffix: "" },
    { label: "Countries", target: 18, suffix: "" },
  ];

  return (
    <section className="py-16 gradient-hero">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat,i) => (
            <div 
              key={stat.label}
              initial ={{opacity:0,y:30}}
              animate = {inView ? {opacity:1, y:0} :{}}
              transition ={{duration: 0.5, delay: i * 0.1}}
              className="text-center"
            >
              <div className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: "hsl(60, 30%, 96%)" }}>
                <Counter target={stat.target} suffix={stat.suffix} active={inView} />
              </div>
              <p className="text-sm" style={{ color: "hsl(140, 15%, 60%)" }}>{stat.label}</p>
            </div>
          
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;