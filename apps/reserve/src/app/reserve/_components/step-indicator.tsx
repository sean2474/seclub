import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: 1 | 2 | 3 | 4;
}

const steps = [
  { number: 1, label: "Select Stay" },
  { number: 2, label: "Guest Details" },
  { number: 3, label: "Payment" },
  { number: 4, label: "Complete" },
];

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <nav aria-label="예약 진행 단계" className="w-full">
      <ol className="flex items-center justify-center gap-2 md:gap-4">
        {steps.map((step, index) => {
          const isCompleted = step.number < currentStep;
          const isCurrent = step.number === currentStep;
          const isUpcoming = step.number > currentStep;

          return (
            <li key={step.number} className="flex items-center">
              <div className="flex items-center gap-2">
                <span
                  className={`
                    flex size-8 items-center justify-center rounded-full text-sm font-medium
                    ${isCompleted ? "bg-primary text-primary-foreground" : ""}
                    ${isCurrent ? "bg-foreground text-background" : ""}
                    ${isUpcoming ? "bg-foreground/10 text-foreground/40" : ""}
                  `}
                >
                  {isCompleted ? (
                    <Check className="size-4" />
                  ) : (
                    step.number
                  )}
                </span>
                <span
                  className={`
                    hidden text-sm md:block
                    ${isCompleted ? "text-foreground" : ""}
                    ${isCurrent ? "font-medium text-foreground" : ""}
                    ${isUpcoming ? "text-foreground/40" : ""}
                  `}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`
                    mx-2 h-px w-8 md:mx-4 md:w-12
                    ${step.number < currentStep ? "bg-primary" : "bg-foreground/20"}
                  `}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
