import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api/client';
import { AssistantMessage } from '../components/ai/AssistantMessage';
import { ThinkingIndicator } from '../components/ai/ThinkingIndicator';
import { Button } from '../components/common/Button';
import { Sparkles, Send, RotateCcw, Database, ShieldCheck } from 'lucide-react';

export function Assistant() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialPrompt = searchParams.get('prompt') || '';

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      data: {
        interpretedRequirement: 'Autonomous shopping assistant initialized. I interpret natural-language requests, budget ceilings, and specific use-cases, and return verified matching catalog records.',
        budget: null,
        recommendations: [],
        clarifyingQuestion: 'What category of product or budget ceiling are you looking to explore today?'
      }
    }
  ]);

  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const suggestionChips = [
    'Wireless noise canceling headphones under $350',
    'Lightweight ultrabook for software engineering',
    'Titanium GPS smartwatch with multi-day battery',
    'Quiet wireless productivity mouse for Mac'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSend(initialPrompt);
    }
  }, [initialPrompt]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setLoading(true);

    try {
      // Extract optional budget if typed like "$300"
      const budgetMatch = textToSend.match(/\$([0-9]+)/);
      const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : undefined;

      const aiResponse = await api.post('/ai/recommendations', {
        query: textToSend,
        prompt: textToSend,
        budget
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        data: aiResponse
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error('AI assistant error:', err);
      const errorMsg = {
        id: `err-${Date.now()}`,
        role: 'ai',
        data: {
          interpretedRequirement: 'Could not process query through backend provider.',
          budget: null,
          recommendations: [],
          clarifyingQuestion: 'Please try a different search phrase or check connection.'
        }
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'ai',
        data: {
          interpretedRequirement: 'Chat history cleared. What product specifications or price range would you like to explore?',
          budget: null,
          recommendations: [],
          clarifyingQuestion: null
        }
      }
    ]);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem',
        borderBottom: '1px solid var(--color-border)',
        paddingBottom: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'var(--color-ai-surface-2)',
            color: 'var(--color-ai-text)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <h1 className="text-h2" style={{ fontSize: '1.25rem' }}>AI Shopping Assistant</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              <Database size={12} /> Sourcing live inventory records • gemini-2.5-flash
            </div>
          </div>
        </div>

        <button
          onClick={handleClearChat}
          className="btn-ghost"
          style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', padding: '6px 10px', borderRadius: '6px' }}
        >
          <RotateCcw size={14} /> Clear Chat
        </button>
      </div>

      {/* Main Chat Container */}
      <div className="chat-container">
        {/* Messages Feed */}
        <div className="chat-messages">
          {messages.map(msg => {
            if (msg.role === 'user') {
              return (
                <div key={msg.id} className="message-bubble message-user animate-fade-in">
                  {msg.content}
                </div>
              );
            }
            return (
              <AssistantMessage key={msg.id} data={msg.data} />
            );
          })}

          {loading && (
            <ThinkingIndicator label="Agent evaluating catalog..." />
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div style={{
          padding: '0.5rem 1.25rem',
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          backgroundColor: 'var(--color-surface-2)',
          borderTop: '1px solid var(--color-border)'
        }}>
          {suggestionChips.map((chip, i) => (
            <button
              key={i}
              onClick={() => handleSend(chip)}
              disabled={loading}
              className="card"
              style={{
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.775rem',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                backgroundColor: 'var(--color-surface)',
                border: '1px solid var(--color-border)'
              }}
            >
              ✨ {chip}
            </button>
          ))}
        </div>

        {/* Composer Input Box */}
        <form
          className="chat-composer"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            className="input"
            placeholder="E.g., I need a 15-inch laptop with at least 16GB RAM for under $1400..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={loading}
            style={{ fontSize: '0.925rem' }}
          />

          <Button
            type="submit"
            variant="ai"
            size="md"
            disabled={!inputText.trim() || loading}
            icon={<Send size={16} />}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
