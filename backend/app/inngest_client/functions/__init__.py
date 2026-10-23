from app.inngest_client.functions.order_flow import process_order_flow
from app.inngest_client.functions.inventory import alert_low_stock
from app.inngest_client.functions.ai_tagger import auto_tag_product

inngest_functions = [
    process_order_flow,
    alert_low_stock,
    auto_tag_product,
]
