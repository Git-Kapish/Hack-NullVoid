# Account Access and Security Policy

- document_id: POL-ACC-001
- title: Account Access and Security Policy
- document_type: ACCOUNT_SECURITY
- version: 2026.1
- effective_date: 2026-01-01
- region: US
- category: Account
- membership_tier: ALL
- status: APPROVED
- uploaded_by: USR001
- data_status: SYNTHETIC_DEMO
- section: Password recovery and verification

## Password recovery and verification

Customers who cannot sign in should use the password-reset flow on the sign-in page. Support cannot retrieve or disclose an existing password. Verification codes are single-use secrets and must not be shared with support agents or the AI assistant.

Repeated failed sign-in attempts may trigger a temporary security hold. Follow the recovery instructions displayed by the application or contact support using the verified Help Center. Support may request a verification step, but it must not request the customer's password or one-time code.

Authentication and authorization decisions are made by the backend. The assistant may explain recovery steps but must not bypass authentication, expose tokens, or retrieve private account records without a valid authenticated context.
