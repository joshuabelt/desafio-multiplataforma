"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
  clearCart,
  MAX_ITEMS,
} from "../redux/features/cart/cartSlice";
import { useToast } from "./ToastContext";
import styles from "../styles/CartModal.module.css";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CheckoutView = "cart" | "success";

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const dispatch = useAppDispatch();
  const cart = useAppSelector((state) => state.cart.items);
  const auth = useAppSelector((state) => state.auth);
  const { addToast } = useToast();
  const [checkoutView, setCheckoutView] = useState<CheckoutView>("cart");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceText, setInvoiceText] = useState("");
  const [invoiceTotalItems, setInvoiceTotalItems] = useState(0);
  const [invoiceCartTotal, setInvoiceCartTotal] = useState(0);

  const totalItems = cart.reduce<number>((sum: number, item: { quantity: number }) => sum + item.quantity, 0);
  const cartTotal = cart.reduce<number>((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (!isOpen) {
      setCheckoutView("cart");
      setInvoiceNumber("");
      setInvoiceText("");
      setInvoiceTotalItems(0);
      setInvoiceCartTotal(0);
    }
  }, [isOpen]);

  const handleIncreaseQuantity = (productId: number) => {
    if (totalItems >= MAX_ITEMS) {
      addToast(`Máximo ${MAX_ITEMS} productos en el carrito`, "error");
      return;
    }

    dispatch(increaseQuantity(productId));
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      addToast("Tu carrito está vacío", "error");
      return;
    }

    const generatedInvoiceNumber = `INV-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, "")}-${Date.now().toString().slice(-4)}`;
    const orderDate = new Date().toLocaleString("es-ES");
    const customerName = auth.user?.name || "Cliente registrado";
    const customerEmail = auth.user?.email || "contacto@tienda.com";
    const invoiceSummaryItems = totalItems;
    const invoiceSummaryTotal = cartTotal;
    const generatedInvoice = [
      "FACTURA DE COMPRA",
      "=================",
      `Número: ${generatedInvoiceNumber}`,
      `Fecha: ${orderDate}`,
      `Cliente: ${customerName}`,
      `Correo: ${customerEmail}`,
      "",
      "Productos:",
      ...cart.map(
        (item: { title: string; quantity: number; price: number }) =>
          `- ${item.title} x${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
      ),
      "",
      `Total de artículos: ${totalItems}`,
      `Total: $${cartTotal.toFixed(2)}`,
    ].join("\n");

    const invoicePayload = {
      invoiceNumber: generatedInvoiceNumber,
      orderDate,
      customerName,
      customerEmail,
      items: cart.map((item: { title: string; quantity: number; price: number }) => ({
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      })),
      totalItems: invoiceSummaryItems,
      cartTotal: invoiceSummaryTotal,
    };

    setInvoiceNumber(generatedInvoiceNumber);
    setInvoiceText(generatedInvoice);
    setInvoiceTotalItems(invoiceSummaryItems);
    setInvoiceCartTotal(invoiceSummaryTotal);
    setCheckoutView("success");
    dispatch(clearCart());

    try {
      const response = await fetch("/api/send-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(invoicePayload),
      });

      const result = await response.json();

      if (result.success) {
        addToast("Compra realizada con éxito. Tu factura ha sido enviada al correo.", "success");
      } else {
        addToast("Compra realizada con éxito. La factura fue generada, pero no pudo enviarse por correo.", "error");
      }
    } catch {
      addToast("Compra realizada con éxito. La factura fue generada, pero no pudo enviarse por correo.", "error");
    }
  };

  const handleDownloadInvoice = () => {
    if (!invoiceText) return;

    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(18);
    pdf.text("FACTURA DE COMPRA", 14, 20);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);
    pdf.text(`Número: ${invoiceNumber}`, 14, 35);
    pdf.text(`Fecha: ${new Date().toLocaleString("es-ES")}`, 14, 42);
    pdf.text(`Cliente: ${auth.user?.name || "Cliente registrado"}`, 14, 49);
    pdf.text(`Correo: ${auth.user?.email || "contacto@tienda.com"}`, 14, 56);

    pdf.setFontSize(12);
    pdf.text("Productos:", 14, 71);

    const lines = invoiceText.split("\n").slice(7);
    let yPosition = 78;

    lines.forEach((line) => {
      const wrappedLines = pdf.splitTextToSize(line, pageWidth - 28);
      wrappedLines.forEach((wrappedLine: string) => {
        pdf.text(wrappedLine, 18, yPosition);
        yPosition += 7;
      });
    });

    pdf.text(`Total de artículos: ${invoiceTotalItems}`, 14, yPosition + 8);
    pdf.text(`Total: $${invoiceCartTotal.toFixed(2)}`, 14, yPosition + 16);

    pdf.save(`${invoiceNumber || "factura"}.pdf`);
  };

  const handleClose = () => {
    setCheckoutView("cart");
    setInvoiceNumber("");
    setInvoiceText("");
    setInvoiceTotalItems(0);
    setInvoiceCartTotal(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className={styles.overlay} onClick={handleClose} />

      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>🛒 Mi Carrito</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className={styles.content}>
          {checkoutView === "success" ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✓</div>
              <h3 className={styles.successTitle}>¡Compra realizada!</h3>
              <p className={styles.successText}>
                Tu pedido fue procesado correctamente.
              </p>

              <div className={styles.invoiceBox}>
                <p className={styles.invoiceTitle}>Factura generada</p>
                <p className={styles.invoiceNumber}>{invoiceNumber}</p>
                <pre className={styles.invoiceText}>{invoiceText}</pre>
              </div>

              <button className={styles.downloadButton} onClick={handleDownloadInvoice}>
                Descargar factura PDF
              </button>
              <button className={styles.secondaryButton} onClick={handleClose}>
                Cerrar
              </button>
            </div>
          ) : cart.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Tu carrito está vacío</p>
              <p className={styles.emptySubtext}>Agrega productos para comenzar</p>
            </div>
          ) : (
            <>
              <div className={styles.cartList}>
                {cart.map((item: { id: number; title: string; price: number; quantity: number }) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemInfo}>
                      <h4 className={styles.itemTitle}>{item.title}</h4>
                      <p className={styles.itemPrice}>${item.price.toFixed(2)}</p>
                    </div>

                    <div className={styles.quantityGroup}>
                      <button
                        className={styles.quantityButton}
                        onClick={() => dispatch(decreaseQuantity(item.id))}
                      >
                        −
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        className={styles.quantityButton}
                        onClick={() => handleIncreaseQuantity(item.id)}
                      >
                        +
                      </button>
                    </div>

                    <p className={styles.subtotal}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>

                    <button
                      className={styles.removeButton}
                      onClick={() => dispatch(removeFromCart(item.id))}
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div className={styles.summary}>
                <div className={styles.summaryRow}>
                  <span>Artículos:</span>
                  <span>{totalItems}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Total:</span>
                  <span className={styles.totalPrice}>${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.clearButton}
                  onClick={() => dispatch(clearCart())}
                >
                  Vaciar carrito
                </button>
                <button className={styles.checkoutButton} onClick={handleCheckout}>
                  Proceder al pago
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
