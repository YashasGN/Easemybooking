import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addSlotThunk,
  updateSlotThunk,
  fetchSlotByPackageId,
} from "../../../appState/appThunk/packageDetailsThunk";
import dayjs from "dayjs";

const formatTime = (timeStr) => (timeStr.length === 5 ? `${timeStr}:00` : timeStr);

const AddSlot = ({ open, handleClose, packageId = null, mode = "add" }) => {
  const dispatch = useDispatch();
  const { items: packages } = useSelector((state) => state.packages);
  const { slotsByPackageId } = useSelector((state) => state.slotPrice);

  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [form, setForm] = useState({
    packageId: "",
    date: dayjs().format("YYYY-MM-DD"),
    timeFrom: "",
    timeTo: "",
    maxTicket: "",
  });

  // Set initial packageId in edit or add
  useEffect(() => {
    if (packageId) {
      setForm((prev) => ({ ...prev, packageId }));
    }
  }, [packageId]);

  // Fetch slots if editing and packageId is valid
  useEffect(() => {
    if (mode === "edit" && form.packageId) {
      dispatch(fetchSlotByPackageId(form.packageId));
    }
  }, [mode, form.packageId, dispatch]);

  // Reset selectedSlotId if packageId changes
  useEffect(() => {
    setSelectedSlotId("");
  }, [form.packageId]);

  // Populate form fields from selected slot
  useEffect(() => {
    if (mode === "edit" && selectedSlotId && slotsByPackageId[form.packageId]) {
      const selectedSlot = slotsByPackageId[form.packageId].find(
        (s) => s.slotsId === parseInt(selectedSlotId)
      );
      if (selectedSlot) {
        setForm((prev) => ({
          ...prev,
          date: selectedSlot.date?.split("T")[0] || dayjs().format("YYYY-MM-DD"),
          timeFrom: selectedSlot.timeFrom?.slice(0, 5) || "",
          timeTo: selectedSlot.timeTo?.slice(0, 5) || "",
          maxTicket: selectedSlot.maxTicket?.toString() || "",
        }));
      }
    }
  }, [selectedSlotId, mode, form.packageId, slotsByPackageId]);

  const timeOptions = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00", "19:00",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const payload = {
      date: form.date,
      timeFrom: formatTime(form.timeFrom),
      timeTo: formatTime(form.timeTo),
      maxTicket: parseInt(form.maxTicket),
    };

    if (mode === "add") {
      dispatch(
        addSlotThunk({
          ...form,
          timeFrom: payload.timeFrom,
          timeTo: payload.timeTo,
          maxTicket: payload.maxTicket,
          createdAt: new Date().toISOString(),
        })
      );
    } else if (mode === "edit") {
      if (!selectedSlotId) {
        alert("Please select a slot to update.");
        return;
      }

      dispatch(
        updateSlotThunk({
          id: parseInt(selectedSlotId),
          updatedData: payload,
        })
      );
    }

    handleClose();
    setSelectedSlotId("");
    setForm({
      packageId: packageId || "",
      date: dayjs().format("YYYY-MM-DD"),
      timeFrom: "",
      timeTo: "",
      maxTicket: "",
    });
  };

  const slotOptions = slotsByPackageId[form.packageId] || [];

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{mode === "edit" ? "Edit Slot" : "Add Slot"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: 400 }}>
        <TextField
          select
          label="Select Package"
          name="packageId"
          value={form.packageId}
          onChange={handleChange}
          fullWidth
          disabled={mode === "edit"}
        >
          {packages.map((pkg) => (
            <MenuItem key={pkg.id} value={pkg.id}>
              {pkg.packageName}
            </MenuItem>
          ))}
        </TextField>

        {mode === "edit" && (
          <TextField
            select
            label="Select Slot to Edit"
            value={selectedSlotId}
            onChange={(e) => setSelectedSlotId(e.target.value)}
            fullWidth
          >
            {slotOptions.length === 0 ? (
              <MenuItem disabled>No slots available for this package</MenuItem>
            ) : (
              slotOptions.map((slot) => (
                <MenuItem key={slot.slotsId} value={slot.slotsId}>
                  {slot.date?.split("T")[0]} - {slot.timeFrom} to {slot.timeTo}
                </MenuItem>
              ))
            )}
          </TextField>
        )}

        <TextField
          label="Date"
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          InputLabelProps={{ shrink: true }}
          fullWidth
        />

        <TextField
          select
          label="Time From"
          name="timeFrom"
          value={form.timeFrom}
          onChange={handleChange}
          fullWidth
        >
          {timeOptions.map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Time To"
          name="timeTo"
          value={form.timeTo}
          onChange={handleChange}
          fullWidth
        >
          {timeOptions.map((time) => (
            <MenuItem key={time} value={time}>
              {time}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Max Tickets"
          name="maxTicket"
          type="number"
          value={form.maxTicket}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === "edit" ? "Update Slot" : "Add Slot"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSlot;
