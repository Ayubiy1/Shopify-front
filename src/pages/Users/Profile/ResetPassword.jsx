import axios from "axios";
import { useState } from "react";
import api from "../../../auth";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    await api.post("/api/reset-password/send-otp", {
      email,
    });
    setStep(2);
  };

  const verifyOtp = async () => {
    const res = await api.post("/api/reset-password/verify-otp", {
      email,
      otp,
    });

    if (res.data.verified) alert("Tasdiqlandi ✅");
  };

  return (
    <div>
      {step === 1 && (
        <>
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
          <button onClick={verifyOtp}>Verify</button>
        </>
      )}
    </div>
  );
};

export default ResetPassword;
