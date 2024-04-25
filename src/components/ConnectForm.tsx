// Import necessary libraries and components
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

// schema: channel_name
// Define the form schema using zod
const formSchema = z.object({
  channelName: z.string().min(1, { message: "Channel name is required" }),
});

export const ConnectForm = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: "",
    },
  });
  // Function to navigate to the video channel
  const connectToVideo = (channelName: string) => {
    navigate(`/via/${channelName}`);
  };

  // Function to handle form submission
  function onSubmit(data: z.infer<typeof formSchema>) {
    const channelName = data.channelName;
    connectToVideo(channelName);
  }

  return (
    <main className="flex items-center justify-center h-screen">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-max px-8 py-8 border rounded shadow flex gap-2"
      >
        <div className="grid gap-1">
          <Input
            type="text"
            placeholder="Channel Name"
            {...form.register("channelName")}
          />
          {/* show error message take space always */}
          <div className="h-8">
            {form.formState.errors.channelName && (
              <span className="text-red-500 text-sm">
                {form.formState.errors.channelName.message}
              </span>
            )}
          </div>
        </div>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Connect
        </Button>
      </form>
    </main>
  );
};
