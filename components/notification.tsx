import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/contexts/NotificationContext";

const NotificationDialog = () => {
  const { message, open, hideNotification } = useNotification();

  return (
    <Dialog open={open} onOpenChange={hideNotification}>
      <DialogContent className="py-8 w-80 rounded-lg bg-[#14141c] border-none">
        <DialogHeader>
          <DialogTitle className="text-white">Notification</DialogTitle>
          <DialogDescription className="pt-2 text-gray-400">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button
            className="bg-red-600 hover:bg-red-800"
            onClick={hideNotification}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
