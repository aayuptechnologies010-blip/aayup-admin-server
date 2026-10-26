// email-template.js
const createEmailTemplate = (contentHtml, opts = {}) => {
  const {
    brandName = 'Aayup Technologies',
    accent = '#4f46e5', // professional indigo
    bg = '#f3f4f6',     // subtle page background
    cardBg = '#ffffff',
    textColor = '#0f172a',
    mutedColor = '#6b7280',
    isDarkMode = false
  } = opts;

  // If dark mode requested, swap values (kept conservative for email clients)
  const pageBg = isDarkMode ? '#0b1220' : bg;
  const containerBg = isDarkMode ? '#0f1724' : cardBg;
  const mainText = isDarkMode ? '#e6eef8' : textColor;
  const subText = isDarkMode ? '#98a7bf' : mutedColor;

  // Inline CSS used for best compatibility with many email clients.
  return `
  <!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <meta name="color-scheme" content="${isDarkMode ? 'dark' : 'light'}">
    <title>${brandName}</title>
  </head>
  <body style="margin:0;padding:0;background:${pageBg};font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="min-width:320px;">
      <tr>
        <td align="center" style="padding:30px 10px;">
          <!-- Card -->
          <table role="presentation" width="720" style="max-width:720px;width:100%;background:${containerBg};box-shadow:0 8px 30px rgba(16,24,40,0.08);overflow:hidden;">
            <!-- Header -->
            <tr>
              <td style="padding:20px 20px 0 20px;text-align:left;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:0;">
                      <table role="presentation" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                        <tr>
                          <td style="padding-right:12px;vertical-align:middle;">
                            <img src="https://www.aayuptechnologies.com/logo.webp" alt="${brandName}" width="45" height="45" style="display:block;border-radius:50%;border:0;" />
                          </td>
                          <td style="vertical-align:middle;">
                            <div style="line-height:1;">
                              <div style="color:${mainText};font-size:18px;font-weight:700;">${brandName}</div>
                              <div style="color:${subText};font-size:13px;">Innovating Tomorrow</div>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:28px 28px 20px 28px;color:${mainText};">
                ${contentHtml}
              </td>
            </tr>

            <!-- Visit Website Button (Above Footer) -->
            <tr>
              <td style="text-align:center;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding:5px 0;">
                      <a href="https://www.aayuptechnologies.com/" style="display:inline-block;background:linear-gradient(135deg, rgba(0, 255, 225, 0.24) 0%, rgba(30, 0, 255, 0.34) 100%);border:1px solid #e50082;border-radius:50px;padding:12px 28px;text-decoration:none;font-weight:600;font-size:15px;color:${mainText};transition:all 0.3s ease;">
                        Visit Website →
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:18px 28px 28px 28px;background:transparent;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="border-top:1px solid rgba(15,23,42,0.04);padding-top:14px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding-bottom:10px;">
                            <div style="color:${subText};font-size:13px;line-height:1.4;">
                              <strong>${brandName} Pvt. Ltd.</strong> &nbsp;•&nbsp; Bangalore, Karnataka, India
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td style="padding-bottom:10px;">
                            <div style="color:${subText};font-size:13px;">
                              Email: <a href="mailto:aayup.technologies.010@gmail.com" style="color:${accent};text-decoration:none;">aayup.technologies.010@gmail.com</a> &nbsp; • &nbsp;
                              Phone: <a href="tel:+917030839883" style="color:${accent};text-decoration:none;">+91 70308 39883</a>
                            </div>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <div style="color:${subText};font-size:12px;">© ${new Date().getFullYear()} ${brandName}. All rights reserved.</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};

module.exports = { createEmailTemplate };
