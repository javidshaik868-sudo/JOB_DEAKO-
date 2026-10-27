import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, Avatar } from '../../components/common/Card';
import { Button, IconButton } from '../../components/common/Button';
import { CardSkeleton } from '../../components/common/Spinner';
import { PageHeader, EmptyState, ErrorState } from '../../components/common/Feedback';
import { Icon } from '../../components/icons/Icon';
import { messagesApi } from '../../services/messagesApi';
import { useToast } from '../../context/ToastContext';

export const MessagesPage = () => {
  const [selectedConvoId, setSelectedConvoId] = useState(null);
  const [textInput, setTextInput] = useState('');
  const toast = useToast();
  const queryClient = useQueryClient();

  const { data: convoData, isLoading: isConvoLoading, isError: isConvoError, refetch: refetchConvos } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagesApi.getConversations(),
  });

  const conversations = convoData?.conversations || [];
  const activeConvo = conversations.find((c) => c.id === selectedConvoId) || conversations[0];

  const { data: messageData, isLoading: isMessagesLoading } = useQuery({
    queryKey: ['messages', activeConvo?.id],
    queryFn: () => messagesApi.getMessages(activeConvo.id),
    enabled: Boolean(activeConvo?.id),
  });

  const messages = messageData?.messages || [];

  const sendMutation = useMutation({
    mutationFn: (text) => messagesApi.sendMessage(activeConvo.id, text),
    onSuccess: () => {
      setTextInput('');
      queryClient.invalidateQueries({ queryKey: ['messages', activeConvo?.id] });
    },
    onError: () => {
      toast.error('Failed to send message');
    },
  });

  const handleSend = (e) => {
    e.preventDefault();
    if (!textInput.trim() || !activeConvo) return;
    sendMutation.mutate(textInput.trim());
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: 'calc(100vh - 150px)', minHeight: '520px' }}>
      <PageHeader
        title="Direct Recruiter Messages"
        subtitle="Communicate directly with verified recruiters, talent leads, and hiring managers"
      />

      {isConvoLoading ? (
        <CardSkeleton />
      ) : isConvoError ? (
        <ErrorState
          title="Could not load conversations"
          description="Unable to connect to the messaging server."
          onRetry={refetchConvos}
        />
      ) : conversations.length === 0 ? (
        <EmptyState
          icon="message"
          title="No Active Conversations"
          description="When recruiters shortlist your profile or invite you for interviews, direct messaging threads will start here."
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 320px) 1fr',
            gap: '1rem',
            flex: 1,
            minHeight: 0,
          }}
        >
          {/* Conversation List */}
          <Card style={{ padding: '0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {conversations.map((convo) => {
              const isSelected = activeConvo?.id === convo.id;
              return (
                <div
                  key={convo.id}
                  onClick={() => setSelectedConvoId(convo.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'var(--bg-card-elevated)' : 'transparent',
                    border: isSelected ? '1px solid var(--border-primary)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <Avatar name={convo.name} size="md" />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#FFFFFF', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {convo.name}
                      </h4>
                      <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>{convo.time}</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', margin: '0.125rem 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {convo.lastMessage || 'Open chat'}
                    </p>
                  </div>
                </div>
              );
            })}
          </Card>

          {/* Active Chat Window */}
          <Card style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
            {/* Chat Header */}
            <div
              style={{
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <Avatar name={activeConvo?.name} size="sm" />
              <div>
                <h3 style={{ fontSize: '0.9375rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>
                  {activeConvo?.name}
                </h3>
                <span style={{ fontSize: '0.6875rem', color: 'var(--color-primary)' }}>Active Recruiter</span>
              </div>
            </div>

            {/* Chat Body */}
            <div
              style={{
                flex: 1,
                padding: '1.25rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem',
              }}
            >
              {isMessagesLoading ? (
                <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                  Loading chat history...
                </div>
              ) : messages.length === 0 ? (
                <div style={{ textAlign: 'center', margin: 'auto', color: 'var(--color-text-muted)', fontSize: '0.8125rem' }}>
                  No messages exchanged yet. Send a greeting to start the conversation!
                </div>
              ) : (
                messages.map((m) => {
                  const isMe = m.sender === 'me';
                  return (
                    <div
                      key={m.id}
                      style={{
                        alignSelf: isMe ? 'flex-end' : 'flex-start',
                        maxWidth: '70%',
                        backgroundColor: isMe ? 'var(--color-primary)' : 'var(--bg-tertiary)',
                        color: isMe ? 'var(--color-text-dark)' : 'var(--color-text-primary)',
                        padding: '0.625rem 0.875rem',
                        borderRadius: 'var(--radius-lg)',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                      }}
                    >
                      <div>{m.text}</div>
                      <div
                        style={{
                          fontSize: '0.625rem',
                          color: isMe ? 'rgba(8,12,13,0.7)' : 'var(--color-text-muted)',
                          textAlign: 'right',
                          marginTop: '0.25rem',
                        }}
                      >
                        {m.timestamp || 'Now'}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Message Input Box */}
            <form
              onSubmit={handleSend}
              style={{
                padding: '0.875rem 1.25rem',
                borderTop: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
              }}
            >
              <input
                type="text"
                placeholder="Write a message..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                style={{ flex: 1, backgroundColor: 'var(--bg-tertiary)' }}
              />
              <Button type="submit" variant="primary" size="md" isLoading={sendMutation.isPending}>
                Send
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
export default MessagesPage;
