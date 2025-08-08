"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  NotificationPriority,
  NotificationType,
  UserNotificationKind,
} from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { notifyUser } from "@/lib/notifications/actions";
import { toast } from "sonner";
import { useState } from "react";

export default function SendNotificationForm() {
  const [userId, setUserId] = useState("");
  const [priority, setPriority] = useState<NotificationPriority>("INFO");
  const [kind, setKind] = useState<UserNotificationKind>("PROFILE_INCOMPLETE");
  const [contextId, setContextId] = useState("");
  const [meta, setMeta] = useState("{}");
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    try {
      setLoading(true);
      let parsedMeta: Record<string, any> = {};
      try {
        parsedMeta = meta ? JSON.parse(meta) : {};
      } catch {
        toast.error("Meta JSON invalide");
        return;
      }

      const res = await notifyUser({
        userId,
        type: NotificationType.USER,
        priority,
        params: {
          kind,
          contextId: contextId || undefined,
          meta: parsedMeta,
        },
      });
      if (res?.serverError) {
        toast.error(res.serverError);
      } else {
        toast.success("Notification envoyée");
      }
    } catch (e: any) {
      toast.error(e?.message || "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Envoyer une notification USER</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>userId</Label>
          <Input
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            placeholder="cuid() de l'utilisateur"
          />
        </div>
        <div className="space-y-2">
          <Label>priority</Label>
          <Select
            value={priority}
            onValueChange={(v) => setPriority(v as NotificationPriority)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INFO">INFO</SelectItem>
              <SelectItem value="SUCCESS">SUCCESS</SelectItem>
              <SelectItem value="WARNING">WARNING</SelectItem>
              <SelectItem value="ERROR">ERROR</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>params.kind</Label>
          <Select
            value={kind}
            onValueChange={(v) => setKind(v as UserNotificationKind)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez un sous-type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PROFILE_INCOMPLETE">
                PROFILE_INCOMPLETE
              </SelectItem>
              <SelectItem value="ACTION_REQUIRED">ACTION_REQUIRED</SelectItem>
              <SelectItem value="REMINDER">REMINDER</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>params.contextId</Label>
          <Input
            value={contextId}
            onChange={(e) => setContextId(e.target.value)}
            placeholder="resource-id"
          />
        </div>
        <div className="space-y-2">
          <Label>params.meta (JSON)</Label>
          <Textarea
            value={meta}
            onChange={(e) => setMeta(e.target.value)}
            rows={5}
          />
        </div>
        <div>
          <Button onClick={onSubmit} disabled={loading || !userId}>
            {loading ? "Envoi..." : "Envoyer"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
