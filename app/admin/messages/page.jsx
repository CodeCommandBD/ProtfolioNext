"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styled from "styled-components";
import { FaReply, FaPaperPlane, FaCheck, FaUndo } from "react-icons/fa";

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const MessageCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 10px;
`;

const SenderInfo = styled.div`
  h3 {
    margin: 0;
    font-size: 18px;
    color: ${({ theme }) => theme.text_primary};
  }
  p {
    margin: 5px 0 0;
    font-size: 14px;
    color: ${({ theme }) => theme.text_secondary};
  }
`;

const Time = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text_secondary};
`;

const Subject = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.primary};
  margin-bottom: 10px;
`;

const Body = styled.p`
  color: ${({ theme }) => theme.text_secondary};
  line-height: 1.6;
  white-space: pre-wrap;
`;

const Actions = styled.div`
  margin-top: 15px;
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

const Button = styled.button`
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.primary + "dd"};
  }
`;

const StatusBadge = styled.span`
  background: ${({ replied }) => (replied ? "#10B98133" : "#F59E0B33")};
  color: ${({ replied }) => (replied ? "#10B981" : "#F59E0B")};
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ReplyBox = styled.div`
  margin-top: 15px;
  background: rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 8px;
`;

const TextArea = styled.textarea`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 10px;
  border-radius: 6px;
  min-height: 100px;
  margin-bottom: 10px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
  }
`;

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);

  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/admin/messages");
      setMessages(res.data);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleReply = async (id, email, subject) => {
    try {
      setSending(true);
      await axios.post("/api/admin/messages/reply", {
        id,
        replyMessage: replyText,
        userEmail: email,
        subject,
      });
      toast.success("Reply sent successfully!");
      setReplyingTo(null);
      setReplyText("");
      fetchMessages(); // Refresh list to update status
    } catch (error) {
      toast.error("Failed to send reply");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <Container>
      <h1 className="text-2xl font-bold mb-6 text-white">Messages</h1>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-gray-400 text-xl">No messages found.</p>
          </div>
        </div>
      ) : (
        messages.map((msg) => (
          <MessageCard key={msg._id}>
            <Header>
              <SenderInfo>
                <h3>{msg.name}</h3>
                <p>{msg.email}</p>
              </SenderInfo>
              <div className="flex flex-col items-end gap-2">
                <Time>{new Date(msg.createdAt).toLocaleDateString()}</Time>
                <StatusBadge replied={msg.replied}>
                  {msg.replied ? (
                    <>
                      <FaCheck /> Replied
                    </>
                  ) : (
                    <>
                      <FaUndo /> Pending
                    </>
                  )}
                </StatusBadge>
              </div>
            </Header>

            <Subject>{msg.subject}</Subject>
            <Body>{msg.message}</Body>

            <Actions>
              {replyingTo === msg._id ? (
                <Button onClick={() => setReplyingTo(null)}>Cancel</Button>
              ) : (
                <Button onClick={() => setReplyingTo(msg._id)}>
                  <FaReply /> Reply
                </Button>
              )}
            </Actions>

            {replyingTo === msg._id && (
              <ReplyBox>
                <TextArea
                  placeholder="Write your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
                <Button
                  onClick={() => handleReply(msg._id, msg.email, msg.subject)}
                  disabled={sending || !replyText.trim()}
                >
                  {sending ? (
                    "Sending..."
                  ) : (
                    <>
                      <FaPaperPlane /> Send Reply
                    </>
                  )}
                </Button>
              </ReplyBox>
            )}
          </MessageCard>
        ))
      )}
    </Container>
  );
}
