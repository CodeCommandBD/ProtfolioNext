import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const sendContactMessage = async (data) => {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to send message");
  }

  return res.json();
};

export const useContactMutation = () => {
  return useMutation({
    mutationFn: sendContactMessage,
    onSuccess: () => {
      toast.success("Message sent successfully!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to send message");
    },
  });
};
