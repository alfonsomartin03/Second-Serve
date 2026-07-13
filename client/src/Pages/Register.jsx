import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Leaf,
  Building2,
  Users,
  ShieldCheck,
  UserPlus,
  Mail,
  Lock,
  Phone,
  MapPin,
  Map,
  Tag,
  HeartHandshake,
  Eye,
  EyeOff,
} from "lucide-react";
import "../styles/Register.css";

export default function Register() {
  const [accountType, setAccountType] = useState("donor");
  const [emailError, setEmailError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    organizationName: "",
    contactName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateEmail = () => {
    if (!formData.email) {
      setEmailError("Email address is required.");
      return false;
    }

    if (!isValidEmail(formData.email)) {
      setEmailError(
        "Please enter a valid email address containing an @ symbol."
      );
      return false;
    }

    setEmailError("");
    return true;
  };

  const handleChange = (e) => {
    const { name } = e.target;
    let { value } = e.target;

    // Phone number: digits only, maximum of 10 digits
    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }

    // ZIP code: digits only, maximum of 5 digits
    if (name === "zipCode") {
      value = value.replace(/\D/g, "").slice(0, 5);
    }

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));

    // Remove the email error while correcting the email
    if (name === "email" && isValidEmail(value)) {
      setEmailError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (formData.phone.length !== 10) {
      alert("Phone number must contain exactly 10 digits.");
      return;
    }

    if (formData.zipCode.length !== 5) {
      alert("ZIP code must contain exactly 5 digits.");
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5001/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            accountType,
            organizationName: formData.organizationName,
            contactName: formData.contactName,
            email: formData.email,
            password: formData.password,
            phone: formData.phone,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zipCode: formData.zipCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed.");
      }

      alert("Account created successfully!");

      setFormData({
        organizationName: "",
        contactName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      });

      setEmailError("");
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error) {
      alert(error.message);
      console.error(error);
    }
  };

  return (
    <main className="register-page">
      <nav className="register-nav">
        <Link to="/" className="register-logo">
          <Leaf size={28} />
          <span>Second Serve</span>
        </Link>

        <div className="register-nav-links">
          <Link to="/">How It Works</Link>
          <Link to="/">For Donors</Link>
          <Link to="/">For Recipients</Link>
          <Link to="/">Impact</Link>
          <Link to="/">About Us</Link>
        </div>

        <div className="register-nav-actions">
          <Link to="/login" className="nav-btn ghost">
            Log in
          </Link>

          <Link to="/register" className="nav-btn primary">
            Register
          </Link>
        </div>
      </nav>

      <section className="register-layout">
        <motion.aside
          className="register-info"
          initial={{ opacity: 0, x: -35 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="mission-pill">
            <Leaf size={15} />
            Join our mission
          </span>

          <h1>
            Create your account and <span>make an impact</span>
          </h1>

          <p>
            Whether you're a donor with surplus food or an organization feeding
            communities, we're glad to have you on board.
          </p>

          <div className="info-list">
            <InfoItem
              icon={<Users />}
              title="For Donors"
              text="Businesses and organizations with food to donate."
            />

            <InfoItem
              icon={<HeartHandshake />}
              title="For Recipients"
              text="Organizations and nonprofits serving those in need."
            />

            <InfoItem
              icon={<ShieldCheck />}
              title="Secure & Trusted"
              text="Your data is protected and used only to power our mission."
            />
          </div>
        </motion.aside>

        <motion.section
          className="register-card"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75 }}
        >
          <div className="register-card-header">
            <div className="header-icon">
              <UserPlus />
            </div>

            <h2>Create Account</h2>
            <p>Choose your account type to get started.</p>
          </div>

          <div className="account-toggle">
            <button
              className={accountType === "donor" ? "selected" : ""}
              onClick={() => setAccountType("donor")}
              type="button"
            >
              <Building2 />

              <div>
                <strong>I'm a Donor</strong>
                <span>Business / Donor</span>
              </div>
            </button>

            <button
              className={accountType === "recipient" ? "selected" : ""}
              onClick={() => setAccountType("recipient")}
              type="button"
            >
              <Users />

              <div>
                <strong>I'm a Recipient</strong>
                <span>Organization / Nonprofit</span>
              </div>
            </button>
          </div>

          <form className="register-form" onSubmit={handleSubmit}>
            <Input
              icon={<Building2 />}
              label="Organization Name"
              placeholder="Enter your organization name"
              name="organizationName"
              value={formData.organizationName}
              onChange={handleChange}
              required
            />

            <div className="form-row">
              <Input
                icon={<Users />}
                label="Contact Name"
                placeholder="Full name"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
              />

              <Input
                icon={<Mail />}
                label="Email Address"
                placeholder="you@organization.org"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={validateEmail}
                error={emailError}
                required
              />
            </div>

            <Input
              icon={<Lock />}
              label="Password"
              placeholder="Create a strong password"
              type={showPassword ? "text" : "password"}
              hasEye
              isPasswordVisible={showPassword}
              onEyeClick={() => setShowPassword((current) => !current)}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              icon={<Lock />}
              label="Confirm Password"
              placeholder="Confirm your password"
              type={showConfirmPassword ? "text" : "password"}
              hasEye
              isPasswordVisible={showConfirmPassword}
              onEyeClick={() =>
                setShowConfirmPassword((current) => !current)
              }
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Input
              icon={<Phone />}
              label="Phone Number"
              placeholder="3521234567"
              type="text"
              inputMode="numeric"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              required
            />

            <Input
              icon={<MapPin />}
              label="Address"
              placeholder="Street address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <div className="form-row three">
              <Input
                icon={<Building2 />}
                label="City"
                placeholder="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />

              <Input
                icon={<Map />}
                label="State"
                placeholder="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />

              <Input
                icon={<Tag />}
                label="ZIP Code"
                placeholder="32601"
                type="text"
                inputMode="numeric"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                maxLength={5}
                required
              />
            </div>

            <label className="terms">
              <input type="checkbox" required />

              <span>
                I agree to the <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy Policy</a>
              </span>
            </label>

            <button className="create-btn" type="submit">
              Create Account
            </button>

            <p className="login-text">
              Already have an account? <Link to="/login">Log in</Link>
            </p>

            <div className="safe-box">
              <ShieldCheck />

              <div>
                <strong>Your information is safe with us</strong>

                <p>
                  We use industry-standard security to protect your data and
                  ensure a trusted experience.
                </p>
              </div>
            </div>
          </form>
        </motion.section>
      </section>
    </main>
  );
}

function InfoItem({ icon, title, text }) {
  return (
    <div className="info-item">
      <div>{icon}</div>

      <section>
        <h3>{title}</h3>
        <p>{text}</p>
      </section>
    </div>
  );
}

function Input({
  icon,
  label,
  placeholder,
  type = "text",
  hasEye = false,
  isPasswordVisible = false,
  onEyeClick,
  name,
  value,
  onChange,
  onBlur,
  maxLength,
  inputMode,
  error,
  required = false,
}) {
  return (
    <label className={`field ${error ? "field-error" : ""}`}>
      <span>
        {label}
        {required && <b> *</b>}
      </span>

      <div className="input-wrap">
        {icon}

        <input
          type={type}
          placeholder={placeholder}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          maxLength={maxLength}
          inputMode={inputMode}
          required={required}
          aria-invalid={Boolean(error)}
        />

        {hasEye && (
          <button
            className="eye-button"
            type="button"
            onClick={onEyeClick}
            aria-label={
              isPasswordVisible ? "Hide password" : "Show password"
            }
          >
            {isPasswordVisible ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        )}
      </div>

      {error && <small className="field-error-message">{error}</small>}
    </label>
  );
}