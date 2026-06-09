import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import Toggle from "../components/ui/Toggle";
import { Tab } from "../components/ui/Tab";
import { getSettingsNavItems } from "../lib/settings-nav-config";
import { api } from "../services/api";
import type { NotificationSettings } from "../types";

const DEFAULT_SETTINGS: NotificationSettings = {
  emailNotifications: true,
  pushNotifications: false,
  messageNotifications: true,
  offerNotifications: true,
  systemNotifications: true,
};

export default function EmailNotificationSettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await api.getNotificationSettings();
        setSettings(response.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load notification settings");
      } finally {
        setLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const updateSetting = (key: keyof NotificationSettings, checked: boolean) => {
    setSettings((current) => ({ ...current, [key]: checked }));
    setMessage(null);
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError(null);
      const response = await api.updateNotificationSettings({
        emailNotifications: settings.emailNotifications,
        messageNotifications: settings.messageNotifications,
        offerNotifications: settings.offerNotifications,
        systemNotifications: settings.systemNotifications,
      });
      setSettings(response.data);
      setMessage("Email notification settings saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save notification settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-20 pt-8 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "notification")}
          />

          <section className="min-w-0 max-w-[760px] max-w-full">
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "notification")} label="Settings" />
            </div>
            <div className="mb-8 flex flex-wrap gap-6 sm:gap-10">
              <Tab label="Push" onClick={() => navigate("/notification-settings")} />
              <Tab label="Email" active onClick={() => navigate("/notification-settings-email")} />
            </div>

            {loading ? (
              <div className="space-y-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div key={index} className="h-[32px] animate-pulse rounded-[10px] bg-white" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="min-w-0 text-[15px] text-[#9794a1] sm:text-[16px]">Deals on products</p>
                  <Toggle size="sm" checked={settings.emailNotifications} onCheckedChange={(checked) => updateSetting("emailNotifications", checked)} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="min-w-0 text-[15px] text-[#9794a1] sm:text-[16px]">Message from users</p>
                  <Toggle size="sm" checked={settings.messageNotifications} onCheckedChange={(checked) => updateSetting("messageNotifications", checked)} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="min-w-0 text-[15px] text-[#9794a1] sm:text-[16px]">Info about your ads</p>
                  <Toggle size="sm" checked={settings.offerNotifications} onCheckedChange={(checked) => updateSetting("offerNotifications", checked)} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="min-w-0 text-[15px] text-[#9794a1] sm:text-[16px]">Your subscriptions</p>
                  <Toggle size="sm" checked={settings.systemNotifications} onCheckedChange={(checked) => updateSetting("systemNotifications", checked)} />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <p className="min-w-0 text-[15px] text-[#9794a1] sm:text-[16px]">Feedback</p>
                  <Toggle size="sm" checked={settings.systemNotifications} onCheckedChange={(checked) => updateSetting("systemNotifications", checked)} />
                </div>
              </div>
            )}

            {error ? <p className="mt-5 text-[14px] text-[#d14343]">{error}</p> : null}
            {message ? <p className="mt-5 text-[14px] text-[#248a4b]">{message}</p> : null}

            <button
              className="mt-8 h-[48px] w-full max-w-[420px] rounded-[14px] bg-gradient-to-r from-amber to-orange text-[16px] text-white shadow-glow disabled:cursor-not-allowed disabled:opacity-50 sm:h-[52px] sm:text-[18px]"
              type="button"
              onClick={() => void saveSettings()}
              disabled={loading || saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
