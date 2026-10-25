const { transporter } = require('../config/transporter');
const { createEmailTemplate } = require('../email-template');

exports.sendJobApplicationEmail = async (req, res) => {
  try {
    const applicationData = JSON.parse(req.body.data || '{}');
    const { fullName, email, phone, currentRole, experience, jobTitle, expectedSalary } = applicationData;
    const resumeFile = req.file;

    const adminContent = `
      <div style="max-width:640px;margin:0 auto;">
        <h1 style="margin:0 0 12px 0;color:#111827;font-size:22px;font-weight:700;">New Job Application</h1>
        <p style="margin:0 0 18px 0;color:#6b7280;font-size:14px;">A candidate has applied for <strong>${jobTitle || 'Career Opening'}</strong>.</p>

        <table role="presentation" style="width:100%;background:#f9fafb;border-radius:6px;padding:14px;border:1px solid rgba(15,23,42,0.04);margin-bottom:14px;">
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;width:140px;">Candidate Name</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;">${fullName}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;">Email</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;">${email}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;">Phone</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;">${phone}</td>
          </tr>
          <tr>
            <td style="padding:8px 0;font-size:13px;color:#6b7280;">Role / Experience</td>
            <td style="padding:8px 0;color:#0f172a;font-weight:600;">${currentRole || 'N/A'} (${experience || 'Fresher'})</td>
          </tr>
        </table>
        ${resumeFile ? `<p style="color:#059669;font-weight:600;">📎 Resume attached (${resumeFile.originalname})</p>` : ''}
      </div>
    `;

    const userContent = `
      <div style="max-width:640px;margin:0 auto;text-align:left;">
        <h1 style="margin:0 0 8px 0;color:#111827;font-size:22px;font-weight:700;">Application Received!</h1>
        <p style="margin:0 0 18px 0;color:#6b7280;font-size:14px;">Hi ${fullName}, thank you for applying for the position of <strong>${jobTitle}</strong> at Aayup Technologies!</p>
        <p style="margin:0 0 16px 0;color:#6b7280;font-size:14px;">Our recruitment team will review your profile and reach out if your skills match our requirements.</p>
      </div>
    `;

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'Aayup.technologies.010@gmail.com',
      subject: `💼 New Job Application - ${jobTitle} - ${fullName}`,
      html: createEmailTemplate(adminContent),
      attachments: resumeFile
        ? [
            {
              filename: resumeFile.originalname,
              content: resumeFile.buffer,
            },
          ]
        : [],
    };

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `✅ Application Received: ${jobTitle} - Aayup Technologies`,
      html: createEmailTemplate(userContent),
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({ success: true, message: 'Application submitted and emails sent successfully' });
  } catch (error) {
    console.error('Job application error:', error);
    res.status(500).json({ success: false, message: 'Failed to process job application' });
  }
};
