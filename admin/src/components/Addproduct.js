import React, { useState } from 'react'
import upload_area from "../assets/upload_area.svg"

const Addproduct = () => {
	const [image, setImage] = useState(null);
	const [errors, setErrors] = useState({});
	const [successMessage, setSuccessMessage] = useState("");

	const [productDetails, setProductDetails] = useState({
		name: "",
		new_price: "",
		old_price: "",
		image: "",
		category: "women"
	});

	const handleImage = (e) => {
		setImage(e.target.files[0]);
	};

	const handleProductChange = (e) => {
		setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
	};

	// ✅ Validation
	const validateForm = () => {
		let formErrors = {};

		if (!productDetails.name.trim()) {
			formErrors.name = "Product name is required";
		}
		if (!productDetails.old_price || isNaN(productDetails.old_price)) {
			formErrors.old_price = "Price must be a valid number";
		}
		if (!productDetails.new_price || isNaN(productDetails.new_price)) {
			formErrors.new_price = "Offer price must be a valid number";
		}
		if (!image) {
			formErrors.image = "Product image is required";
		}

		setErrors(formErrors);
		return Object.keys(formErrors).length === 0;
	};

	// AddProduct endpoints
	const addProduct = async (product) => {
		let addProductRes = await fetch('http://localhost:5000/product/addproduct', {
			method: "POST",
			headers: {
				Accept: "application/json",
				'Content-Type': "application/json",
			},
			body: JSON.stringify(product),
		});

		let addProductData = await addProductRes.json();
		if (addProductData.success) {
			setSuccessMessage("✅ Product added successfully!");
			setProductDetails({
				name: "",
				new_price: "",
				old_price: "",
				image: "",
				category: "women"
			});
			setImage(null);
			setErrors({});
		} else {
			setSuccessMessage("❌ Failed to add product, please try again.");
		}
	};

	// Upload product to storage engine
	const uploadProduct = async (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		let product = productDetails;

		let formData = new FormData();
		formData.append('product', image);

		let uploadResponse = await fetch('http://localhost:5000/product/upload', {
			method: "POST",
			headers: {
				Accept: "application/json"
			},
			body: formData,
		});

		let uploadData = await uploadResponse.json();
		if (uploadData.success) {
			product.image = uploadData.image_url;
			addProduct(product);
		} else {
			setSuccessMessage("❌ Failed to upload image.");
		}
	};

	return (
		<div className="container mt-5 ">
			<div style={{ margin: "auto" }}>
				<form className="border p-5 shadow-sm rounded" style={{ maxWidth: "60vw" }} onSubmit={uploadProduct}>
					<h3 className="mb-4">Add New Product</h3>

					{/* Product Name */}
					<div className="mb-3">
						<label className="form-label">Product Title</label>
						<input
							type="text"
							name="name"
							className={`form-control ${errors.name ? "is-invalid" : ""}`}
							value={productDetails.name}
							onChange={handleProductChange}
							placeholder="Enter product name"
						/>
						{errors.name && <div className="invalid-feedback">{errors.name}</div>}
					</div>

					{/* Prices */}
					<div className="row g-3 mb-3">
						<div className="col">
							<label className="form-label">Price</label>
							<input
								type="text"
								name="old_price"
								className={`form-control ${errors.old_price ? "is-invalid" : ""}`}
								value={productDetails.old_price}
								onChange={handleProductChange}
								placeholder="Enter price"
							/>
							{errors.old_price && <div className="invalid-feedback">{errors.old_price}</div>}
						</div>
						<div className="col">
							<label className="form-label">Offer Price</label>
							<input
								type="text"
								name="new_price"
								className={`form-control ${errors.new_price ? "is-invalid" : ""}`}
								value={productDetails.new_price}
								onChange={handleProductChange}
								placeholder="Enter discounted price"
							/>
							{errors.new_price && <div className="invalid-feedback">{errors.new_price}</div>}
						</div>
					</div>

					{/* Category */}
					<div className="mb-3">
						<label className="form-label">Product Category</label>
						<select
							name="category"
							className="form-select"
							value={productDetails.category}
							onChange={handleProductChange}
						>
							<option value="women">Women</option>
							<option value="men">Men</option>
							<option value="kid">Kid</option>
						</select>
					</div>

					{/* Image Upload */}
					<div className="mb-3">
						<label htmlFor="file-input" className="form-label">Product Image</label>
						<div>
							<label htmlFor="file-input" style={{ cursor: "pointer" }}>
								<img
									src={image ? URL.createObjectURL(image) : upload_area}
									alt="upload preview"
									style={{ width: "120px", border: "1px solid #ddd", borderRadius: "5px" }}
								/>
							</label>
							<input
								id="file-input"
								name="image"
								type="file"
								hidden
								onChange={handleImage}
							/>
						</div>
						{errors.image && <div className="text-danger mt-1">{errors.image}</div>}
					</div>

					{/* Submit Button */}
					<button type="submit" className="btn btn-primary">Add Product</button>

					{/* Success / Error Message */}
					{successMessage && (
						<div className="mt-3 alert alert-info">
							{successMessage}
						</div>
					)}
				</form>
			</div>
		</div>
	);
}

export default Addproduct;
