import React, { useState, useEffect } from "react";
import "../FormComponent.css";

const FormComponent = ({ formData, setFormData }) => {
  const [goods, setGoods] = useState([
    { itemDescription: "", hsnCode: "", qty: "", unit: "", rate: "" },
  ]);

  // Helper to get today's date in yyyy-mm-dd format
  const getToday = () => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const yyyy = today.getFullYear();
    return `${yyyy}-${mm}-${dd}`;
  };

  // Set default date values if not already set
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      invoiceDate: prev.invoiceDate || getToday(),
      supplyDate: prev.supplyDate || getToday(),
      EWayDate: prev.EWayDate || getToday(),
      items: prev.items || goods, // ensure formData.items initialized
    }));
  }, [setFormData]);

  // Keep formData.items in sync with goods
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      items: goods,
    }));
  }, [goods, setFormData]);

  // Handle text/number changes for main form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle goods input changes
  const handleGoodsChange = (index, e) => {
    const { name, value } = e.target;
    const updatedGoods = [...goods];
    updatedGoods[index][name] = value;
    setGoods(updatedGoods);
  };

  // Add a new goods row
  const addRow = () => {
    setGoods([
      ...goods,
      { itemDescription: "", hsnCode: "", qty: "", unit: "", rate: "" },
    ]);
  };

  // Remove a row
  const removeRow = (index) => {
    const updatedGoods = goods.filter((_, i) => i !== index);
    setGoods(updatedGoods);
  };

  return (
    <form className="invoice-form" onSubmit={(e) => e.preventDefault()}>
      <h1>Invoice Form</h1>

      {/* Invoice Section */}
      <section>
        <h2>Invoice Details</h2>
        <div className="form-row">
          <label>Invoice No:</label>
          <input
            type="text"
            name="invoiceNo"
            value={formData.invoiceNo || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>Date of Invoice:</label>
          <input
            type="date"
            name="invoiceDate"
            value={formData.invoiceDate || ""}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Supply Section */}
      <section>
        <h2>Supply / Transport</h2>
        <div className="form-row">
          <label>Transportation Mode:</label>
          <input
            type="text"
            name="transportMode"
            value={formData.transportMode || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>Vehicle Number:</label>
          <input
            type="text"
            name="vehicleNumber"
            value={formData.vehicleNumber || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>Date of Supply:</label>
          <input
            type="date"
            name="supplyDate"
            value={formData.supplyDate || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>Place of Supply:</label>
          <input
            type="text"
            name="placeOfSupply"
            value={formData.placeOfSupply || ""}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Billed To Section */}
      <section>
        <h2>Billed To</h2>
        <div className="form-row">
          <label>Name:</label>
          <input
            type="text"
            name="billedName"
            value={formData.billedName || ""}
            onChange={handleChange}
          />
        </div>
         <div className="form-row">
          <label>Pan No:</label>
          <input
            type="text"
            name="panNo"
            value={formData.panNo || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>Address:</label>
          <textarea
            name="billedAddress"
            value={formData.billedAddress || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>GSTIN:</label>
          <input
            type="text"
            name="billedGstin"
            value={formData.billedGstin || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>State:</label>
          <input
            type="text"
            name="billedState"
            value={formData.billedState || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>State Code:</label>
          <input
            type="text"
            name="billedStateCode"
            value={formData.billedStateCode || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>E-Way Bill No:</label>
          <input
            type="text"
            name="EWayBillNo"
            value={formData.EWayBillNo || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>E-Way Date:</label>
          <input
            type="date"
            name="EWayDate"
            value={formData.EWayDate || ""}
            onChange={handleChange}
          />
        </div>
      </section>

      {/* Goods Section */}
      <section>
        <h2>Goods Details</h2>
        {goods.map((item, index) => (
          <div key={index} className="goods-row">
            <input
              type="text"
              name="itemDescription"
              placeholder="Item Description"
              className="desc-input"
              value={item.itemDescription}
              onChange={(e) => handleGoodsChange(index, e)}
            />
            <input
              type="number"
              name="hsnCode"
              placeholder="HSN"
              className="small-input"
              value={item.hsnCode}
              onChange={(e) => handleGoodsChange(index, e)}
            />
            <input
              type="number"
              name="qty"
              placeholder="Qty"
              className="small-input"
              value={item.qty}
              onChange={(e) => handleGoodsChange(index, e)}
            />
            <input
              type="text"
              name="unit"
              placeholder="Unit"
              className="small-input"
              value={item.unit}
              onChange={(e) => handleGoodsChange(index, e)}
            />
            <input
              type="number"
              name="rate"
              placeholder="Rate"
              className="small-input"
              value={item.rate}
              onChange={(e) => handleGoodsChange(index, e)}
            />
            <button
              type="button"
              className="remove-btn"
              onClick={() => removeRow(index)}
            >
              🗑
            </button>
          </div>
        ))}
        <button type="button" className="add-btn" onClick={addRow}>
          + Add Item
        </button>
      </section>

      {/* Tax Section */}
      <section>
        <h2>Tax Rates</h2>
        <div className="form-row">
          <label>CGST %:</label>
          <input
            type="number"
            name="cgst"
            value={formData.cgst || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>SGST %:</label>
          <input
            type="number"
            name="sgst"
            value={formData.sgst || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label>IGST %:</label>
          <input
            type="number"
            name="igst"
            value={formData.igst || ""}
            onChange={handleChange}
          />
        </div>
      </section>
    </form>
  );
};

export default FormComponent;
