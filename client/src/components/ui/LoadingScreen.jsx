import { Spinner } from "./Spinner";

export function LoadingScreen() {
  return (
    <div className="flex h-64 items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
