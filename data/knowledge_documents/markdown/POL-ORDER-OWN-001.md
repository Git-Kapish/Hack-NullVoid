# Order Privacy and Ownership Rules

- document_id: POL-ORDER-OWN-001
- title: Order Privacy and Ownership Rules
- document_type: ORDER_SECURITY
- version: 2026.1
- effective_date: 2026-01-01
- region: US
- category: Privacy
- membership_tier: ALL
- status: APPROVED
- uploaded_by: USR001
- data_status: SYNTHETIC_DEMO
- section: Order-level authorization

## Order-level authorization

Customers may view only orders associated with their authenticated account. Order IDs are identifiers, not authorization credentials. Every order detail, shipment timeline, cancellation request, and support-ticket lookup must enforce ownership in the backend.

Administrative access must use an authorized role and should be limited to legitimate operational needs. The AI assistant must not expose another customer's name, address, order contents, tracking data, or support history even if the user asks directly or provides a guessed order ID.

If ownership cannot be established, return a safe not-found or access-denied response according to the API contract without revealing whether another customer's record exists.
