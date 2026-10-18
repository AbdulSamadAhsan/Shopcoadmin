import React from "react";
import { X } from "lucide-react";
import OrderDetails from "./OrderDetails";
import CustomerDetails from "./CustomerDetails";
import ProductForm from "./ProductForm";
import DeleteProductDialog from "./DeleteProductDialog";
import HelpDialog from "./HelpDialog";
import ProductReviews from "./ProductReviews";
export default function DashboardDialog({
  products,
  modal,
  setModal,
  saveProduct,
  deleteProduct,
  updateStatus,
  notify,
}) {
  if (!modal) return null;
  const dialogs = {
    order: OrderDetails,
    customer: CustomerDetails,
    product: ProductForm,
    reviews: ProductReviews,
    delete: DeleteProductDialog,
    help: HelpDialog,
  };
  const Content = dialogs[modal.type];
  return (
    <div className="modal-backdrop" onClick={() => setModal(null)}>
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Escape") setModal(null);
        }}
      >
        <button
          autoFocus
          className="icon-button modal-close"
          aria-label="Close dialog"
          onClick={() => setModal(null)}
        >
          <X size={20} />
        </button>
        <Content
          products={products}
          key={`${modal.type}-${modal.product?.id || modal.order?.id || "new"}`}
          modal={modal}
          setModal={setModal}
          saveProduct={saveProduct}
          deleteProduct={deleteProduct}
          updateStatus={updateStatus}
          notify={notify}
        />
      </section>
    </div>
  );
}
