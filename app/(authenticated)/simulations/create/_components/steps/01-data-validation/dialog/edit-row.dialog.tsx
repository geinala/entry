import React, { FormEvent } from "react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Label } from "@/app/_components/ui/label";
import DateTimeInput from "@/app/_components/ui/datetime-input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";

import { Textarea } from "@/app/_components/ui/textarea";
import { TEditableRowForm, TSimulationUploadedRowWithErrors } from "../../../../_utils/helpers";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedRow: TSimulationUploadedRowWithErrors | null;
  formValues: TEditableRowForm | null;
  setFormValues: (fn: (current: TEditableRowForm | null) => TEditableRowForm | null) => void;
  isUpdatingRow: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void> | void;
};

const EditRowDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  selectedRow,
  formValues,
  setFormValues,
  isUpdatingRow,
  onSubmit,
}) => {
  return (
    <Dialog open={open} onOpenChange={(open) => (!open ? onOpenChange(false) : null)}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Uploaded Row</DialogTitle>
          <DialogDescription>
            Update this row, then save it to remove it from the error-only list.
          </DialogDescription>
        </DialogHeader>

        {selectedRow && formValues && (
          <form className="space-y-3" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nosi">No SI</Label>
                <Input
                  id="nosi"
                  value={formValues.nosi}
                  onChange={(event) =>
                    setFormValues((current) =>
                      current ? { ...current, nosi: event.target.value } : current,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courier">Courier</Label>
                <Input
                  id="courier"
                  value={formValues.courier}
                  onChange={(event) =>
                    setFormValues((current) =>
                      current ? { ...current, courier: event.target.value } : current,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formValues.customerName}
                  onChange={(event) =>
                    setFormValues((current) =>
                      current ? { ...current, customerName: event.target.value } : current,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formValues.city}
                  onChange={(event) =>
                    setFormValues((current) =>
                      current ? { ...current, city: event.target.value } : current,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDatetime">Start Datetime</Label>
                <DateTimeInput
                  id="startDatetime"
                  value={formValues.startDatetime}
                  onChange={(value) =>
                    setFormValues((current) =>
                      current ? { ...current, startDatetime: value } : current,
                    )
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDatetime">End Datetime</Label>
                <DateTimeInput
                  id="endDatetime"
                  value={formValues.endDatetime}
                  onChange={(value) =>
                    setFormValues((current) =>
                      current ? { ...current, endDatetime: value } : current,
                    )
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formValues.weight}
                  onChange={(event) =>
                    setFormValues((current) =>
                      current ? { ...current, weight: event.target.value } : current,
                    )
                  }
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formValues.address}
                  onChange={(event) =>
                    setFormValues((current) =>
                      current ? { ...current, address: event.target.value } : current,
                    )
                  }
                />
              </div>
            </div>

            <DialogFooter showCloseButton>
              <Button type="submit" disabled={isUpdatingRow}>
                {isUpdatingRow ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditRowDialog;
