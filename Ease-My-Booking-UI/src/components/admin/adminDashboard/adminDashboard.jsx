import React, { useState } from "react";
import "./adminDashboard.css";
import VerifyPlace from "../verifyPlace/verifyPlace";
import VerifiedPlaces from "../verifiedPlace/verifiedPlace";
import { useDispatch } from "react-redux";
import { updateRoleThunk } from "../../../appState/appThunk/authThunk";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState(null);
  const [verifiedPlaces, setVerifiedPlaces] = useState([]);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleAddVerifiedPlace = (place) => {
    setVerifiedPlaces((prev) => {
      const alreadyExists = prev.some(
        (p) => p.name === place.name && p.city === place.city
      );
      if (!alreadyExists) {
        return [...prev, place];
      }
      return prev;
    });
  };

  const handleRoleSubmit = async () => {
    if (!email || !role) {
      toast.warn("⚠️ Please enter email and select a role.");
      return;
    }

    try {
      const response = await dispatch(
        updateRoleThunk({ userEmail: email, role })
      ).unwrap();

      // Check response.message and show appropriate toast
      if (response?.message === "Role updated successfully") {
        toast.success("✅ Role updated successfully!");
        setEmail("");
        setRole("");
      } else if (response?.message === "User already has the role") {
        toast.info("ℹ️ User already has the role.");
      } else if (response?.message === "User not found") {
        toast.error("❌ Email not found.");
      } else {
        toast.error("❌ Unexpected response from server.");
      }
    } catch (err) {
      // Catch rejects like 400, 409, etc.
      const errorMessage =
        typeof err === "string" ? err : err?.message || "Unknown error";
      toast.error(`❌ Failed to update role: ${errorMessage}`);
    }
  };

  return (
    <div className="dashboard-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <aside className="sidebar">
        <h1 className="sidebar-title">👋 Welcome, Admin</h1>
        <p className="sidebar-subtext">Dashboard Navigation</p>

        <button
          className={`sidebar-button ${activeTab === "view" ? "active" : ""}`}
          onClick={() => handleTabClick("view")}
        >
          👁️ View Place
        </button>
        <button
          className={`sidebar-button ${activeTab === "verified" ? "active" : ""}`}
          onClick={() => handleTabClick("verified")}
        >
          ✅ Verified Places
        </button>
        <button
          className={`sidebar-button ${activeTab === "role" ? "active" : ""}`}
          onClick={() => handleTabClick("role")}
        >
          👤 Add Role
        </button>
      </aside>

      <main className="main-content">
        {!activeTab && (
          <div className="welcome-message">
            <h2>Admin Dashboard</h2>
            <p>Select an option on the left to get started.</p>
          </div>
        )}

        {activeTab === "view" && (
          <VerifyPlace onVerify={handleAddVerifiedPlace} />
        )}

        {activeTab === "verified" && (
          <VerifiedPlaces verifiedPlaces={verifiedPlaces} />
        )}

        {activeTab === "role" && (
          <div style={{ maxWidth: 400 }}>
            <h2>Add Role</h2>
            <TextField
              label="User Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: "1rem" }}
            />

            <FormControl fullWidth variant="outlined" style={{ marginBottom: "1rem" }}>
              <InputLabel>Select Role</InputLabel>
              <Select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                label="Select Role"
              >
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="Organiser">Organiser</MenuItem>
              </Select>
            </FormControl>

            <Button variant="contained" color="primary" onClick={handleRoleSubmit}>
              Submit
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
