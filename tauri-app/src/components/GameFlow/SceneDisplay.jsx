import React, { useState, useEffect, useRef } from "react";
import "../../styles/scene.css"
export function SceneDisplay({ dialogue, onComplete, background }) {
  const [currentLine, setCurrentLine] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const charIndexRef = useRef(0);
  const intervalRef = useRef(null);

  const currentDialogue = dialogue[currentLine];

  useEffect(() => {
    startTyping();
    return () => clearInterval(intervalRef.current); // cleanup on unmount or new line
  }, [currentLine]);

  const startTyping = () => {
    setDisplayText("");
    charIndexRef.current = 0;
    setIsTyping(true);

    intervalRef.current = setInterval(() => {
      const currentCharIndex = charIndexRef.current;
      const fullText = currentDialogue.text;

      if (currentCharIndex < fullText.length) {
        setDisplayText((prev) => prev + fullText[currentCharIndex]);
        charIndexRef.current += 1;
      } else {
        clearInterval(intervalRef.current);
        setIsTyping(false);
      }
    }, 25); // typing speed
  };

  const handleAdvance = () => {
    if (isTyping) {
      clearInterval(intervalRef.current);
      setDisplayText(currentDialogue.text);
      setIsTyping(false);
    } else if (currentLine < dialogue.length - 1) {
      setCurrentLine((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const bgStyle = background
    ? {
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <div className="scene-container" onClick={handleAdvance} style={bgStyle}>
      <div className="dialog-box">
        <div className="speaker-name">{currentDialogue.speaker}</div>
        <div className="dialogue-text">{displayText}</div>
        {!isTyping && <div className="continue-hint">[Click to continue]</div>}
      </div>
    </div>
  );
}
