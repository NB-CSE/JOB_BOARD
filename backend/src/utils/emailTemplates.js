/**
 * Email templates for Elevate Careers Job Board
 */

const baseWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #F7F7F2; margin: 0; padding: 24px; color: #242424; }
    .container { max-width: 580px; margin: 0 auto; background: #FFFFFF; border-radius: 12px; border: 1px solid #E4E4E7; overflow: hidden; }
    .header { background: #242424; color: #FFFFFF; padding: 24px 32px; display: flex; align-items: center; justify-content: space-between; }
    .logo-badge { background: #C5F36A; color: #242424; font-weight: 800; font-size: 13px; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.5px; text-transform: uppercase; }
    .content { padding: 32px; line-height: 1.6; }
    .highlight-box { background: #F7F7F2; border-left: 4px solid #C5F36A; padding: 16px; border-radius: 6px; margin: 20px 0; }
    .footer { padding: 20px 32px; background: #FAFAFA; border-top: 1px solid #EEEEEE; font-size: 12px; color: #71717A; text-align: center; }
    .btn { display: inline-block; background: #242424; color: #FFFFFF !important; font-weight: 600; text-decoration: none; padding: 12px 24px; border-radius: 8px; margin-top: 16px; }
    .btn-lime { background: #C5F36A; color: #242424 !important; font-weight: 700; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div style="font-size: 20px; font-weight: 800; letter-spacing: -0.5px;">ELEVATE CAREERS</div>
      <span class="logo-badge">Job Notification</span>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      This is an automated notification from Elevate Careers Job Platform.<br>
      © ${new Date().getFullYear()} Elevate Careers. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const applicationReceivedCandidate = ({ candidateName, jobTitle, companyName }) => {
  return {
    subject: `Application Submitted: ${jobTitle} at ${companyName}`,
    text: `Hi ${candidateName}, your application for ${jobTitle} at ${companyName} has been successfully submitted! We will notify you when the employer updates your status.`,
    html: baseWrapper(`
      <h2 style="margin-top: 0; color: #242424;">Application Received! 🎉</h2>
      <p>Hi <strong>${candidateName}</strong>,</p>
      <p>Great news! Your application has been successfully submitted to <strong>${companyName}</strong>.</p>
      
      <div class="highlight-box">
        <p style="margin: 0; font-size: 14px; color: #52525B;">Role Applied For:</p>
        <p style="margin: 4px 0 0 0; font-size: 18px; font-weight: 700; color: #18181B;">${jobTitle}</p>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #242424;">Company: <strong>${companyName}</strong></p>
      </div>

      <p>The hiring team at ${companyName} has received your profile and resume. You can track your application status directly in your candidate dashboard.</p>
      
      <p style="margin-top: 24px;">Best regards,<br>The Elevate Careers Team</p>
    `),
  };
};

const newApplicationEmployer = ({ employerName, candidateName, jobTitle, candidateEmail }) => {
  return {
    subject: `New Application for ${jobTitle}: ${candidateName}`,
    text: `Hi ${employerName}, you have received a new application for ${jobTitle} from ${candidateName} (${candidateEmail}). Review it in your employer dashboard.`,
    html: baseWrapper(`
      <h2 style="margin-top: 0; color: #242424;">New Candidate Application 🚀</h2>
      <p>Hi <strong>${employerName}</strong>,</p>
      <p>A new candidate has just applied for your open position on Elevate Careers.</p>

      <div class="highlight-box">
        <p style="margin: 0; font-size: 13px; color: #52525B;">Job Position:</p>
        <p style="margin: 2px 0 10px 0; font-size: 18px; font-weight: 700; color: #18181B;">${jobTitle}</p>
        <p style="margin: 0; font-size: 13px; color: #52525B;">Applicant Name:</p>
        <p style="margin: 2px 0 6px 0; font-size: 15px; font-weight: 600; color: #242424;">${candidateName}</p>
        <p style="margin: 0; font-size: 13px; color: #52525B;">Applicant Email:</p>
        <p style="margin: 2px 0 0 0; font-size: 14px; color: #242424;">${candidateEmail}</p>
      </div>

      <p>Log in to your Employer Dashboard to review the candidate's resume, qualifications, and update their review status.</p>
      
      <p style="margin-top: 24px;">Elevate Careers Hiring Platform</p>
    `),
  };
};

const applicationStatusChanged = ({ candidateName, jobTitle, companyName, newStatus, notes }) => {
  const statusColors = {
    'Under Review': '#3B82F6',
    'Interviewing': '#8B5CF6',
    'Offered': '#10B981',
    'Rejected': '#EF4444',
  };
  const color = statusColors[newStatus] || '#242424';

  return {
    subject: `Application Update: ${newStatus} for ${jobTitle} at ${companyName}`,
    text: `Hi ${candidateName}, your application for ${jobTitle} at ${companyName} has been updated to "${newStatus}".`,
    html: baseWrapper(`
      <h2 style="margin-top: 0; color: #242424;">Application Status Update</h2>
      <p>Hi <strong>${candidateName}</strong>,</p>
      <p>The hiring team at <strong>${companyName}</strong> has updated the status of your application for <strong>${jobTitle}</strong>:</p>

      <div class="highlight-box" style="border-left-color: ${color};">
        <p style="margin: 0; font-size: 13px; color: #52525B;">Updated Status:</p>
        <div style="display: inline-block; background: ${color}; color: #FFFFFF; font-weight: 700; font-size: 15px; padding: 6px 14px; border-radius: 9999px; margin-top: 6px;">
          ${newStatus}
        </div>
        ${
          notes
            ? `<div style="margin-top: 12px; font-size: 14px; color: #4B5563;"><strong>Note from employer:</strong><br>${notes}</div>`
            : ''
        }
      </div>

      <p>You can check complete details and updates anytime from your candidate portal.</p>
      <p style="margin-top: 24px;">Best regards,<br>${companyName} & Elevate Careers</p>
    `),
  };
};

module.exports = {
  applicationReceivedCandidate,
  newApplicationEmployer,
  applicationStatusChanged,
};
