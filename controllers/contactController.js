const { transporter } = require('../config/transporter');
const { createEmailTemplate } = require('../email-template');

exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email and message are required' });
    }

    const adminContent = `
      <div style="text-align: center; margin-bottom: 25px;">
        <h2 style="color: #1e293b; margin: 0; font-size: 24px; font-weight: 700;">New Contact Form Message</h2>
        <p style="color: #64748b; margin: 8px 0 0 0; font-size: 14px;">A new inquiry has been submitted through the website</p>
      </div>

      <div style="background: #f8fafc; padding: 25px; margin-bottom: 20px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Name</td>
            <td style="padding: 10px 0; color: #1e293b; font-size: 15px; font-weight: 600;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Email</td>
            <td style="padding: 10px 0; color: #6366f1; font-size: 15px; font-weight: 600;"><a href="mailto:${email}" style="color: #6366f1; text-decoration: none;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; color: #64748b; font-size: 13px; font-weight: 600; text-transform: uppercase;">Phone</td>
            <td style="padding: 10px 0; color: #1e293b; font-size: 15px;">${phone || 'Not provided'}</td>
          </tr>
        </table>

        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <div style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Message Content</div>
          <div style="background: white; padding: 18px; color: #475569; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${message}</div>
        </div>
      </div>
    `;

    const userContent = `
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #1e293b; margin: 0; font-size: 26px; font-weight: 700;">Thank You!</h2>
        <p style="color: #64748b; margin: 10px 0 0 0; font-size: 14px;">We've received your message</p>
      </div>

      <div style="text-align: center; padding: 20px; background: #f0fdf4; margin: 20px 0; border: 2px solid #86efac;">
        <p style="color: #166534; margin: 0; font-size: 16px; font-weight: 600; line-height: 1.6;">
          Hi ${name} <br/>
          <span style="font-weight: 400; font-size: 14px;">We appreciate you contacting us!</span>
        </p>
      </div>

      <div style="background: #f8fafc; padding: 20px; margin: 20px 0;">
        <div style="color: #64748b; font-size: 11px; font-weight: 600; text-transform: uppercase; margin-bottom: 12px;">Your Message</div>
        <div style="background: white; padding: 13px; color: #475569; line-height: 1.6; font-size: 14px; white-space: pre-wrap;">${message}</div>
      </div>
    `;

    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'Aayup.technologies.010@gmail.com',
      subject: `🔔 New Contact - ${name}`,
      html: createEmailTemplate(adminContent),
    };

    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '✅ Thank you - Aayup Technologies',
      html: createEmailTemplate(userContent),
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Contact email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send emails' });
  }
};
