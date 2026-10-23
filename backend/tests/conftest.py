import pytest
from app.core.config import settings

@pytest.fixture(scope="session", autouse=True)
def configure_test_environment():
    """Ensure tests run deterministically and fast without external network dependencies."""
    original_fake_llm = settings.USE_FAKE_LLM
    original_clerk_mock = settings.CLERK_MOCK_AUTH
    
    settings.USE_FAKE_LLM = True
    settings.CLERK_MOCK_AUTH = True
    
    yield
    
    settings.USE_FAKE_LLM = original_fake_llm
    settings.CLERK_MOCK_AUTH = original_clerk_mock
