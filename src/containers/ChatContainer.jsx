import React, { useState, useEffect} from "react";
import ChatInput from "../components/ChatInput";
import ChatMessage from "../components/ChatMessage";
import Navbar from "../components/Navbar";
import Load from "../components/Load";
import { queryAI, logout } from "../utils/api";


export default function ChatContainer({ token, setToken }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");

  const endOfMessagesRef = React.createRef();
  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
  };
  const handleQuery = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    queryAI({ query }, token)
      .then((res) => {
        setMessages((prevMessages) => [...prevMessages, { query, data: res }]);
        setQuery("");
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  const handleLogout = () => {
    setLoading(true);
    logout(token)
      .then(() => {
        setToken(null);
        localStorage.removeItem("token");
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
  }, [messages]);

  return (
    <div>
      <Navbar logout={handleLogout} loading={loading} />
      <div>
        {loading && messages.length === 0 ? (
          <Load />
        ) : (
          messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.data.data}
              query={message.query}
              isLoading={loading}
              lastArray={index === messages.length - 1}
              currentQuery={query}
            />
          ))
        )}
        {/* Elemen referensi untuk scroll otomatis */}
        <div ref={endOfMessagesRef} />
      </div>
      <ChatInput
        onSubmit={handleQuery}
        onChange={handleChange}
        loading={loading}
        query={query}
      />
    </div>
  );
}
