# Knowledge Document Versioning Rules

- document_id: POL-DOC-VERSION-001
- title: Knowledge Document Versioning Rules
- document_type: DOCUMENT_GOVERNANCE
- version: 2026.1
- effective_date: 2026-01-01
- region: US
- category: AI Governance
- membership_tier: ALL
- status: APPROVED
- uploaded_by: USR001
- data_status: SYNTHETIC_DEMO
- section: Document publication and version selection

## Document publication and version selection

Published knowledge documents should be immutable. A policy change should create a new version with its own document ID or version record, effective date, region, category, and approval status. Do not silently overwrite a published policy while leaving old chunks associated with the same version metadata.

Only approved and currently effective documents may be used for ordinary customer-facing answers. Archived documents may be retained for authorized historical review but must be excluded from default retrieval. Draft and future-effective documents must not answer present-day questions.

When duplicate copies of a document exist in PDF, Markdown, and JSON, treat them as alternate source formats for the same policy, not independent corroborating authorities. Preserve provenance so citations resolve to one canonical document record.
