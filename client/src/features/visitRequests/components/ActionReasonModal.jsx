import { useState } from "react";
import { Modal } from "../../../components/ui/Modal";
import { Button } from "../../../components/ui/Button";
import { Textarea } from "../../../components/ui/Textarea";

export function ActionReasonModal({
  title,
  label,
  confirmLabel,
  variant = "primary",
  isSubmitting,
  error,
  onConfirm,
  onClose,
}) {
  const [reason, setReason] = useState("");

  return (
    <Modal title={title} onClose={onClose}>
      <Textarea
        id="action-reason"
        label={label}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Optional"
      />

      {error && (
        <p
          role="alert"
          className="mt-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          onClick={onClose}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant={variant}
          loading={isSubmitting}
          onClick={() => onConfirm(reason.trim() || undefined)}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
