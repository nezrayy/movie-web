import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/contexts/NotificationContext";

const NotificationDialog = () => {
  const { message, open, hideNotification } = useNotification();

  return (
    <Dialog open={open} onOpenChange={hideNotification}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Notification</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
        </DialogHeader>
        <Button onClick={hideNotification}>Close</Button>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;
