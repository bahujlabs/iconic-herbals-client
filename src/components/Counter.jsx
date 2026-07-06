import { useState, useEffect } from "react";

// Counter component
const Counter = ({ target, suffix, active }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return; // Prevent counting when the component is not in view

    let start = 0;
    const duration = 2000; // Duration of counting animation in ms
    const step = target / (duration / 16); // Calculate the step for each interval

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target); // Set to target when the count reaches it
        clearInterval(timer); // Clear the interval once the target is reached
      } else {
        setCount(Math.floor(start)); // Update the count progressively
      }
    }, 16); // Interval time to update count

    return () => clearInterval(timer); // Cleanup interval on unmount
  }, [active, target]); // Re-run the effect if `active` or `target` changes

  return (
    <div>
      <p>{count}{suffix}</p>
    </div>
  );
};

export default Counter;