import { Button } from "./Button";

export function ErrorState({ message = "Something went wrong.", onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border border-red-200 bg-red-50 py-8 text-center">
      <p role="alert" className="text-sm text-red-700">
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
