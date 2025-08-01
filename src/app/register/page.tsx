"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  UserPlus,
  Check,
  X,
  User,
} from "lucide-react";
import toast from "react-hot-toast";
import { isValidName } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (pwd) => pwd.length >= 8 },
  { label: "One uppercase letter", test: (pwd) => /[A-Z]/.test(pwd) },
  { label: "One lowercase letter", test: (pwd) => /[a-z]/.test(pwd) },
  { label: "One number", test: (pwd) => /[0-9]/.test(pwd) },
  {
    label: "One special character",
    test: (pwd) => /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
  },
];

const validateNameFormat = (name: string): boolean => {
  return isValidName(name);
};

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");

  const validatePassword = (pwd: string) => {
    const newErrors: { [key: string]: string } = {};
    const failedRequirements = passwordRequirements.filter(
      (req) => !req.test(pwd)
    );

    if (failedRequirements.length > 0) {
      newErrors.password = `Password must meet all requirements`;
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const passwordErrors = validatePassword(password);
    const newErrors = { ...passwordErrors };

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!name) {
      newErrors.name = "Name is required.";
    } else if (!validateNameFormat(name)) {
      newErrors.name = "Name should contain only letters, spaces, and hyphens.";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || "Registration failed. Please try again.");
        setIsLoading(false);
        return;
      }

      toast.success("Account created successfully!");
      window.location.href = "/";
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("An error occurred during registration. Please try again.");
      setIsLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const metRequirements = passwordRequirements.filter((req) =>
      req.test(password)
    ).length;
    if (metRequirements === 0) return { strength: 0, label: "", color: "" };
    if (metRequirements <= 2)
      return { strength: 25, label: "Weak", color: "bg-red-500" };
    if (metRequirements <= 3)
      return { strength: 50, label: "Fair", color: "bg-yellow-500" };
    if (metRequirements <= 4)
      return { strength: 75, label: "Good", color: "bg-blue-500" };
    return { strength: 100, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 flex flex-col min-h-screen"
      >
        <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <motion.div
            className="max-w-md w-full"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Card variant="glass" className="shadow-2xl">
              <CardContent className="p-8">
                {/* Header */}
                <motion.div
                  className="text-center mb-8"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        ease: "easeOut",
                      },
                    },
                  }}
                >
                  <motion.div
                    className="flex justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <UserPlus className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                  <h2 className="text-3xl font-bold text-slate-800 mb-2">
                    Create Account
                  </h2>
                  <p className="text-slate-600">
                    Join us and start transforming your text with AI
                  </p>
                </motion.div>

                {/* Form */}
                <motion.form
                  onSubmit={handleSubmit}
                  className="space-y-6"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        ease: "easeOut",
                      },
                    },
                  }}
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeOut",
                        },
                      },
                    }}
                  >
                    <Input
                      label="Full Name"
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.name;

                          if (
                            e.target.value &&
                            !validateNameFormat(e.target.value)
                          ) {
                            newErrors.name =
                              "Name should contain only letters, spaces, and hyphens.";
                          }

                          return newErrors;
                        });
                      }}
                      error={errors.name}
                      leftIcon={<User className="w-4 h-4 text-cyan-600" />}
                    />
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeOut",
                        },
                      },
                    }}
                  >
                    <Input
                      label="Email address"
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.email;
                          return newErrors;
                        });
                      }}
                      error={errors.email}
                      leftIcon={<Mail className="w-4 h-4 text-cyan-600" />}
                    />
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeOut",
                        },
                      },
                    }}
                  >
                    <Input
                      label="Password"
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.password;
                          return newErrors;
                        });
                      }}
                      error={errors.password}
                      leftIcon={<Lock className="w-4 h-4 text-cyan-600" />}
                      rightIcon={
                        <motion.button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </motion.button>
                      }
                    />

                    {/* Password Strength Indicator */}
                    <AnimatePresence>
                      {password && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-slate-600">
                              Password strength
                            </span>
                            <span
                              className={`text-sm font-medium ${passwordStrength.color.replace(
                                "bg-",
                                "text-"
                              )}`}
                            >
                              {passwordStrength.label}
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mb-3">
                            <motion.div
                              className={`h-2 rounded-full ${passwordStrength.color}`}
                              initial={{ width: 0 }}
                              animate={{
                                width: `${passwordStrength.strength}%`,
                              }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>

                          {/* Password Requirements */}
                          <div className="space-y-2">
                            {passwordRequirements.map((requirement, index) => {
                              const isMet = requirement.test(password);
                              return (
                                <motion.div
                                  key={index}
                                  className="flex items-center space-x-2"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: index * 0.05,
                                  }}
                                >
                                  <motion.div
                                    className={`w-4 h-4 rounded-full flex items-center justify-center ${
                                      isMet ? "bg-green-500" : "bg-slate-300"
                                    }`}
                                    animate={{ scale: isMet ? [1, 1.2, 1] : 1 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {isMet ? (
                                      <Check className="w-2.5 h-2.5 text-white" />
                                    ) : (
                                      <X className="w-2.5 h-2.5 text-slate-500" />
                                    )}
                                  </motion.div>
                                  <span
                                    className={`text-sm ${
                                      isMet
                                        ? "text-green-600"
                                        : "text-slate-500"
                                    } transition-colors duration-200`}
                                  >
                                    {requirement.label}
                                  </span>
                                </motion.div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeOut",
                        },
                      },
                    }}
                  >
                    <Input
                      label="Confirm Password"
                      id="confirm-password"
                      name="confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.confirmPassword;
                          return newErrors;
                        });
                      }}
                      error={errors.confirmPassword}
                      leftIcon={<Lock className="w-4 h-4 text-cyan-600" />}
                      rightIcon={
                        <motion.button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </motion.button>
                      }
                    />

                    {/* Password Match Indicator */}
                    <AnimatePresence>
                      {confirmPassword && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-2 flex items-center space-x-2"
                        >
                          <div
                            className={`w-4 h-4 rounded-full flex items-center justify-center ${
                              password === confirmPassword
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          >
                            {password === confirmPassword ? (
                              <Check className="w-2.5 h-2.5 text-white" />
                            ) : (
                              <X className="w-2.5 h-2.5 text-white" />
                            )}
                          </div>
                          <span
                            className={`text-sm ${
                              password === confirmPassword
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {password === confirmPassword
                              ? "Passwords match"
                              : "Passwords don't match"}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                          duration: 0.5,
                          ease: "easeOut",
                        },
                      },
                    }}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        variant="primary"
                        className="w-full py-3 text-base"
                        isLoading={isLoading}
                        disabled={isLoading}
                      >
                        {isLoading ? "Creating account..." : "Create Account"}
                      </Button>
                    </motion.div>
                  </motion.div>
                </motion.form>

                {/* Footer */}
                <motion.div
                  className="mt-8 text-center"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        ease: "easeOut",
                      },
                    },
                  }}
                >
                  <p className="text-sm text-slate-600">
                    Already have an account?{" "}
                    <Link
                      href="/login"
                      className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors duration-200"
                    >
                      Sign in here
                    </Link>
                  </p>
                </motion.div>

                {/* Terms */}
                <motion.div
                  className="mt-4 text-center"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: {
                        duration: 0.5,
                        ease: "easeOut",
                      },
                    },
                  }}
                >
                  <p className="text-xs text-slate-500">
                    By creating an account, you agree to our{" "}
                    <Link
                      href="/terms"
                      className="text-cyan-600 hover:text-cyan-500"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-cyan-600 hover:text-cyan-500"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </motion.div>
    </div>
  );
}
