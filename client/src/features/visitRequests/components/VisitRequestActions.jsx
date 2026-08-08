import { useState } from "react";
import { useAuth } from "../../../auth/AuthContext";
import { visitRequestsApi } from "../../../api/visitRequestsApi";
import { getErrorMessage } from "../../../utils/errorMessages";
import { ROLES, VISIT_STATUS } from "../../../utils/constants";
import { Button } from "../../../components/ui/Button";
import { ConfirmDialog } from "../../../components/ui/ConfirmDialog";
import { ActionReasonModal } from "./ActionReasonModal";

// No modal is open, or one of these five is active.
const ACTIONS = {
  APPROVE: "approve",
  REJECT: "reject",
  CHECK_IN: "checkIn",
  CHECK_OUT: "checkOut",
  CANCEL: "cancel",
};

export function VisitRequestActions({ request, onActionComplete }) {
  const { user } = useAuth();
  const [activeAction, setActiveAction] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const closeModal = () => {
    setActiveAction(null);
    setActionError("");
  };

  const runAction = async (apiCall) => {
    setIsSubmitting(true);
    setActionError("");
    try {
      await apiCall();
      setActiveAction(null);
      onActionComplete();
    } catch (err) {
      setActionError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const canApproveReject =
    user.role === ROLES.EMPLOYEE && request.status === VISIT_STATUS.PENDING;
  const canCheckIn =
    user.role === ROLES.RECEPTIONIST &&
    request.status === VISIT_STATUS.APPROVED;
  const canCheckOut =
    user.role === ROLES.RECEPTIONIST &&
    request.status === VISIT_STATUS.CHECKED_IN;
  const canCancel =
    (user.role === ROLES.RECEPTIONIST || user.role === ROLES.ADMIN) &&
    (request.status === VISIT_STATUS.PENDING ||
      request.status === VISIT_STATUS.APPROVED);

  const hasAnyAction =
    canApproveReject || canCheckIn || canCheckOut || canCancel;

  if (!hasAnyAction) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {canApproveReject && (
        <>
          <Button onClick={() => setActiveAction(ACTIONS.APPROVE)}>
            Approve
          </Button>
          <Button
            variant="danger"
            onClick={() => setActiveAction(ACTIONS.REJECT)}
          >
            Reject
          </Button>
        </>
      )}

      {canCheckIn && (
        <Button onClick={() => setActiveAction(ACTIONS.CHECK_IN)}>
          Check In
        </Button>
      )}

      {canCheckOut && (
        <Button onClick={() => setActiveAction(ACTIONS.CHECK_OUT)}>
          Check Out
        </Button>
      )}

      {canCancel && (
        <Button
          variant="secondary"
          onClick={() => setActiveAction(ACTIONS.CANCEL)}
        >
          Cancel Visit
        </Button>
      )}

      {activeAction === ACTIONS.APPROVE && (
        <ConfirmDialog
          title="Approve Visit Request"
          message="This visitor will be approved and the receptionist can check them in."
          confirmLabel="Approve"
          isSubmitting={isSubmitting}
          error={actionError}
          onConfirm={() =>
            runAction(() => visitRequestsApi.approve(request._id))
          }
          onClose={closeModal}
        />
      )}

      {activeAction === ACTIONS.REJECT && (
        <ActionReasonModal
          title="Reject Visit Request"
          label="Reason for rejection"
          confirmLabel="Reject"
          variant="danger"
          isSubmitting={isSubmitting}
          error={actionError}
          onConfirm={(remarks) =>
            runAction(() => visitRequestsApi.reject(request._id, remarks))
          }
          onClose={closeModal}
        />
      )}

      {activeAction === ACTIONS.CHECK_IN && (
        <ConfirmDialog
          title="Check In Visitor"
          message="Confirm this visitor has arrived and is being checked in now."
          confirmLabel="Check In"
          isSubmitting={isSubmitting}
          error={actionError}
          onConfirm={() =>
            runAction(() => visitRequestsApi.checkIn(request._id))
          }
          onClose={closeModal}
        />
      )}

      {activeAction === ACTIONS.CHECK_OUT && (
        <ConfirmDialog
          title="Check Out Visitor"
          message="Confirm this visitor is leaving and is being checked out now."
          confirmLabel="Check Out"
          isSubmitting={isSubmitting}
          error={actionError}
          onConfirm={() =>
            runAction(() => visitRequestsApi.checkOut(request._id))
          }
          onClose={closeModal}
        />
      )}

      {activeAction === ACTIONS.CANCEL && (
        <ActionReasonModal
          title="Cancel Visit"
          label="Reason for cancellation"
          confirmLabel="Cancel Visit"
          variant="danger"
          isSubmitting={isSubmitting}
          error={actionError}
          onConfirm={(cancelReason) =>
            runAction(() => visitRequestsApi.cancel(request._id, cancelReason))
          }
          onClose={closeModal}
        />
      )}
    </div>
  );
}
