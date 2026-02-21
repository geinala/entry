import { Button } from "@/app/_components/ui/button";
import { CheckCircle, Trash, XCircle } from "lucide-react";

interface IWaitlistActionToastProps {
  onClearSelection: () => void;
  onDeny: () => void;
  onInvite: () => void;
  onRevoke?: () => void;
  availableActions?: Set<string>;
}

export const WaitlistActionToast = (props: IWaitlistActionToastProps) => {
  const hasAction = (actionId: string) => {
    if (!props.availableActions || props.availableActions.size === 0) return true;
    return props.availableActions.has(actionId);
  };

  return (
    <div className="flex items-start gap-2">
      <Button variant="outline" size={"sm"} onClick={props.onClearSelection}>
        Clear Selection
      </Button>
      {hasAction("deny") && (
        <Button variant="destructive" size={"sm"} onClick={props.onDeny}>
          <XCircle className="w-4 h-4" />
          Deny
        </Button>
      )}
      {hasAction("revoke") && props.onRevoke && (
        <Button variant="destructive" size={"sm"} onClick={props.onRevoke}>
          <Trash className="w-4 h-4" />
          Revoke
        </Button>
      )}
      {hasAction("send") && (
        <Button size={"sm"} onClick={props.onInvite}>
          <CheckCircle className="w-4 h-4" />
          Invite
        </Button>
      )}
      {hasAction("reinvite") && (
        <Button size={"sm"} onClick={props.onInvite}>
          <CheckCircle className="w-4 h-4" />
          Reinvite
        </Button>
      )}
    </div>
  );
};
