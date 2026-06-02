import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { setToken } from "../services/auth";
import FormInput from "../components/ui/FormInput";
import FormButton from "../components/ui/FormButton";

export default function SignUpPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPhoneValid = useMemo(() => /^\+?\d{10,15}$/.test(phone.replace(/\s/g, "")), [phone]);
  const canCreate = fullName.trim().length >= 2 && /\S+@\S+\.\S+/.test(email) && isPhoneValid && password.length >= 6;

  return (
    <div className="min-h-screen overflow-hidden bg-[#f3f3f5] font-outfit text-[#1f1f29]">
      <header className="flex items-center justify-between px-[68px] pt-[46px]">
        <button onClick={() => navigate("/")} className="text-[50px] font-normal leading-none text-[#ff8300]">
          qwik
        </button>
        <p className="text-[15px] text-[#9a99a6]">
          New here?{" "}
          <button className="text-[#ff8f00]" onClick={() => navigate("/signup")}>
            Create an account
          </button>
        </p>
      </header>

      <main className="mx-auto flex h-[calc(100vh-124px)] w-full max-w-[1728px] items-center justify-center px-4 pb-8">
        <section className="mx-auto w-[540px] rounded-[24px] bg-white px-[26px] pb-[26px] pt-[18px]">
          <h2 className="mb-[14px] text-center text-[24px] font-normal leading-[1.1] text-[#22222b] whitespace-nowrap">
            Create a fresh account
          </h2>

          <FormInput
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <FormInput
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <FormInput
            type="tel"
            placeholder="Phone no."
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <FormInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            containerClassName="mb-[16px]"
          />

          <FormButton
            disabled={!canCreate || isSubmitting}
            onClick={async () => {
              try {
                setIsSubmitting(true);
                const res = await api.register({ email: email.trim().toLowerCase(), password, fullName: fullName.trim(), phone: phone.trim() });
                setToken(res.data.token);
                navigate("/welcome");
              } catch (error) {
                window.alert(error instanceof Error ? error.message : "Sign up failed");
              } finally {
                setIsSubmitting(false);
              }
            }}
            isLoading={isSubmitting}
            loadingText="Creating..."
          >
            Create Account
          </FormButton>
        </section>
      </main>
    </div>
  );
}
