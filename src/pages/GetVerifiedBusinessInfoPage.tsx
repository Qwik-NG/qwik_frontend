import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteFooter, SiteHeader } from "../components/AppShell";
import SettingsSidebar, { MobileSettingsMenu } from "../components/settings/SettingsSidebar";
import FormInput from "../components/ui/FormInput";
import FormSelect from "../components/ui/FormSelect";
import { ROUTES } from "../constants/routes";
import { ALL_NIGERIA_LOCATION, NIGERIAN_AREAS, NIGERIAN_LOCATIONS } from "../lib/searchContext";
import { getSettingsNavItems } from "../lib/settings-nav-config";
import { api } from "../services/api";

type BusinessInfo = {
  businessName: string;
  storeName: string;
  businessType: string;
  businessCategory: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  nin: string;
  dateOfBirth: string;
};

const emptyBusinessInfo: BusinessInfo = {
  businessName: "",
  storeName: "",
  businessType: "",
  businessCategory: "",
  email: "",
  phone: "",
  address: "",
  state: "",
  city: "",
  nin: "",
  dateOfBirth: "",
};

function StoreIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9h18" />
      <path d="M5 9l1.5-5h11L19 9" />
      <path d="M5 9v9h14V9" />
    </svg>
  );
}

function ContactIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="3" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#ff7f1f]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
      <path d="m9.6 12.1 1.7 1.8 3.7-4" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#1f1d27]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M8 2v4M16 2v4M3 10h18" />
      <path d="M8 14h2M12 14h2M16 14h2" />
    </svg>
  );
}

