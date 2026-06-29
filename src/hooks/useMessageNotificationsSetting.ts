import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

export function useMessageNotificationsSetting() {
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [savedMessageNotifications, setSavedMessageNotifications] = useState(true);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getNotificationSettings();
        const value = Boolean(response.data.messageNotifications);
        setMessageNotifications(value);
        setSavedMessageNotifications(value);
      } catch {
        setError("Unable to load chat settings. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const hasChanges = useMemo(
    () => messageNotifications !== savedMessageNotifications,
    [messageNotifications, savedMessageNotifications],
  );

  const updateValue = (nextValue: boolean) => {
    if (loading || saving) return;
    setMessageNotifications(nextValue);
    setMessage(null);
    setError(null);
  };

  const save = async () => {
    if (loading || saving || !hasChanges) return;

    const previousSavedValue = savedMessageNotifications;

    try {
      setSaving(true);
      setError(null);
      setMessage(null);

      const response = await api.updateNotificationSettings({
        messageNotifications,
      });
      const persistedValue = Boolean(response.data.messageNotifications);
      setMessageNotifications(persistedValue);
      setSavedMessageNotifications(persistedValue);
      setMessage("Chat settings saved");
    } catch {
      setMessageNotifications(previousSavedValue);
      setError("Unable to save chat settings. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return {
    messageNotifications,
    loading,
    saving,
    error,
    message,
    hasChanges,
    setMessageNotifications: updateValue,
    save,
  };
}
