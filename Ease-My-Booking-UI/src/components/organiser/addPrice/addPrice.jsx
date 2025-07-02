import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  addPriceThunk,
  updatePriceThunk,
  fetchSlotByPackageId,
  fetchPriceByPackageId, // ✅ Needed in edit mode
} from "../../../appState/appThunk/packageDetailsThunk";

const AddPrice = ({ open, handleClose, packageId: initialPackageId, mode = "add" }) => {
  const dispatch = useDispatch();
  const { items: packages } = useSelector((state) => state.packages);
  const { slotsByPackageId, pricesByPackageId } = useSelector((state) => state.slotPrice);

  const [selectedPackageId, setSelectedPackageId] = useState(initialPackageId || "");
  const [selectedSlotId, setSelectedSlotId] = useState("");
  const [form, setForm] = useState({
    priceChildren: "",
    priceAdults: "",
    priceSenior: "",
    priceForeign: "",
  });

  // 1. On open or prop change, set package ID and fetch slots
  useEffect(() => {
    if (initialPackageId) {
      setSelectedPackageId(initialPackageId);
      dispatch(fetchSlotByPackageId(initialPackageId));
    }
  }, [initialPackageId, dispatch]);

  const slotOptions = slotsByPackageId[selectedPackageId] || [];

  // 2. In edit mode, when slot is selected, fetch its price
  useEffect(() => {
    if (mode === "edit" && selectedSlotId) {
      dispatch(fetchPriceByPackageId(selectedSlotId));
    }
  }, [selectedSlotId, mode, dispatch]);

  // 3. Watch pricesByPackageId to update form if price exists
  useEffect(() => {
    if (mode === "edit" && selectedSlotId) {
      const priceData = pricesByPackageId[selectedSlotId];

      if (priceData) {
        setForm({
          priceChildren: priceData.priceChildren?.toString() || "",
          priceAdults: priceData.priceAdults?.toString() || "",
          priceSenior: priceData.priceSenior?.toString() || "",
          priceForeign: priceData.priceForeign?.toString() || "",
        });
      } else {
        setForm({
          priceChildren: "",
          priceAdults: "",
          priceSenior: "",
          priceForeign: "",
        });
      }
    }
  }, [pricesByPackageId, selectedSlotId, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    if (!selectedPackageId || !selectedSlotId) {
      alert("Please select both package and slot");
      return;
    }

    const payload = {
      priceChildren: parseFloat(form.priceChildren),
      priceAdults: parseFloat(form.priceAdults),
      priceSenior: parseFloat(form.priceSenior),
      priceForeign: parseFloat(form.priceForeign),
    };

    if (mode === "add") {
      dispatch(
        addPriceThunk({
          packageId: parseInt(selectedPackageId),
          slotId: parseInt(selectedSlotId),
          ...payload,
          createdAt: new Date().toISOString(),
        })
      );
    } else {
      dispatch(
        updatePriceThunk({
          slotId: parseInt(selectedSlotId),
          updatedData: payload,
        })
      );
    }

    // Reset and close
    handleClose();
    setForm({
      priceChildren: "",
      priceAdults: "",
      priceSenior: "",
      priceForeign: "",
    });
    setSelectedSlotId("");
    setSelectedPackageId(initialPackageId || "");
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{mode === "edit" ? "Edit Price" : "Add Price"}</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, width: 400 }}>
        {/* Package dropdown */}
        <TextField
          select
          label="Select Package"
          value={selectedPackageId}
          onChange={(e) => {
            setSelectedPackageId(e.target.value);
            setSelectedSlotId("");
            dispatch(fetchSlotByPackageId(e.target.value));
          }}
          fullWidth
          disabled={mode === "edit"}
        >
          <MenuItem value="">-- Select Package --</MenuItem>
          {packages.map((pkg) => (
            <MenuItem key={pkg.id} value={pkg.id}>
              {pkg.packageName}
            </MenuItem>
          ))}
        </TextField>

        {/* Slot dropdown */}
        <TextField
          select
          label="Select Slot"
          value={selectedSlotId}
          onChange={(e) => {
            setSelectedSlotId(e.target.value);
          }}
          fullWidth
          disabled={!selectedPackageId}
        >
          <MenuItem value="">-- Select Slot --</MenuItem>
          {slotOptions.map((slot) => (
            <MenuItem key={slot.slotsId || slot.id} value={slot.slotsId || slot.id}>
              {slot.date?.split("T")[0]} - {slot.timeFrom} to {slot.timeTo}
            </MenuItem>
          ))}
        </TextField>

        {/* Price Inputs */}
        <TextField
          label="Children Price"
          name="priceChildren"
          type="number"
          value={form.priceChildren}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Adult Price"
          name="priceAdults"
          type="number"
          value={form.priceAdults}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Senior Price"
          name="priceSenior"
          type="number"
          value={form.priceSenior}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Foreign Price"
          name="priceForeign"
          type="number"
          value={form.priceForeign}
          onChange={handleChange}
          fullWidth
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {mode === "edit" ? "Update Price" : "Add Price"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddPrice;
