const { transporter } = require('../config/transporter');
const { createEmailTemplate } = require('../email-template');

exports.sendStudentApplicationEmail = async (req, res) => {
  try {
    const { full_name, email, phone, college_university, degree, year_of_study, program_type } = req.body;

    const adminContent = `
      <div style="max-width:640px;margin:0 auto;">
        <h1 style="margin:0 0 12px 0;color:#111827;font-size:22px;font-weight:700;">New Student Application</h1>
        <p style="margin:0 0 18px 0;color:#6b7280;font-size:14px;">A student has applied for the ${program_type} program.</p>

        <div style="background:#f0fdf4;padding:12px;border-radius:6px;margin-bottom:14px;border-left:3px solid #10b981;">
          <div style="color:#065f46;font-weight:600;font-size:15px;">Program: ${program_type}</div>
        </div>

        <table role="presentation" style="width:100%;background:#f9fafb;border-radius:6px;padding:14px;border:1px solid rgba(15,23,42,0.04);margin-bottom:14px;">
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;width:140px;">Name</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;">${full_name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;">Email</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;"><a href="mailto:${email}" style="color:#4f46e5;text-decoration:none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;">Phone</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;"><a href="tel:${phone}" style="color:#4f46e5;text-decoration:none;">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;">College/University</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;">${college_university}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;">Degree/Course</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;">${degree} (${year_of_study})</td>
          </tr>
        </table>
      </div>
    `;

    const userContent = `
      <div style="max-width:640px;margin:0 auto;text-align:left;">
        <h1 style="margin:0 0 8px 0;color:#111827;font-size:22px;font-weight:700;">Application Received!</h1>
        <p style="margin:0 0 18px 0;color:#6b7280;font-size:14px;">Hi ${full_name}, thank you for applying to our <strong>${program_type}</strong> program!</p>
        <p style="margin:0 0 16px 0;color:#6b7280;font-size:14px;">Our training team will review your application within 24-48 hours.</p>
      </div>
    `;

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'Aayup.technologies.010@gmail.com',
      subject: `🎓 New Student Enquiry - ${program_type} - ${full_name}`,
      html: createEmailTemplate(adminContent),
    };

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `✅ Your Enquiry Received - ${program_type} - Aayup Technologies`,
      html: createEmailTemplate(userContent),
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Student application error:', error);
    res.status(500).json({ success: false, message: 'Failed to send emails' });
  }
};
