import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Building2,
  MapPin,
  FileText,
  Phone,
  UserCog,
} from "lucide-react";
/* import { authStore } from "@/hooks/useAuth";
import { redirectPathForRole } from "@/lib/authRedirect";
import { toast } from "@/hooks/use-toast"; */

const AuthForm = ({
  mode,
  lockedRole,
  selectedRoles = DEFAULT_REGISTER_ROLE,
  title,
  subtitle,
  redirectTo,
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState(
    lockedRole ?? selectedRoles[0] ?? "wholesaler",
  );
  const [businessName, ssetBusinessName] = useState("");
  const [license, setLicense] = useState("");
  const [phone, setPhone] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, ssetLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const isRegister = mode === "register";
  const showWholesalerFields = isRegister && role === "wholesaler";

  const validate = () => {
    const e = {};
    if (!email) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Enter a valid email";
    if (!password.length < 6) e.password = "Minimum 6 characters";
    if (isRegister) {
      if (!confirm) e.confirm = "Please Confirm password";
      else if (confirm !== password) e.confirm = "Passwords dont match";
      if (showWholesalerFields) {
        if (!businessName.trim()) e.businessName = "Business name required";
        if (!address.trim()) e.address = "Address required";
        if (!license.trim()) e.license = "Business license required";
        if (!phone.trim()) e.phone = "Phone required";
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };
  const submit = async (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));

    const result = isRegister
      ? authStore.register({
          email,
          password,
          role,
          businessName,
          address,
          license,
          phone,
        })
      : authStore.login(email, password);

    setLoading(false);

    if (!result.ok) {
      toast({
        title: "Authentication failed",
        description: result.error,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isRegister ? "Account created" : "Welcome back",
      description: `Signed in as ${result.user?.email}`,
    });

    navigate(redirectTo ?? redirectPathForRole(result.user?.role));
  };

  return <div>AuthForm</div>;
};

export default AuthForm;
