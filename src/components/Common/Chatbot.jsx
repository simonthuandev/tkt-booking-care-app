import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router";
import { FaHeartPulse } from "react-icons/fa6";
import { FiX, FiSend } from "react-icons/fi";
import { aiService } from "../../api/appService";
import "./Chatbot.scss";

// ─── Gợi ý nhanh ──────────────────────────────────────────────────────────────
const QUICK_SUGGESTIONS = [
  "Tôi đau bụng và buồn nôn",
  "Tôi đau ngực, khó thở",
  "Bị mẩn ngứa ngoài da",
  "Đặt lịch khám như thế nào?",
];

const WELCOME_MESSAGE = {
  id: 1,
  role: "bot",
  text: "Xin chào! 👋 Tôi là trợ lý AI của **TKT BookingCare**. Tôi có thể giúp bạn đặt lịch khám, tìm bác sĩ hoặc giải đáp thắc mắc về sức khỏe. Bạn cần hỗ trợ gì hôm nay?",
};

const SYSTEM_COMMANDS = [
  {
    command: "/clear",
    label: "Làm mới cuộc trò chuyện",
    description: "Xóa nội dung chat và quay về màn hình bắt đầu.",
  },
  {
    command: "/suggest",
    label: "Hiện gợi ý nhanh",
    description: "Mở các prompt mẫu để hỏi về triệu chứng hoặc đặt lịch.",
  },
  {
    command: "/help",
    label: "Hướng dẫn lệnh",
    description: "Xem các lệnh hệ thống có thể dùng.",
  },
  {
    command: "/scope",
    label: "Phạm vi hỗ trợ",
    description: "Xem những nội dung trợ lý có thể xử lý.",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────
const Chatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen]     = useState(false);
  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [input, setInput]       = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCommandMenu, setShowCommandMenu] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef    = useRef(null);

  // Auto-scroll xuống cuối
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Auto-resize textarea
  const handleInput = (e) => {
    const value = e.target.value;
    setInput(value);
    setShowCommandMenu(value.trim().startsWith("/"));
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto";
      ta.style.height = `${Math.min(ta.scrollHeight, 100)}px`;
    }
  };

  const resetTextareaHeight = () => {
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const addBotMessage = (text) => {
    setMessages((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), role: "bot", text },
    ]);
  };

  const showSuggestions = () => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        role: "bot",
        text: "Bạn có thể chọn một gợi ý bên dưới hoặc tự mô tả triệu chứng bằng lời của mình.",
        suggestions: QUICK_SUGGESTIONS,
      },
    ]);
  };

  const showHelp = () => {
    const commandList = SYSTEM_COMMANDS.map(
      (item) => `**${item.command}** - ${item.label}`
    ).join("\n");
    addBotMessage(`Các lệnh hệ thống hiện có:\n${commandList}`);
  };

  const handleCommand = (command) => {
    setInput("");
    setShowCommandMenu(false);
    resetTextareaHeight();

    if (command === "/clear") {
      setMessages([WELCOME_MESSAGE]);
      return;
    }

    if (command === "/suggest") {
      showSuggestions();
      return;
    }

    if (command === "/help") {
      showHelp();
      return;
    }

    if (command === "/scope") {
      addBotMessage(
        "Mình hỗ trợ gợi ý chuyên khoa từ mô tả triệu chứng, hướng dẫn đặt lịch và điều hướng trong TKT BookingCare. Mình không chẩn đoán bệnh, không kê thuốc và không trả lời các chủ đề ngoài phạm vi đặt lịch khám."
      );
      return;
    }

    addBotMessage("Mình chưa nhận ra lệnh này. Bạn gõ **/help** để xem danh sách lệnh nhé.");
  };

  // ── Gửi tin nhắn ────────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    if (trimmed.startsWith("/")) {
      handleCommand(trimmed.split(/\s+/)[0].toLowerCase());
      return;
    }

    // Thêm tin nhắn user
    const userMsg = { id: Date.now(), role: "user", text: trimmed };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setShowCommandMenu(false);
    resetTextareaHeight();

    setIsTyping(true);

    try {
      const response = await aiService.triage(trimmed);
      const result = response.data?.data;
      const botText = result?.message || "Mình chưa xử lý được yêu cầu này. Bạn thử mô tả rõ hơn nhé.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: botText,
          triage: result?.specialtySlug ? result : null,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: "Mình chưa kết nối được hệ thống gợi ý chuyên khoa. Bạn vui lòng thử lại sau nhé.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape" && showCommandMenu) {
      e.preventDefault();
      setShowCommandMenu(false);
      return;
    }

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

  const openSpecialty = (triage) => {
    if (!triage?.specialtySlug) return;
    setIsOpen(false);
    navigate(`/specialties/${triage.specialtySlug}`);
  };

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
                <div className="chatbot-msg-bubble">
                  {renderText(msg.text)}
                  {msg.triage?.specialtySlug && (
                    <div className="chatbot-triage-card">
                      <div>
                        <span className="chatbot-triage-label">Chuyên khoa gợi ý</span>
                        <strong>{msg.triage.specialtyName}</strong>
                      </div>
                      <button type="button" onClick={() => openSpecialty(msg.triage)}>
                        Xem chuyên khoa
                      </button>
                    </div>
                  )}
                  {msg.suggestions && (
                    <div className="chatbot-inline-suggestions">
                      {msg.suggestions.map((suggestion) => (
                        <button
                          key={suggestion}
                          type="button"
                          onClick={() => sendMessage(suggestion)}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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
          {showCommandMenu && (
            <div className="chatbot-command-menu">
              {SYSTEM_COMMANDS.filter((item) =>
                item.command.startsWith(input.trim().toLowerCase())
              ).length > 0 ? (
                SYSTEM_COMMANDS.filter((item) =>
                  item.command.startsWith(input.trim().toLowerCase())
                ).map((item) => (
                  <button
                    key={item.command}
                    type="button"
                    onClick={() => handleCommand(item.command)}
                  >
                    <strong>{item.command}</strong>
                    <span>{item.description}</span>
                  </button>
                ))
              ) : (
                <div className="chatbot-command-empty">Không có lệnh phù hợp</div>
              )}
            </div>
          )}

          <div className="chatbot-input-area">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Nhập câu hỏi hoặc gõ / để chọn lệnh..."
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
