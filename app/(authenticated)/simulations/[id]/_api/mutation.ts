import { mutationOptions } from "@tanstack/react-query";
import { AxiosInstance } from "axios";
import { toast } from "sonner";

export const simulationDetailMutation = {
  uploadCSV: (api: AxiosInstance) => {
    return mutationOptions({
      mutationFn: async ({
        formData,
        simulationId,
      }: {
        formData: FormData;
        simulationId: string;
      }) => {
        return await api.post(`/simulations/${simulationId}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      },
      onSuccess: () => {
        toast.success("CSV file uploaded successfully!");
      },
      onError: (error) => {
        console.error("Error uploading CSV file:", error);
        toast.error("Failed to upload CSV file. Please try again.");
      },
    });
  },
};
