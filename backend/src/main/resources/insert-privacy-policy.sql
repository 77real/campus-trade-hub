USE campustradehub;

INSERT INTO system_settings (setting_key, setting_value, description, updated_at) VALUES
('PRIVACY_POLICY', 
'# Privacy Policy

Last Updated: December 7, 2025

## 1. Introduction

Campus Trade Hub ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.

## 2. Information We Collect

### Personal Information
- Email address
- Username
- Phone number (optional)
- Password (encrypted)

### Item Information
- Item descriptions, images, and pricing
- Transaction history
- Communication between buyers and sellers

### Usage Data
- IP address and browser information
- Pages visited and time spent
- Search queries and filters used

## 3. How We Use Your Information

- To provide and maintain our service
- To facilitate transactions between users
- To send you notifications about your account and transactions
- To improve our platform and user experience
- To prevent fraud and enhance security
- To comply with legal obligations

## 4. Data Sharing and Disclosure

We do not sell your personal information. We may share your data with:
- **Other Users:** Your username, reputation score, and contact information are visible to facilitate transactions
- **Service Providers:** Third-party vendors who assist in operating our platform
- **Legal Requirements:** When required by law or to protect our rights

## 5. Data Security

We implement appropriate technical and organizational measures to protect your personal data:
- Passwords are encrypted using BCrypt
- JWT tokens for secure authentication
- HTTPS encryption for data transmission
- Regular security audits and updates

## 6. Your Rights (GDPR)

Under GDPR, you have the following rights:
- **Right to Access:** Request a copy of your personal data
- **Right to Rectification:** Correct inaccurate data
- **Right to Erasure:** Request deletion of your data
- **Right to Data Portability:** Receive your data in a structured format
- **Right to Object:** Object to data processing
- **Right to Withdraw Consent:** Withdraw consent at any time

To exercise these rights, visit your Account Settings or contact us at privacy@campustradehub.com

## 7. Data Retention

We retain your personal data only for as long as necessary to fulfill the purposes outlined in this policy. When you delete your account, we will permanently delete your personal information within 30 days.

## 8. Cookies

We use essential cookies and local storage to maintain your session and preferences. We do not use tracking cookies or third-party advertising cookies.

## 9. Children''s Privacy

Our service is intended for university students (18+). We do not knowingly collect personal information from children under 18.

## 10. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.

## 11. Contact Us

If you have questions about this Privacy Policy, please contact us at:
- Email: privacy@campustradehub.com
- Data Protection Officer: dpo@campustradehub.com',
'Privacy Policy content in Markdown format',
NOW())
ON DUPLICATE KEY UPDATE 
    setting_value = VALUES(setting_value),
    updated_at = NOW();
