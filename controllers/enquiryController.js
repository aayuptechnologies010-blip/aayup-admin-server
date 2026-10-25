const { transporter } = require('../config/transporter');
const { createEmailTemplate } = require('../email-template');

exports.sendEnquiryEmail = async (req, res) => {
  try {
    const { name, email, phone, company, service_type, project_description } = req.body;

    const adminContent = `
      <div style="max-width:640px;margin:0 auto;">
        <h1 style="margin:0 0 12px 0;color:#111827;font-size:22px;font-weight:700;">New Service Enquiry</h1>
        <p style="margin:0 0 18px 0;color:#6b7280;font-size:14px;">You have received a new service enquiry from the website.</p>

        <div style="background:#f0f9ff;padding:12px;border-radius:6px;margin-bottom:14px;border-left:3px solid #4f46e5;">
          <div style="color:#1e40af;font-weight:600;font-size:15px;">Service Interest: ${service_type}</div>
        </div>

        <table role="presentation" style="width:100%;background:#f9fafb;border-radius:6px;padding:14px;border:1px solid rgba(15,23,42,0.04);">
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;width:120px;">Name</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;">Email</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;"><a href="mailto:${email}" style="color:#4f46e5;text-decoration:none;">${email}</a></td>
          </tr>
          ${phone ? `
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;">Phone</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;"><a href="tel:${phone}" style="color:#4f46e5;text-decoration:none;">${phone}</a></td>
          </tr>` : ''}
          ${company ? `
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;">Company</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;">${company}</td>
          </tr>` : ''}
        </table>

        <div style="margin-top:18px;">
          <div style="font-size:13px;color:#6b7280;margin-bottom:6px;font-weight:600;text-transform:uppercase;">Project Description</div>
          <div style="background:white;border-left:3px solid #4f46e5;padding:12px;border-radius:6px;color:#0f172a;white-space:pre-wrap;">${project_description}</div>
        </div>

        <div style="margin-top:18px;color:#6b7280;font-size:13px;">
          Submitted: ${new Date().toLocaleString()}
        </div>
      </div>
    `;

    const userContent = `
      <div style="max-width:640px;margin:0 auto;text-align:left;">
        <h1 style="margin:0 0 8px 0;color:#111827;font-size:22px;font-weight:700;">Thank you, ${name}!</h1>
        <p style="margin:0 0 18px 0;color:#6b7280;font-size:14px;">We have received your enquiry about <strong>${service_type}</strong> and will respond within 24–48 hours.</p>

        <div style="background:#f8fafc;padding:14px;border-radius:6px;border:1px solid rgba(15,23,42,0.04);margin-bottom:16px;">
          <div style="font-size:13px;color:#6b7280;font-weight:600;margin-bottom:8px;">Your Enquiry Details</div>
          <div style="color:#0f172a;margin-bottom:8px;"><strong>Service:</strong> ${service_type}</div>
          <div style="color:#0f172a;white-space:pre-wrap;">${project_description}</div>
        </div>

        <p style="margin:0 0 16px 0;color:#6b7280;font-size:14px;">Our team will review your requirements and provide detailed information soon.</p>
      </div>
    `;

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'Aayup.technologies.010@gmail.com',
      subject: `🔔 New Enquiry - ${service_type} - ${name}`,
      html: createEmailTemplate(adminContent),
    };

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Your Enquiry - Aayup Technologies',
      html: createEmailTemplate(userContent),
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Enquiry email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send emails' });
  }
};
