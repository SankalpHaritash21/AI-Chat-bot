import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { GoogleGenerativeAI, GenerativeModel } from "@google/generative-ai";
import ChatHistory from "./Components/ChatHistory";
import Loading from "./Components/Loading";

interface Message {
  type: "user" | "bot";
  message: string;
}

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>("");
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Initialize your Gemini API
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINIAPI);
  const model: GenerativeModel = genAI.getGenerativeModel({
    model: import.meta.env.VITE_GEMINIVERSION,
  });

  // Function to handle user input
  const handleUserInput = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserInput(e.target.value);
  };

  // Function to handle key press
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Function to send user message to Gemini
  const sendMessage = async (): Promise<void> => {
    if (userInput.trim() === "") return;

    setIsLoading(true);
    try {
      // Call Gemini API to get a response
      const result = await model.generateContent(userInput);
      const response = await result.response;
      const responseText = await response.text(); // Ensure the response text is awaited
      console.log(responseText);
      // Add Gemini's response to the chat history
      setChatHistory((prevChatHistory) => [
        ...prevChatHistory,
        { type: "user", message: userInput },
        { type: "bot", message: responseText },
      ]);
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setUserInput("");
      setIsLoading(false);
    }
  };

  // Function to clear the chat history
  const clearChat = (): void => {
    setChatHistory([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-around">
        <div></div>
        <h1 className="text-3xl font-bold text-center mb-4">Chatbot</h1>
        <button
          className="mt-4 block px-4 py-2 rounded-lg bg-red-400 text-white hover:bg-gray-500 focus:outline-none"
          onClick={clearChat}
        >
          Clear Chat
        </button>
      </div>

      <div className="chat-container rounded-lg shadow-md p-4">
        <ChatHistory chatHistory={chatHistory} />
        <Loading isLoading={isLoading} />
      </div>

      <div className="flex mt-4">
        <input
          type="text"
          className="flex-grow px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
          value={userInput}
          onChange={handleUserInput}
          onKeyDown={handleKeyPress}
        />
        <button
          className="px-4 py-2 ml-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
          onClick={sendMessage}
          disabled={isLoading}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default App;
