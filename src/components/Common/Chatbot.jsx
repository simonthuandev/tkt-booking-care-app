import { useState, useRef, useEffect } from "react";
import { FaHeartPulse } from "react-icons/fa6";
import { FiX, FiSend } from "react-icons/fi";
import "./Chatbot.scss";

// ─── Prompt hệ thống cho AI ───────────────────────────────────────────────────
const SYSTEM_PROMPT = `Bạn là trợ lý AI của TKT BookingCare — nền tảng đặt lịch khám bệnh trực tuyến tại Việt Nam.
Nhiệm vụ của bạn:
- Giúp người dùng đặt lịch khám, tìm bác sĩ, chọn chuyên khoa, tìm cơ sở y tế phù hợp.
- Trả lời các câu hỏi liên quan đến sức khỏe phổ thông một cách đơn giản, dễ hiểu.
- Hướng dẫn sử dụng các tính năng của nền tảng.
- Giao tiếp bằng tiếng Việt, thân thiện, ngắn gọn và chuyên nghiệp.
- KHÔNG đưa ra chẩn đoán bệnh cụ thể — luôn khuyến khích người dùng gặp bác sĩ để được tư vấn chính xác.
Trả lời ngắn gọn (tối đa 3-4 câu mỗi lần), dùng emoji khi phù hợp để tạo cảm giác thân thiện.`;

// ─── Gợi ý nhanh ──────────────────────────────────────────────────────────────
const QUICK_SUGGESTIONS = [
  "Đặt lịch khám như thế nào?",
  "Tìm bác sĩ theo chuyên khoa",
  "Phòng khám gần tôi nhất",
  "Lịch sử đặt khám của tôi",
];

// ─── Component ────────────────────────────────────────────────────────────────
const Chatbot = () => {
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "Xin chào! 👋 Tôi là trợ lý AI của **TKT BookingCare**. Tôi có thể giúp bạn đặt lịch khám, tìm bác sĩ hoặc giải đáp thắc mắc về sức khỏe. Bạn cần hỗ trợ gì hôm nay?",
    },
  ]);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [history, setHistory]   = useState([]); // lưu lịch sử cho API
  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  // Auto-scroll xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-resize textarea
  const handleInput = (e) => {
    setInput(e.target.value);
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 100)}px`;
    }
  };

  // ── Gửi tin nhắn ────────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    // Thêm tin nhắn user
    const userMsg = { id: Date.now(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    // Cập nhật history cho API
    const newHistory = [...history, { role: "user", content: trimmed }];
    setHistory(newHistory);
    setIsTyping(true);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: newHistory,
        }),
      });

      const data = await response.json();
      const botText =
        data?.content?.find((b) => b.type === "text")?.text ||
        "Xin lỗi, tôi chưa thể xử lý yêu cầu này. Vui lòng thử lại! 🙏";

      // Cập nhật history với phản hồi bot
      setHistory((prev) => [...prev, { role: "assistant", content: botText }]);

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: "bot", text: botText },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "Oops! Có lỗi kết nối. Vui lòng thử lại sau nhé! 😓",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Render text với **bold** đơn giản ───────────────────────────────────────
  const renderText = (text) =>
    text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={i}>{part.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{part}</span>
      )
    );

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── Chat window ── */}
      {isOpen && (
        <div className="chatbot-window" role="dialog" aria-label="Trợ lý AI BookingCare">

          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-avatar">
              <FaHeartPulse />
            </div>
            <div className="chatbot-header-info">
              <div className="chatbot-header-name">Trợ lý TKT BookingCare</div>
              <div className="chatbot-header-status">Đang hoạt động</div>
            </div>
            <button
              className="chatbot-header-close"
              onClick={() => setIsOpen(false)}
              aria-label="Đóng chatbot"
            >
              <FiX />
            </button>
          </div>

          {/* Messages */}
          <div className="chatbot-messages" role="log" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chatbot-msg ${msg.role === "bot" ? "is-bot" : "is-user"}`}
              >
                {msg.role === "bot" && (
                  <div className="chatbot-msg-avatar">
                    <FaHeartPulse />
                  </div>
                )}
                <div className="chatbot-msg-bubble">{renderText(msg.text)}</div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="chatbot-msg is-bot">
                <div className="chatbot-msg-avatar"><FaHeartPulse /></div>
                <div className="chatbot-typing">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {/* Quick suggestions — chỉ hiện khi mới bắt đầu */}
            {messages.length === 1 && !isTyping && (
              <div className="chatbot-suggestions">
                {QUICK_SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    className="chatbot-suggestion-chip"
                    onClick={() => sendMessage(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chatbot-input-area">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi... (Enter để gửi)"
              rows={1}
              aria-label="Nhập tin nhắn"
            />
            <button
              className="chatbot-send-btn"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isTyping}
              aria-label="Gửi"
            >
              <FiSend />
            </button>
          </div>

          {/* Footer */}
          <div className="chatbot-footer">
            Được hỗ trợ bởi <span>AI</span> · TKT BookingCare
          </div>
        </div>
      )}

      {/* ── FAB toggle ── */}
      <button
        className={`chatbot-fab ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? "Đóng chatbot" : "Mở chatbot hỗ trợ"}
        title="Trợ lý AI BookingCare"
      >
        <FaHeartPulse className="fab-icon fab-icon-open" />
        <FiX className="fab-icon fab-icon-close" />
      </button>
    </>
  );
};

export default Chatbot;
