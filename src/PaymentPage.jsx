import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Initialize Stripe with publishable key from env
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder");

const COLORS = {
  teal: "#1B6E8A",
  tealDark: "#134E63",
  tealDeep: "#0C2F3D",
  green: "#00D455",
  greenBright: "#00E85E",
  white: "#FFFFFF",
  offWhite: "#F4F8F9",
  lightTeal: "rgba(27, 110, 138, 0.06)",
  grayText: "#5A6B73",
  grayLight: "#8A9BA3",
  dark: "#091E27",
};

const FONTS = {
  heading: "'Playfair Display', Georgia, serif",
  body: "'DM Sans', 'Helvetica Neue', sans-serif",
};

function SectionLabel({ text }) {
  return (
    <div
      style={{
        fontFamily: FONTS.body,
        fontSize: 12,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: COLORS.green,
        marginBottom: 14,
        fontWeight: 600,
      }}
    >
      {text}
    </div>
  );
}

function formatCurrency(cents, currency = "usd") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(cents / 100);
}

// Card form component (inside Stripe Elements provider)
function CardForm({ invoice, onSuccess, onBack }) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [loadingIntent, setLoadingIntent] = useState(true);

  useEffect(() => {
    // Create payment intent when component mounts
    async function createIntent() {
      try {
        const res = await fetch("/api/pay-invoice", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ invoiceId: invoice.invoiceId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingIntent(false);
      }
    }
    createIntent();
  }, [invoice.invoiceId]);

  const handleSubmit = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true);
    setError(null);

    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      setProcessing(false);
    } else if (paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent);
    }
  };

  const cardStyle = {
    style: {
      base: {
        fontSize: "16px",
        fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif",
        color: COLORS.tealDeep,
        "::placeholder": { color: COLORS.grayLight },
      },
      invalid: { color: "#e53e3e" },
    },
  };

  if (loadingIntent) {
    return (
      <div style={{ textAlign: "center", padding: 40 }}>
        <div
          style={{
            width: 32,
            height: 32,
            border: `3px solid ${COLORS.lightTeal}`,
            borderTop: `3px solid ${COLORS.teal}`,
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px",
          }}
        />
        <p style={{ fontFamily: FONTS.body, fontSize: 14, color: COLORS.grayText }}>
          Setting up secure payment...
        </p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div>
      {/* Invoice summary */}
      <div
        style={{
          background: COLORS.offWhite,
          padding: 24,
          borderRadius: 3,
          marginBottom: 28,
          border: `1px solid rgba(27, 110, 138, 0.08)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginBottom: 16,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: FONTS.body,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: COLORS.grayLight,
                marginBottom: 4,
              }}
            >
              Invoice #{invoice.number}
            </div>
            {invoice.customerName && (
              <div
                style={{
                  fontFamily: FONTS.body,
                  fontSize: 15,
                  color: COLORS.tealDeep,
                  fontWeight: 500,
                }}
              >
                {invoice.customerName}
              </div>
            )}
          </div>
          <div
            style={{
              fontFamily: FONTS.heading,
              fontSize: 28,
              fontWeight: 700,
              color: COLORS.tealDeep,
            }}
          >
            {formatCurrency(invoice.amountDue, invoice.currency)}
          </div>
        </div>

        {invoice.lineItems && invoice.lineItems.length > 0 && (
          <div
            style={{
              borderTop: `1px solid rgba(27, 110, 138, 0.08)`,
              paddingTop: 12,
            }}
          >
            {invoice.lineItems.map((item, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontFamily: FONTS.body,
                  fontSize: 13,
                  color: COLORS.grayText,
                  marginBottom: 6,
                }}
              >
                <span>{item.description}</span>
                <span style={{ fontWeight: 500 }}>{formatCurrency(item.amount, invoice.currency)}</span>
              </div>
            ))}
          </div>
        )}

        {invoice.dueDate && (
          <div
            style={{
              fontFamily: FONTS.body,
              fontSize: 12,
              color: COLORS.grayLight,
              marginTop: 8,
            }}
          >
            Due: {invoice.dueDate}
          </div>
        )}
      </div>

      {/* Card input */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            fontFamily: FONTS.body,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: COLORS.teal,
            marginBottom: 8,
            display: "block",
          }}
        >
          Card Details
        </label>
        <div
          style={{
            padding: "14px 16px",
            border: `1px solid rgba(27, 110, 138, 0.15)`,
            borderRadius: 2,
            background: COLORS.white,
          }}
        >
          <CardElement options={cardStyle} />
        </div>
      </div>

      {error && (
        <div
          style={{
            fontFamily: FONTS.body,
            fontSize: 14,
            color: "#e53e3e",
            background: "#fff5f5",
            padding: "12px 16px",
            borderRadius: 3,
            marginBottom: 16,
            border: "1px solid #fed7d7",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={onBack}
          style={{
            fontFamily: FONTS.body,
            fontSize: 14,
            fontWeight: 500,
            padding: "14px 24px",
            background: "transparent",
            color: COLORS.grayText,
            border: `1px solid rgba(27, 110, 138, 0.15)`,
            borderRadius: 2,
            cursor: "pointer",
          }}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!stripe || processing}
          style={{
            fontFamily: FONTS.body,
            fontSize: 15,
            fontWeight: 600,
            padding: "14px 0",
            background: processing ? COLORS.grayLight : COLORS.green,
            color: COLORS.dark,
            border: "none",
            borderRadius: 2,
            cursor: processing ? "not-allowed" : "pointer",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            flex: 1,
            transition: "all 0.2s ease",
          }}
        >
          {processing ? "Processing..." : `Pay ${formatCurrency(invoice.amountDue, invoice.currency)}`}
        </button>
      </div>

      <div
        style={{
          fontFamily: FONTS.body,
          fontSize: 11,
          color: COLORS.grayLight,
          textAlign: "center",
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.grayLight} strokeWidth="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
        Secured by Stripe. QC Atlantic never sees your card details.
      </div>
    </div>
  );
}

// Main Payment Page
export default function PaymentPage() {
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState("lookup"); // lookup, pay, success
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100);
  }, []);

  const handleLookup = async () => {
    if (!invoiceNumber.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/lookup-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceNumber: invoiceNumber.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setInvoice(data);
      setStep("pay");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLookup();
  };

  const inputStyle = {
    fontFamily: FONTS.body,
    fontSize: 18,
    padding: "16px 20px",
    border: `1px solid rgba(27, 110, 138, 0.15)`,
    borderRadius: 2,
    background: COLORS.white,
    color: COLORS.tealDeep,
    width: "100%",
    boxSizing: "border-box",
    outline: "none",
    transition: "border-color 0.2s ease",
    letterSpacing: "0.05em",
    textAlign: "center",
    textTransform: "uppercase",
  };

  return (
    <div>
      {/* Header */}
      <section
        style={{
          background: `linear-gradient(160deg, ${COLORS.dark} 0%, ${COLORS.tealDeep} 100%)`,
          padding: "160px 32px 80px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            maxWidth: 700,
            margin: "0 auto",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.6s ease",
          }}
        >
          <SectionLabel text="Payment Portal" />
          <h1
            style={{
              fontFamily: FONTS.heading,
              fontSize: "clamp(32px, 5vw, 52px)",
              color: COLORS.white,
              margin: "0 0 16px 0",
              fontWeight: 700,
            }}
          >
            Pay Your Invoice
          </h1>
          <p
            style={{
              fontFamily: FONTS.body,
              fontSize: 17,
              color: "rgba(255,255,255,0.55)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Enter your invoice number below to pull up your balance and pay securely online.
          </p>
        </div>
      </section>

      {/* Payment Area */}
      <section style={{ background: COLORS.offWhite }}>
        <div
          style={{
            maxWidth: 520,
            margin: "0 auto",
            padding: "80px 32px",
          }}
        >
          <div
            style={{
              background: COLORS.white,
              padding: 40,
              border: `1px solid rgba(27, 110, 138, 0.08)`,
              borderRadius: 3,
              boxShadow: "0 4px 24px rgba(27, 110, 138, 0.04)",
            }}
          >
            {step === "lookup" && (
              <div>
                <h3
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: 22,
                    fontWeight: 700,
                    color: COLORS.tealDeep,
                    margin: "0 0 8px 0",
                    textAlign: "center",
                  }}
                >
                  Invoice Lookup
                </h3>
                <p
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 14,
                    color: COLORS.grayLight,
                    textAlign: "center",
                    margin: "0 0 28px 0",
                  }}
                >
                  Find your invoice number on the document from QC Atlantic.
                </p>

                <div style={{ marginBottom: 16 }}>
                  <input
                    style={inputStyle}
                    value={invoiceNumber}
                    onChange={(e) => setInvoiceNumber(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="e.g. QCA-0001"
                    onFocus={(e) => (e.target.style.borderColor = COLORS.teal)}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(27, 110, 138, 0.15)")}
                    autoFocus
                  />
                </div>

                {error && (
                  <div
                    style={{
                      fontFamily: FONTS.body,
                      fontSize: 14,
                      color: "#e53e3e",
                      background: "#fff5f5",
                      padding: "12px 16px",
                      borderRadius: 3,
                      marginBottom: 16,
                      border: "1px solid #fed7d7",
                      textAlign: "center",
                    }}
                  >
                    {error}
                  </div>
                )}

                <button
                  onClick={handleLookup}
                  disabled={!invoiceNumber.trim() || loading}
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 15,
                    fontWeight: 600,
                    padding: "16px 0",
                    background: !invoiceNumber.trim() || loading ? COLORS.grayLight : COLORS.green,
                    color: COLORS.dark,
                    border: "none",
                    borderRadius: 2,
                    cursor: !invoiceNumber.trim() || loading ? "not-allowed" : "pointer",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    width: "100%",
                    transition: "all 0.2s ease",
                  }}
                >
                  {loading ? "Looking up..." : "Find Invoice"}
                </button>
              </div>
            )}

            {step === "pay" && invoice && (
              <Elements stripe={stripePromise}>
                <CardForm
                  invoice={invoice}
                  onBack={() => {
                    setStep("lookup");
                    setInvoice(null);
                    setError(null);
                  }}
                  onSuccess={() => setStep("success")}
                />
              </Elements>
            )}

            {step === "success" && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: `${COLORS.green}15`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 20px",
                  }}
                >
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={COLORS.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3
                  style={{
                    fontFamily: FONTS.heading,
                    fontSize: 26,
                    fontWeight: 700,
                    color: COLORS.tealDeep,
                    margin: "0 0 8px 0",
                  }}
                >
                  Payment Received
                </h3>
                <p
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 15,
                    color: COLORS.grayText,
                    margin: "0 0 8px 0",
                  }}
                >
                  Invoice #{invoice?.number} has been paid.
                </p>
                <p
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 13,
                    color: COLORS.grayLight,
                    margin: "0 0 28px 0",
                  }}
                >
                  A receipt has been sent to your email.
                </p>
                <button
                  onClick={() => {
                    setStep("lookup");
                    setInvoice(null);
                    setInvoiceNumber("");
                    setError(null);
                  }}
                  style={{
                    fontFamily: FONTS.body,
                    fontSize: 14,
                    fontWeight: 500,
                    padding: "12px 28px",
                    background: "transparent",
                    color: COLORS.teal,
                    border: `1px solid rgba(27, 110, 138, 0.2)`,
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                >
                  Pay Another Invoice
                </button>
              </div>
            )}
          </div>

          {/* Help text */}
          <div
            style={{
              textAlign: "center",
              marginTop: 28,
              fontFamily: FONTS.body,
              fontSize: 13,
              color: COLORS.grayLight,
              lineHeight: 1.6,
            }}
          >
            Questions about your invoice? Contact Winston at{" "}
            <a href="tel:3369098321" style={{ color: COLORS.teal, textDecoration: "none" }}>
              (336) 909-8321
            </a>{" "}
            or{" "}
            <a href="mailto:wmatney@qcatlantic.com" style={{ color: COLORS.teal, textDecoration: "none" }}>
              wmatney@qcatlantic.com
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export { COLORS, FONTS, SectionLabel };
