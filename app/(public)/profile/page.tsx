"use client";

import { useEffect, useState } from "react";
import {
  User,
  Mail,
  CalendarDays,
  Lock,
  Phone,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/user/profile", {
          credentials: "include",
          cache: "no-store",
        });

        if (response.status === 401) {
          window.location.href = "/login?redirect=/profile";
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile.",
          );
        }

        setProfile(data.user);
        setName(data.user.name);
        setPhone(data.user.phone || "");
        setAvatar(data.user.avatar || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile.",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleProfileUpdate(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setError("");
    setSavingProfile(true);

    try {
      const response = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          avatar: avatar.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile.",
        );
      }

      setProfile(data.user);
      setName(data.user.name);
      setPhone(data.user.phone || "");
      setAvatar(data.user.avatar || "");

      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile.",
      );
    } finally {
      setSavingProfile(false);
    }
  }

  async function handlePasswordChange(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (newPassword.length < 8) {
      setError(
        "New password must contain at least 8 characters.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setChangingPassword(true);

    try {
      const response = await fetch("/api/user/password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to change password.",
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Password changed successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to change password.",
      );
    } finally {
      setChangingPassword(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-[#f8faf9] px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="animate-pulse">
            <div className="h-8 w-40 rounded bg-gray-200" />
            <div className="mt-3 h-4 w-72 rounded bg-gray-200" />

            <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
              <div className="h-64 rounded-2xl bg-gray-200" />
              <div className="h-96 rounded-2xl bg-gray-200" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!profile) {
    return null;
  }

  const initials = profile.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const createdDate = new Date(
    profile.createdAt,
  ).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-[70vh] bg-[#f8faf9] px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div>
          <p className="text-sm font-semibold text-[#15945c]">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Manage your personal information and account
            security.
          </p>
        </div>

        {/* Alerts */}
        {(message || error) && (
          <div
            className={`mt-6 flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error ? (
              <AlertCircle size={18} />
            ) : (
              <CheckCircle2 size={18} />
            )}

            <span>{error || message}</span>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Profile Summary */}
          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center text-center">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-24 w-24 rounded-full border-4 border-green-50 object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#15945c] text-2xl font-bold text-white">
                  {initials}
                </div>
              )}

              <h2 className="mt-4 text-lg font-bold text-gray-900">
                {profile.name}
              </h2>

              <p className="mt-1 break-all text-sm text-gray-500">
                {profile.email}
              </p>

              {profile.phone && (
                <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500">
                  <Phone size={14} />
                  {profile.phone}
                </p>
              )}
            </div>

            <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
              <div className="flex items-start gap-3">
                <CalendarDays
                  size={18}
                  className="mt-0.5 text-gray-400"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    Member since
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-gray-700">
                    {createdDate}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck
                  size={18}
                  className="mt-0.5 text-[#15945c]"
                />

                <div>
                  <p className="text-xs text-gray-400">
                    Account status
                  </p>

                  <p className="mt-0.5 text-sm font-medium text-[#15945c]">
                    Active
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Personal Information */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Personal Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Update the information shown on your
                  College Aadhar account.
                </p>
              </div>

              <form
                onSubmit={handleProfileUpdate}
                className="mt-6 space-y-5"
              >
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Full name
                  </label>

                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="name"
                      value={name}
                      onChange={(event) =>
                        setName(event.target.value)
                      }
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
                      placeholder="Your full name"
                      required
                      minLength={2}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      autoComplete="tel"
                      inputMode="tel"
                      placeholder="Your phone number"
                      className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>

                  <div className="relative">
                    <Mail
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="email"
                      value={profile.email}
                      disabled
                      className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-10 pr-4 text-sm text-gray-500"
                    />
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    Your email address cannot currently be
                    changed.
                  </p>
                </div>

                {/* Avatar */}
                <div>
                  <label
                    htmlFor="avatar"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Profile image URL
                  </label>

                  <input
                    id="avatar"
                    value={avatar}
                    onChange={(event) =>
                      setAvatar(event.target.value)
                    }
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                {/* Save */}
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#15945c] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#117c4d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingProfile ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* Change Password */}
            <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-7">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-[#15945c]">
                  <Lock size={19} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    Change Password
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Keep your account secure with a strong
                    password.
                  </p>
                </div>
              </div>

              <form
                onSubmit={handlePasswordChange}
                className="mt-6 space-y-5"
              >
                {/* Current Password */}
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Current password
                  </label>

                  <input
                    id="currentPassword"
                    type="password"
                    value={currentPassword}
                    onChange={(event) =>
                      setCurrentPassword(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
                    autoComplete="current-password"
                    required
                  />
                </div>

                {/* New Password */}
                <div>
                  <label
                    htmlFor="newPassword"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    New password
                  </label>

                  <input
                    id="newPassword"
                    type="password"
                    value={newPassword}
                    onChange={(event) =>
                      setNewPassword(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Confirm new password
                  </label>

                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#15945c] focus:ring-2 focus:ring-[#15945c]/10"
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>

                {/* Change Password */}
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-[#15945c] hover:text-[#15945c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {changingPassword ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock size={17} />
                      Change Password
                    </>
                  )}
                </button>
              </form>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}