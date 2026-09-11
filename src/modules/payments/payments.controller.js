import { getPaymentsDataService, createPaymentService, initiateKhaltiPaymentService, verifyKhaltiPaymentService, getLatestInvoiceService } from "./payments.service.js";

export const getPaymentsDataController = async (req, res) => {
    try {
        const paymentsData = await getPaymentsDataService(req.user);
        return res.status(200).json(paymentsData);
    } catch (error) {
        console.error("Error fetching payments data:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createPaymentController = async (req, res) => {
    try {
        const payment = await createPaymentService(req.body);
        return res.status(201).json({ message: "Payment created successfully", payment });
    } catch (error) {
        console.error("Error creating payment:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const initiateKhaltiController = async (req, res) => {
    try {
        const result = await initiateKhaltiPaymentService(req.user, req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error initiating Khalti payment:", error);
        const statusCode = error.statusCode || 400;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const verifyKhaltiController = async (req, res) => {
    try {
        const result = await verifyKhaltiPaymentService(req.user, req.body);
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error verifying Khalti payment:", error);
        const statusCode = error.statusCode || 400;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};

export const downloadInvoiceController = async (req, res) => {
    try {
        const invoice = await getLatestInvoiceService(req.user, req.params.id || null);
        if (!invoice) {
            return res.status(404).json({ message: "No paid invoice found" });
        }

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Invoice ${invoice.invoice_id}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; color: #1a1a1a; background: #fff; padding: 40px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
    .logo-area h1 { font-size: 28px; font-weight: 900; color: #b91c1c; letter-spacing: 1px; }
    .logo-area p { color: #666; font-size: 13px; margin-top: 4px; }
    .invoice-meta { text-align: right; }
    .invoice-meta h2 { font-size: 22px; color: #b91c1c; font-weight: 900; text-transform: uppercase; }
    .invoice-meta p { color: #555; font-size: 13px; margin-top: 4px; }
    .divider { border: none; border-top: 2px solid #b91c1c; margin: 24px 0; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
    .info-box h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #888; margin-bottom: 8px; }
    .info-box p { font-size: 14px; color: #222; line-height: 1.6; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
    thead tr { background: #b91c1c; color: white; }
    thead th { padding: 12px 16px; text-align: left; font-size: 13px; font-weight: 700; }
    tbody tr { border-bottom: 1px solid #eee; }
    tbody td { padding: 12px 16px; font-size: 14px; }
    tbody tr:nth-child(even) { background: #fafafa; }
    .totals { text-align: right; margin-bottom: 40px; }
    .totals table { width: 280px; margin-left: auto; }
    .totals td { padding: 6px 12px; font-size: 14px; }
    .totals .total-row td { background: #b91c1c; color: white; font-weight: 700; font-size: 16px; }
    .footer { margin-top: 20px; text-align: center; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
    .status-badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; background: #dcfce7; color: #16a34a; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo-area">
      <h1>PHOENIX GYM</h1>
      <p>Urlabari, Morang, Nepal</p>
      <p>phoenixgymurlabari@email.com</p>
    </div>
    <div class="invoice-meta">
      <h2>Invoice</h2>
      <p><strong>${invoice.invoice_id}</strong></p>
      <p>Paid: ${invoice.payment_date}</p>
      <p>Due: ${invoice.due_date}</p>
      <span class="status-badge">PAID</span>
    </div>
  </div>
  <hr class="divider" />
  <div class="info-grid">
    <div class="info-box">
      <h3>Billed To</h3>
      <p><strong>${invoice.member_name}</strong></p>
      <p>Member ID: ${invoice.member_display_id}</p>
      <p>${invoice.email}</p>
      <p>${invoice.phone || ''}</p>
    </div>
    <div class="info-box">
      <h3>Payment Details</h3>
      <p>Method: ${invoice.method}</p>
      <p>Plan: ${invoice.plan_name}</p>
      <p>Billing Cycle: Monthly</p>
    </div>
  </div>
  <table>
    <thead>
      <tr><th>#</th><th>Description</th><th>Plan</th><th>Period</th><th>Amount</th></tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>Gym Membership Fee</td>
        <td>${invoice.plan_name}</td>
        <td>1 Month</td>
        <td>Rs. ${invoice.amount}</td>
      </tr>
    </tbody>
  </table>
  <div class="totals">
    <table>
      <tr><td>Subtotal</td><td>Rs. ${invoice.amount}</td></tr>
      <tr><td>Tax (0%)</td><td>Rs. 0</td></tr>
      <tr class="total-row"><td><strong>Total</strong></td><td><strong>Rs. ${invoice.amount}</strong></td></tr>
    </table>
  </div>
  <div class="footer">
    <p>Thank you for choosing Phoenix Gym! Stay fit, stay strong.</p>
    <p style="margin-top:8px;">System-generated invoice. No signature required.</p>
    <p style="margin-top:4px;">Generated: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
  </div>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>`;

        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(html);
    } catch (error) {
        console.error("Error generating invoice:", error);
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({ message: error.message || "Internal server error" });
    }
};
