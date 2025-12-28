import { GoogleGenAI } from "@google/genai";
import { useState, useRef, useEffect } from "react";

export default function AI() {
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [chatContents, setChatContents] = useState([]);
  const thinkingRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [chatContents]);

  // To run this code you need to install the following dependencies:
  // npm install @google/genai mime
  // npm install -D @types/node
  async function main() {
    if (apiKey.trim() === "" || prompt.trim() === "") {
      return;
    }

    containerRef.current.classList.replace("special-flex", "hidden");
    thinkingRef.current.classList.replace("hidden", "flex");

    const ai = new GoogleGenAI({
      apiKey: apiKey,
    });
    const tools = [
      {
        googleSearch: {},
      },
    ];
    const config = {
      thinkingConfig: {
        thinkingLevel: "HIGH",
      },
      tools,
    };
    const model = "gemini-3-pro-preview";
    const contents = [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ];

    try {
      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let newText = "";
      for await (const chunk of response) {
        // console.log(chunk);

        // if (chunk.candidates.length === 0 || chunk.candidates.length > 1) debugger;
        // if (chunk.candidates[0].content.role != "model") debugger;
        // if (chunk.candidates[0].content.parts.length === 0 || chunk.candidates[0].content.parts.length > 1) debugger;
        // if (!chunk.candidates[0].content.parts[0].text) debugger;

        const text = chunk.candidates[0].content.parts[0].text;

        if (text === "") {
          if (newText !== "") {
            newText += "\n";
          }
          continue;
        }

        if (newText === "") {
          newText = text;
        } else {
          newText += " " + text;
        }
      }

      console.log(newText);
      //replace double **Word** with bold
      newText = newText.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
      //replace single *Word* with italics
      newText = newText.replace(/\*(.*?)\*/g, "<i>$1</i>");

      const newHeaderContent = {
        tag: "h6",
        text: prompt,
      };
      const newChatContents = [newHeaderContent];
      const newContent = newText.split("\n");
      newContent.forEach((p) => {
        const newChatContent = {
          tag: "p",
          text: p,
        };
        newChatContents.push(newChatContent);
      });

      setChatContents((prev) => [...prev, ...newChatContents]);
      //   setPrompt("");
    } catch (e) {
      const newChatContents = [
        {
          tag: "h6",
          text: "There was an error:",
        },
        {
          tag: "p",
          text: e.message,
        },
        {
          tag: "p",
          text: e.name,
        },
        {
          tag: "p",
          text: e.stack,
        },
      ];
      setChatContents((prev) => [...prev, ...newChatContents]);
    }

    containerRef.current.classList.replace("hidden", "special-flex");
    thinkingRef.current.classList.replace("flex", "hidden");
  }

  return (
    <div className="flex flex-col h-full">
      <div ref={thinkingRef} className="hidden items-center max-w-[1000px] m-auto h-full overflow-y-scroll">
        <div>Thinking...</div>
      </div>
      <div ref={containerRef} className="special-flex max-w-[1000px] m-auto h-full overflow-y-scroll">
        {chatContents.map((obj, index) => {
          if (obj.tag === "h6") {
            if (index === 0) {
              return (
                <p className="text-5xl" key={index}>
                  {obj.text}
                </p>
              );
            } else {
              return (
                <p className="text-5xl mt-[20px]" key={index}>
                  {obj.text}
                </p>
              );
            }
          } else if (obj.text === "") {
            return (
              <p key={index} className="mt-[20px]">
                {obj.text}
              </p>
            );
          } else {
            return (
              <p key={index} dangerouslySetInnerHTML={{ __html: obj.text }} />
            );
          }
        })}
      </div>
      <div className="flex-none h-[80px]">
        <div className="flex gap-1 justify-center">
          <details className="dropdown dropdown-top">
            <summary className="btn">Google AI</summary>
            <ul className="menu dropdown-content bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm">
              <li>
                <a>Google AI</a>
              </li>
            </ul>
          </details>
          <input
            type="password"
            className="input w-[140px]"
            required
            placeholder="Enter an API Key"
            onChange={(e) => setApiKey(e.target.value)}
            value={apiKey}
          />
          <input
            type="text"
            className="input"
            required
            placeholder="Enter a Prompt"
            onChange={(e) => setPrompt(e.target.value)}
            value={prompt}
          />
          <button type="submit" className="btn" onClick={(e) => main()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
