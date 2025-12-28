import { GoogleGenAI } from "@google/genai";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function AI() {
  const [apiKey, setApiKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [fullResponseText, setFullResponseText] = useState("");
  const thinkingRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [fullResponseText]);

  async function handleSubmit(e) {
    e.preventDefault();

    if (apiKey.trim() === "" || prompt.trim() === "") {
      return;
    }

    //Show thinking div
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
            newText += "\n\n";
          }
          continue;
        }

        newText += text;
      }

      console.log(newText);

      if (fullResponseText === "") {
        setFullResponseText("### " + prompt + "\n\n" + newText);
      } else {
        setFullResponseText(
          (prevText) => prevText + " \n\n### " + prompt + "\n\n" + newText
        );
      }

      setPrompt("");
    } catch (e) {
      if (fullResponseText === "") {
        setFullResponseText("## There was an error: \n\n" + newText);
      } else {
        setFullResponseText(
          (prevText) => prevText + " \n\n## There was an error: \n\n" + newText
        );
      }
    }

    //Hide thinking
    containerRef.current.classList.replace("hidden", "special-flex");
    thinkingRef.current.classList.replace("flex", "hidden");
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={thinkingRef}
        className="hidden items-center max-w-[1000px] m-auto h-full overflow-y-scroll"
      >
        <div>Thinking...</div>
      </div>
      <div
        ref={containerRef}
        className="special-flex max-w-[1000px] m-auto h-full overflow-y-scroll"
      >
        <ReactMarkdown
          components={{
            code(props) {
              const { children, className, node, ...rest } = props;
              const match = /language-(\w+)/.exec(className || "");

              return match ? (
                <>
                  <SyntaxHighlighter
                    {...rest}
                    children={String(children).replace(/\n$/, "")}
                    language={match[1]}
                    style={dracula}
                    PreTag={({ ...props }) => {
                      return (
                        <div {...props}>
                          <div className="code-header flex">
                            <div className="inline-block text-left w-full">
                              {match[1]}
                            </div>
                            <div className="inline-block text-right w-full ">
                              <button
                                type="button"
                                className="btn"
                                onClick={(e) => {
                                    const button = e.target;
                                    navigator.clipboard.writeText(String(children).replace(/\n$/, ""));
                                    button.innerHTML = "Copied";
                                    setTimeout(() => {
                                        button.innerHTML = "Copy";
                                    }, 1000);
                                }}
                              >
                                Copy
                              </button>
                            </div>
                          </div>
                          {children}
                        </div>
                      );
                    }}
                  />
                </>
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              );
            },
          }}
        >
          {fullResponseText}
        </ReactMarkdown>
      </div>
      <form onSubmit={handleSubmit}>
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
            <button type="submit" className="btn">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
