/**
 * ProgressIndicator Component
 * A simple progress bar component for displaying completion status
 *
 * @example
 * <ProgressIndicator value={75} />
 */

interface ProgressIndicatorProps {
  /** Progress value between 0-100 */
  value: number;
  /** Optional CSS class name */
  className?: string;
}

export const ProgressIndicator = ({ value, className = "" }: ProgressIndicatorProps) => {
  // Clamp value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  return (
    <div className={`w-full bg-muted rounded-full h-2 ${className}`}>
      <div
        className="bg-primary h-2 rounded-full transition-all duration-300 ease-in-out"
        style={{ width: `${clampedValue}%` }}
        role="progressbar"
        aria-valuenow={clampedValue}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </div>
  );
};
