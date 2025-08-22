"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppLayout from "@/app/components/AppLayout";
import FormInput from "@/app/components/FormInput";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    workplaceName: "",
    supervisorName: "",
    targetHours: "",
    targetSupervisionHours: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validate target hours
    const targetHoursNum = parseInt(formData.targetHours);
    const targetSupervisionHoursNum = parseInt(formData.targetSupervisionHours);

    if (isNaN(targetHoursNum) || targetHoursNum <= 0) {
      setError("Target hours must be a positive number");
      setIsLoading(false);
      return;
    }

    if (isNaN(targetSupervisionHoursNum) || targetSupervisionHoursNum <= 0) {
      setError("Target supervision hours must be a positive number");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          targetHours: targetHoursNum,
          targetSupervisionHours: targetSupervisionHoursNum,
        }),
      });

      if (response.ok) {
        const { user } = await response.json();
        router.push("/dashboard");
      } else {
        const { error } = await response.json();
        setError(error || "Registration failed");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="auth-container">
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-header">
            <h2>Create Your Account</h2>
            <p>Set up your internship hour tracking</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <FormInput
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />

          <FormInput
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            placeholder="Choose a username"
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password"
          />

          <FormInput
            label="Workplace Name"
            name="workplaceName"
            value={formData.workplaceName}
            onChange={handleChange}
            required
            placeholder="Enter your workplace name"
          />

          <FormInput
            label="Supervisor Name"
            name="supervisorName"
            value={formData.supervisorName}
            onChange={handleChange}
            required
            placeholder="Enter your supervisor's name"
          />

          <FormInput
            label="Target Direct Hours"
            name="targetHours"
            type="number"
            value={formData.targetHours}
            onChange={handleChange}
            required
            placeholder="Total direct hours needed"
          />

          <FormInput
            label="Target Supervision Hours"
            name="targetSupervisionHours"
            type="number"
            value={formData.targetSupervisionHours}
            onChange={handleChange}
            required
            placeholder="Total supervision hours needed"
          />

          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="auth-footer">
            <p>
              Already have an account?{" "}
              <Link href="/login" className="auth-link">
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
