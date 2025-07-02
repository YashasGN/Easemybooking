import axios from "axios";

export const uploadToCloudinary = async (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "ease_my_booking_organiser_dashboard"); 
  data.append("cloud_name", "ddhiytpcl");

  try {
    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/ddhiytpcl/image/upload",
      data
    );
    return res.data.secure_url;
  } catch (err) {
    console.error("Upload Error:", err);
    return null;
  }
};
