import React, { useState } from "react";
import { Check } from "lucide-react";

export default function ProductForm({ modal, setModal, saveProduct, notify, products = [] }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [basePrice, setBasePrice] = useState(modal.product ? (modal.product.oldPrice > modal.product.price ? modal.product.oldPrice : modal.product.price) : "");
  const [discount, setDiscount] = useState(() => {
    const value = Number.parseFloat(modal.product?.discount || "0");
    return Number.isFinite(value) && value >= 0 && value <= 100 ? value : 0;
  });
  const salePrice = Math.round(Number(basePrice) * (1 - Number(discount) / 100) * 100) / 100;
  const [primaryColor, setPrimaryColor] = useState(modal.product?.color || "#00c12b");
  const [colorOptions, setColorOptions] = useState(() => [...new Set(["#00c12b", "#4f4631", "#314f4a", "#31344f", modal.product?.color, ...(modal.product?.colors || [])].filter(Boolean).map(color => color.toLowerCase()))]);
  const [sizeOptions, setSizeOptions] = useState(() => [...new Set(["Small", "Medium", "Large", "X-Large", ...(modal.product?.sizes || [])])]);
  const [selectedColors, setSelectedColors] = useState(() => (modal.product?.colors || ["#00c12b", "#4f4631", "#314f4a", "#31344f"]).map(color => color.toLowerCase()));
  const [selectedSizes, setSelectedSizes] = useState(modal.product?.sizes || ["Small", "Medium", "Large", "X-Large"]);
  const [editingColor, setEditingColor] = useState("");
  const [colorDraft, setColorDraft] = useState("#000000");
  const [editingSize, setEditingSize] = useState("");
  const [sizeDraft, setSizeDraft] = useState("");
  const [styleOptions, setStyleOptions] = useState(() => {
    const values = [modal.product?.style, "Casual", "Formal", "Party", "Gym", ...products.map(product => product.style)].filter(Boolean).map(value => value.trim());
    return values.filter((value, index) => values.findIndex(option => option.toLowerCase() === value.toLowerCase()) === index);
  });
  const [selectedStyle, setSelectedStyle] = useState(modal.product?.style?.trim() || "");
  const [editingStyle, setEditingStyle] = useState("");
  const [styleDraft, setStyleDraft] = useState("");
  function saveStyle() {
    const value = styleDraft.trim();
    if (!value || value.length > 100) { setError("Enter a style name of 1 to 100 characters."); return; }
    if (styleOptions.some(option => option !== editingStyle && option.toLowerCase() === value.toLowerCase())) { setError("That style already exists."); return; }
    setStyleOptions(current => editingStyle ? current.map(option => option === editingStyle ? value : option) : [...current, value]);
    setSelectedStyle(value);
    setEditingStyle(""); setStyleDraft(""); setError("");
  }
  function toggle(value, setSelected) { setSelected(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value]); }
  function saveOption(kind) {
    const isColor = kind === "color";
    const value = (isColor ? colorDraft : sizeDraft).trim();
    const editing = isColor ? editingColor : editingSize;
    const options = isColor ? colorOptions : sizeOptions;
    if (!value || (!isColor && value.length > 40)) { setError("Enter a size of 1 to 40 characters."); return; }
    if (options.some(option => option.toLowerCase() === value.toLowerCase() && option !== editing)) { setError(`That ${kind} already exists.`); return; }
    (isColor ? setColorOptions : setSizeOptions)(current => editing ? current.map(item => item === editing ? value : item) : [...current, value]);
    (isColor ? setSelectedColors : setSelectedSizes)(current => editing ? current.map(item => item === editing ? value : item) : [...current, value]);
    if (isColor && primaryColor.toLowerCase() === editing) setPrimaryColor(value);
    if (isColor) { setEditingColor(""); setColorDraft("#000000"); }
    else { setEditingSize(""); setSizeDraft(""); }
    setError("");
  }
  async function handleSubmit(event) {
    event.preventDefault();
    if (busy) return;
    const data = new FormData(event.currentTarget);
    const name = data.get("name").trim();
    if (!name) { setError("Enter a product name."); return; }
    data.set("name", name);
    const percentage = Number(discount);
    if (basePrice === "" || !Number.isFinite(Number(basePrice)) || Number(basePrice) < 0 || !Number.isFinite(percentage) || percentage < 0 || percentage > 100) { setError("Enter a valid price and a discount between 0 and 100%."); return; }
    data.set("price", String(salePrice));
    data.set("oldPrice", percentage > 0 ? String(Number(basePrice)) : "0");
    data.set("discount", `${percentage}%`);
    data.set("description", String(data.get("description") || "").trim());
    for (const field of ["brand", "style"]) data.set(field, String(data.get(field) || "").trim());
    const colors = data.getAll("colors");
    const sizes = data.getAll("sizes");
    data.set("colors", JSON.stringify([...new Set(colors)]));
    data.set("sizes", JSON.stringify([...new Set(sizes)]));
    const file = data.get("image");
    if (file?.size && !["image/jpeg", "image/png", "image/webp"].includes(file.type)) { setError("Choose a JPEG, PNG, or WebP image."); return; }
    if (file?.size > 3 * 1024 * 1024) { setError("Choose an image smaller than 3 MB."); return; }
    if (!file?.size) data.delete("image");
    const gallery = data.getAll("galleryImages").filter(file => file.size);
    if (gallery.length > 8) { setError("Choose up to 8 additional images."); return; }
    if (gallery.some(file => !["image/jpeg", "image/png", "image/webp"].includes(file.type) || file.size > 3 * 1024 * 1024)) { setError("Additional images must be JPEG, PNG, or WebP and smaller than 3 MB each."); return; }
    if (gallery.reduce((total, image) => total + image.size, file?.size || 0) > 4 * 1024 * 1024) { setError("Keep the combined upload size below 4 MB. Compress your images or upload fewer at a time."); return; }
    if (!gallery.length) data.delete("galleryImages");
    setBusy(true);
    setError("");
    try {
      await saveProduct(modal.product?.id, data);
      setModal(null);
      notify(modal.product ? "Product updated" : "Product added to your catalog");
    } catch (error) { setError(error.message); }
    finally { setBusy(false); }
  }
  const categories = [...new Set([modal.product?.category, "Electronics", "Fashion", "Home & Living", "Accessories"].filter(Boolean))];
  const colorNames = { "#00c12b": "Green", "#4f4631": "Brown", "#314f4a": "Teal", "#31344f": "Navy" };
  return (
    <>
      <h2 id="modal-title">{modal.product ? "Edit product" : "Add a new product"}</h2>
      <p>{modal.product ? "Update the details below. Your current image is kept unless you choose a replacement." : "Changes are saved to your catalog."}</p>
      <form onSubmit={handleSubmit}>
        <label>Product name<input name="name" required maxLength={200} defaultValue={modal.product?.name} /></label>
        <label>Category<select name="category" defaultValue={modal.product ? modal.product.category || "" : "Electronics"}>
          <option value="">Uncategorized</option>
          {categories.map(category => <option key={category}>{category}</option>)}
        </select></label>
        <label>Primary color<div className="color-select"><span className="color-swatch" style={{ backgroundColor: primaryColor }} aria-hidden="true" /><select name="color" value={primaryColor.toLowerCase()} onChange={event => setPrimaryColor(event.target.value)}>
          {colorOptions.map(color => <option key={color} value={color}>{colorNames[color.toLowerCase()] || color} ({color})</option>)}
        </select></div></label>
        <fieldset className="product-colors"><legend>Available colors</legend>
          <div className="product-color-options">
            {colorOptions.map(color => <label className="product-color-option" key={color}>
              <input type="checkbox" name="colors" value={color} checked={selectedColors.includes(color)} onChange={() => toggle(color, setSelectedColors)} />
              <span className="product-color-chip">
                <span className="color-swatch" style={{ backgroundColor: color }} aria-hidden="true" />
                <span className="product-color-name">{colorNames[color.toLowerCase()] || color}<small>{color}</small></span>
                <Check className="product-color-check" size={16} aria-hidden="true" />
              </span>
            </label>)}
          </div>
          <small className="product-color-hint">Tap any color to select or deselect it. You can choose more than one.</small>
          <details className="product-option-editor"><summary>Add or edit colors</summary>
            <div className="product-option-controls">
              <label>Color to edit<select value={editingColor} onChange={event => { setEditingColor(event.target.value); setColorDraft(event.target.value || "#000000"); }}><option value="">Add new color</option>{colorOptions.map(color => <option key={color}>{color}</option>)}</select></label>
              <label>Color<input type="color" value={colorDraft} onChange={event => setColorDraft(event.target.value)} /></label>
              <button type="button" disabled={busy} onClick={() => saveOption("color")}>{editingColor ? "Update color" : "Add color"}</button>
            </div>
          </details>
        </fieldset>
        <fieldset className="product-sizes"><legend>Available sizes</legend><div>
          {sizeOptions.map(size => <label key={size}><input type="checkbox" name="sizes" value={size} checked={selectedSizes.includes(size)} onChange={() => toggle(size, setSelectedSizes)} />{size}</label>)}
        </div>
          <details className="product-option-editor"><summary>Add or edit sizes</summary>
            <div className="product-option-controls">
              <label>Size to edit<select value={editingSize} onChange={event => { setEditingSize(event.target.value); setSizeDraft(event.target.value); }}><option value="">Add new size</option>{sizeOptions.map(size => <option key={size}>{size}</option>)}</select></label>
              <label>Size name<input value={sizeDraft} maxLength={40} placeholder="e.g. XX-Large" onChange={event => setSizeDraft(event.target.value)} /></label>
              <button type="button" disabled={busy} onClick={() => saveOption("size")}>{editingSize ? "Update size" : "Add size"}</button>
            </div>
          </details>
        </fieldset>
        <label>Product description<textarea name="description" rows={4} maxLength={4000} placeholder="Describe the product, features, and materials" defaultValue={modal.product?.description || ""} /></label>
        <label>Brand<input name="brand" maxLength={100} placeholder="e.g. Nike, Zara, Gucci" defaultValue={modal.product?.brand || ""} /></label>
        <div>
          <label>Style<select name="style" value={selectedStyle} onChange={event => setSelectedStyle(event.target.value)}><option value="">No style</option>{styleOptions.map(style => <option key={style}>{style}</option>)}</select></label>
          <details className="product-option-editor"><summary>Add or edit styles</summary>
            <div className="product-option-controls">
              <label>Style to edit<select value={editingStyle} onChange={event => { setEditingStyle(event.target.value); setStyleDraft(event.target.value); }}><option value="">Add new style</option>{styleOptions.map(style => <option key={style}>{style}</option>)}</select></label>
              <label>Style name<input maxLength={100} value={styleDraft} placeholder="e.g. Streetwear" onChange={event => setStyleDraft(event.target.value)} /></label>
              <button type="button" disabled={busy} onClick={saveStyle}>{editingStyle ? "Update style" : "Add style"}</button>
            </div>
            <small className="product-color-hint">Save the product to keep its selected style. Renaming an option here only changes this product.</small>
          </details>
        </div>
        <div className="form-row">
          <label>Original price (USD)<input name="price" type="number" required min="0" step="0.01" value={basePrice} onChange={event => setBasePrice(event.target.value)} /></label>
          <label>Stock<input name="stock" type="number" required min="0" step="1" defaultValue={modal.product?.stock || 0} /></label>
        </div>
        <label>Discount (%)<input type="number" min="0" max="100" step="0.01" value={discount} onChange={event => setDiscount(event.target.value)} /></label>
        <small>Use 0 for no discount. Selling price: <strong>{Number.isFinite(salePrice) ? `$${salePrice.toFixed(2)}` : "—"}</strong></small>
        {modal.product?.image && <img className="product-preview" src={modal.product.image} alt={modal.product.name} />}
        <label>{modal.product ? "Replace image (optional)" : "Product image"}<input name="image" type="file" accept="image/png,image/jpeg,image/webp" required={!modal.product} /></label>
        <small>JPEG, PNG, or WebP. Maximum 3 MB.</small>
        <label>Additional product images (optional)<input name="galleryImages" type="file" multiple accept="image/png,image/jpeg,image/webp" /></label>
        <small>Choose up to 8 images. Combined uploads must stay below 4 MB. Existing additional images are kept when editing.</small>
        {!!modal.product?.images?.length && <div className="product-gallery-preview">{modal.product.images.map((image, index) => <img key={`${image}-${index}`} src={image} alt={`Additional product view ${index + 1}`} />)}</div>}
        {error && <p role="alert" className="form-error">{error}</p>}
        <div className="product-form-actions">
          <button className="primary" type="submit" disabled={busy}><Check size={16} />{busy ? "Saving..." : modal.product ? "Save changes" : "Save product"}</button>
          <button type="button" disabled={busy} onClick={() => setModal(null)}>Cancel</button>
        </div>
      </form>
    </>
  );
}
