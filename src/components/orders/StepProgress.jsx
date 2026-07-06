import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const StepProgress = ({ steps, currentStep, onStepClick }) => {
  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      {/* Progress bar */}
      <div className="relative h-2 bg-[hsl(var(--muted))] rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-[hsl(var(--primary))]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      {/* Steps */}
      <div className="flex justify-between mt-5">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStep;
          const isDone = index < currentStep;

          return (
            <button
              key={step.label}
              onClick={() => onStepClick(index)}
              disabled={index > currentStep}
              className="flex flex-col items-center gap-1 w-full"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition
                  ${
                    isDone
                      ? "bg-[hsl(var(--primary))] border-[hsl(var(--primary))] text-white"
                      : isActive
                      ? "border-[hsl(var(--primary))]text-[hsl(var(--primary))]"
                      : "border-[hsl(var(--border))] text-muted-foreground"
                  }
                `}
              >
                {isDone ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
              </div>
              <span
                className={`text-xs
                  ${
                    isActive
                      ? "text-[hsl(var(--primary))]"
                      : isDone
                      ? "text-[hsl(var(--primary))]/70"
                      : "text-[hsl(var(--muted-foreground))]"
                  }
                `}
              >
                {step.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StepProgress;