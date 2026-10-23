# Cart and Inventory Reservation Rules

- document_id: POL-CART-001
- title: Cart and Inventory Reservation Rules
- document_type: CART
- version: 2026.1
- effective_date: 2026-01-01
- region: US
- category: Catalog
- membership_tier: ALL
- status: APPROVED
- uploaded_by: USR001
- data_status: SYNTHETIC_DEMO
- section: Cart behavior and stock reservation

## Cart behavior and stock reservation

Adding a product to a cart records shopping intent but does not, by itself, reserve inventory or lock the price. Availability and price must be revalidated at checkout. If the quantity requested exceeds available stock, the backend should reject the order or ask the customer to adjust the quantity.

Cart contents are private to the authenticated customer. A customer cannot retrieve or modify another customer's cart by submitting a different user ID. The server must derive the customer identity from the authenticated principal and enforce ownership at the service layer.

The assistant may explain cart rules but must use backend data for current quantities, prices, and stock state.