function StepDot({ active, label }: { active?: boolean; label: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <span className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border ${active ? "border-[#ff8b2c] bg-[#ff8b2c] text-white" : "border-[#d7d5de] bg-white text-[#1f1d27]"}`}>
        {label}
      </span>
      <p className="text-[14px] font-medium text-[#1f1d27]">{label === "1" ? "Business info" : label === "2" ? "Documents" : label === "3" ? "Review" : "Payment"}</p>
      <p className={`text-[12px] ${active ? "text-[#ff8b2c]" : "text-[#8f8b98]"}`}>{active ? "In Progress" : "Pending"}</p>
    </div>
  );
}

export default function GetVerifiedBusinessInfoPage() {
  const navigate = useNavigate();
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [form, setForm] = useState<BusinessInfo>(emptyBusinessInfo);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function loadVerification() {
      try {
        setLoading(true);
        setError(null);
        const current = await api.verificationMe();
        const verification = current.data ?? (await api.createVerification()).data;
        if (!mounted) return;
        setVerificationId(verification.id);
        setForm({ ...emptyBusinessInfo, ...(verification.businessInfo ?? {}) });
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load verification");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadVerification();
    return () => {
      mounted = false;
    };
  }, []);

  const updateField = (field: keyof BusinessInfo, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const stateOptions = NIGERIAN_LOCATIONS.filter((location) => location !== ALL_NIGERIA_LOCATION);
  const cityOptions = form.state ? NIGERIAN_AREAS[form.state] ?? [] : [];

  const handleContinue = async () => {
    try {
      setSaving(true);
      setError(null);
      const id = verificationId ?? (await api.createVerification()).data.id;
      setVerificationId(id);
      await api.updateVerificationBusinessInfo(id, form);
      navigate(ROUTES.GET_VERIFIED_DOCUMENT_UPLOAD);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save business information");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-page text-ink">
      <SiteHeader navigate={navigate} />

      <main className="mx-auto w-full max-w-[1728px] px-4 pb-16 pt-8 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[310px_1fr]">
          <SettingsSidebar
            className="hidden md:block"
            items={getSettingsNavItems(navigate, "get-verified")}
          />

          <section className="min-w-0">
            <div className="mb-4">
              <MobileSettingsMenu items={getSettingsNavItems(navigate, "get-verified")} label="Settings" />
            </div>

            <div className="max-w-[720px]">
              <h1 className="text-[30px] font-semibold text-[#1f1d27]">Seller Verification</h1>
              <p className="mt-1 text-[14px] text-[#8f8b98]">
                Complete verification to earn a verified seller badge and unlock marketplace benefits
              </p>
            </div>

            <div className="relative mt-6">
              <div className="absolute left-0 right-0 top-[15px] hidden h-[2px] bg-[#d7d5de] md:block" />
              <div className="absolute left-0 top-[15px] hidden h-[2px] w-[12.5%] bg-[#ff8b2c] md:block" />
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                <StepDot active label="1" />
                <StepDot label="2" />
                <StepDot label="3" />
                <StepDot label="4" />
              </div>
            </div>

            <div className="mt-6 w-full max-w-[980px] rounded-card border border-[#e2e1e8] bg-white p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
              <div className="flex items-center gap-3">
                <StoreIcon />
                <h2 className="text-[16px] font-semibold text-[#1f1d27]">Business Information</h2>
              </div>
              {loading ? <p className="mt-3 text-[13px] text-[#8f8b98]">Loading saved verification details...</p> : null}
              {error ? <p className="mt-3 rounded-[10px] bg-[#fff0f0] px-3 py-2 text-[13px] text-[#c24141]">{error}</p> : null}

              <div className="mt-4 grid grid-cols-1 gap-x-8 md:grid-cols-2">
                <FormInput
                  label="Business Name"
                  type="text"
                  placeholder="Enter your business name"
                  value={form.businessName}
                  onChange={(event) => updateField("businessName", event.target.value)}
                  labelClassName="text-[14px] font-medium text-[#1f1d27]"
                  inputClassName="bg-white border-[#c9c7d2]"
                />
                <FormInput
                  label="Store Name"
                  type="text"
                  placeholder="Enter your store name"
                  value={form.storeName}
                  onChange={(event) => updateField("storeName", event.target.value)}
                  labelClassName="text-[14px] font-medium text-[#1f1d27]"
                  inputClassName="bg-white border-[#c9c7d2]"
                />
                <FormSelect
                  label="Business Type"
                  value={form.businessType}
                  onChange={(event) => updateField("businessType", event.target.value)}
                  labelClassName="text-[14px] font-medium text-[#1f1d27]"
                  selectClassName="bg-white border-[#c9c7d2]"
                >
                  <option value="">Select business type</option>
                  <option value="retail">Retail</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="service">Service</option>
                </FormSelect>
                <FormSelect
                  label="Business Category"
                  value={form.businessCategory}
                  onChange={(event) => updateField("businessCategory", event.target.value)}
                  labelClassName="text-[14px] font-medium text-[#1f1d27]"
                  selectClassName="bg-white border-[#c9c7d2]"
                >
                  <option value="">Select business category</option>
                  <option value="electronics">Electronics</option>
                  <option value="fashion">Fashion</option>
                  <option value="home">Home & Living</option>
                </FormSelect>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <ContactIcon />
                <h3 className="text-[16px] font-semibold text-[#1f1d27]">Contact Information</h3>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-x-8 md:grid-cols-2">
                <FormInput
                  label="Email Address"
                  type="email"
                  placeholder="Enter email address"
                  value={form.email}
                  onChange={(event) => updateField("email", event.target.value)}
                  labelClassName="text-[14px] font-medium text-[#1f1d27]"
                  inputClassName="bg-white border-[#c9c7d2]"
                />
                <FormInput
                  label="Phone Number"
                  type="tel"
                  placeholder="Enter phone number"
                  value={form.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  labelClassName="text-[14px] font-medium text-[#1f1d27]"
                  inputClassName="bg-white border-[#c9c7d2]"
                />
                <FormInput
                  label="Business Address"
                  type="text"
                  placeholder="Enter your business address"
                  value={form.address}
                  onChange={(event) => updateField("address", event.target.value)}
                  labelClassName="text-[14px] font-medium text-[#1f1d27]"
                  inputClassName="bg-white border-[#c9c7d2]"
                  containerClassName="md:col-span-2"
                />
                <FormSelect
                  label="State"
                  value={form.state}
                  onChange={(event) => {
                    const nextState = event.target.value;
                    setForm((current) => ({
                      ...current,
                      state: nextState,
                      city: "",
                    }));
                  }}
                  labelClassName="text-[14px] font-medium text-[#1f1d27]"
                  selectClassName="bg-white border-[#c9c7d2]"
                >
                  <option value="">Select State</option>
                  {stateOptions.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </FormSelect>
                {form.state ? (
                  <FormSelect
                    label="City / Area"
                    value={form.city}
                    onChange={(event) => updateField("city", event.target.value)}
                    labelClassName="text-[14px] font-medium text-[#1f1d27]"
                    selectClassName="bg-white border-[#c9c7d2]"
                  >
                    <option value="">Select city</option>
                    {cityOptions.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </FormSelect>
                ) : (
                  <FormSelect
                    label="City / Area"
                    value=""
                    onChange={() => {}}
                    labelClassName="text-[14px] font-medium text-[#1f1d27]"
                    selectClassName="bg-white border-[#c9c7d2]"
                    disabled
                  >
                    <option value="">Select state first</option>
                  </FormSelect>
                )}
              </div>

              <div className="mt-4 flex items-center gap-3">
                <ShieldIcon />
                <h3 className="text-[16px] font-semibold text-[#1f1d27]">Identity Verification</h3>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-x-8 md:grid-cols-2">
                <FormInput
                  label="NIN Number"
                  type="text"
                  placeholder="Enter your NIN number"
                  value={form.nin}
                  onChange={(event) => updateField("nin", event.target.value)}
                  labelClassName="text-[14px] font-medium text-[#1f1d27]"
                  inputClassName="bg-white border-[#c9c7d2]"
                />
                <div className="mb-[14px]">
                  <label className="mb-2 block text-[14px] font-medium text-[#1f1d27]">Date of Birth</label>
                  <div className="relative">
                    <input
                      type="date"
                      placeholder="Select date of birth"
                      value={form.dateOfBirth}
                      onChange={(event) => updateField("dateOfBirth", event.target.value)}
                      className="h-[48px] w-full rounded-btn border border-[#c9c7d2] bg-white px-3 pr-10 text-[14px] text-[#20212a] placeholder:text-[#a3a2ad] focus:outline-none"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CalendarIcon />
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  className="flex h-[48px] items-center gap-3 rounded-[12px] bg-gradient-to-r from-amber to-orange px-5 text-[14px] font-medium text-white shadow-glow"
                  type="button"
                  onClick={handleContinue}
                  disabled={loading || saving}
                >
                  <span>{saving ? "Saving..." : "Continue to upload Document"}</span>
                  <span className="text-[18px]">-&gt;</span>
                </button>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[13px] text-[#1f1d27]">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3 5 6v6c0 5 3.4 8.8 7 10 3.6-1.2 7-5 7-10V6l-7-3Z" />
                <path d="m9.6 12.1 1.7 1.8 3.7-4" />
              </svg>
              <span>Verification usually takes 24-48 hours</span>
            </div>
          </section>
        </div>
      </main>

      <SiteFooter navigate={navigate} />
    </div>
  );
}
