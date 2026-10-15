import React from "react";
export default function DeleteProductDialog({
  modal,
  setModal,
  setProducts,
  notify,
}) {
  return (
    <>
      <h2 id="modal-title">Delete product?</h2>
      <p>Remove {modal.product.name} from this demo catalog?</p>
      <div className="heading-actions">
        <button onClick={() => setModal(null)}>Cancel</button>
        <button
          className="danger"
          onClick={() => {
            setProducts((p) => p.filter((x) => x.id !== modal.product.id));
            setModal(null);
            notify("Product removed");
          }}
        >
          Delete product
        </button>
      </div>
    </>
  );
}
