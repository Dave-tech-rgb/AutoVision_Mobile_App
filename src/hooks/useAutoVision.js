import { useState } from "react";

export const useAutoVision = () => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const resetForm = () => setFormData({});

  return {
    formData,
    handleInputChange,
    resetForm
  };
};