"use client";

import { useState } from "react";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  LoaderCircle,
  Send,
  ShieldCheck,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { useNexus } from "@/components/nexus-context";
import { ProgressBar, StatusPill } from "@/components/ui";
import type { CopilotResponse, ViewId } from "@/lib/types";

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  response?: CopilotResponse;
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "I can correlate incidents, deployments, workflows, and costs. Every answer is deterministic, explainable, and limited to this synthetic lab.",
  },
];

const viewIds = new Set<ViewId>([
  "command",
  "incidents",
  "automations",
  "deployments",
  "intelligence",
  "audit",
  "settings",
]);

export function CopilotPanel() {
  const { dispatch, t, setCopilotOpen } = useNexus();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const value = prompt.trim();
    if (!value || status === "loading") return;

    const userMessage: Message = { id: `user-${Date.now()}`, role: "user", text: value };
    setMessages((current) => [...current, userMessage]);
    setPrompt("");
    setStatus("loading");

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt: value }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message ?? "Analysis failed");
      const result = payload.data as CopilotResponse;
      setMessages((current) => [
        ...current,
        {
          id: result.id,
          role: "assistant",
          text: result.summary,
          response: result,
        },
      ]);
      setStatus("idle");
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `error-${Date.now()}`,
          role: "assistant",
          text: error instanceof Error ? error.message : "Analysis failed safely.",
        },
      ]);
      setStatus("error");
    }
  };

  const applyAction = (response: CopilotResponse) => {
    if (response.action.type === "navigate" && response.action.target && viewIds.has(response.action.target as ViewId)) {
      dispatch({ type: "navigate", view: response.action.target as ViewId });
      setCopilotOpen(false);
    }
  };

  return (
    <div className="drawer-backdrop" role="presentation" onMouseDown={(event) => {
      if (event.target === event.currentTarget) setCopilotOpen(false);
    }}>
      <aside className="copilot-panel" role="dialog" aria-modal="true" aria-labelledby="copilot-title">
        <div className="copilot-header">
          <span className="copilot-orb"><Bot size={20} /></span>
          <div><span className="eyebrow">DETERMINISTIC DOMAIN MODEL</span><h2 id="copilot-title">{t.copilot}</h2></div>
          <button type="button" className="icon-button" onClick={() => setCopilotOpen(false)} aria-label={t.close}><X size={17} /></button>
        </div>
        <div className="copilot-boundary">
          <ShieldCheck size={15} />
          <span>Synthetic reasoning only · no external model · no production actions</span>
        </div>
        <div className="copilot-messages" aria-live="polite">
          {messages.map((message) => (
            <article key={message.id} className={`message message-${message.role}`}>
              <span className="message-avatar">{message.role === "assistant" ? <Sparkles size={15} /> : <UserRound size={15} />}</span>
              <div className="message-body">
                <p>{message.text}</p>
                {message.response ? (
                  <div className="reasoning-card">
                    <div className="reasoning-heading">
                      <BrainCircuit size={16} />
                      <div><strong>{message.response.headline}</strong><small>{Math.round(message.response.confidence * 100)}% confidence</small></div>
                      <StatusPill label={message.response.intent} tone="info" />
                    </div>
                    <div className="confidence-bar"><ProgressBar value={message.response.confidence * 100} tone="violet" label="Confidence" /></div>
                    <ol>
                      {message.response.reasoning.map((reason) => <li key={reason}>{reason}</li>)}
                    </ol>
                    {message.response.action.type !== "none" ? (
                      <button type="button" className="button secondary full" onClick={() => applyAction(message.response!)}>
                        {message.response.action.label} <ArrowRight size={15} />
                      </button>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </article>
          ))}
          {status === "loading" ? (
            <article className="message message-assistant">
              <span className="message-avatar"><LoaderCircle size={15} className="spin" /></span>
              <div className="message-body thinking"><i /><i /><i /><span>Correlating synthetic evidence</span></div>
            </article>
          ) : null}
        </div>
        <div className="prompt-suggestions">
          {["Review APAC incident", "Explain cost variance", "Check deployment risk"].map((suggestion) => (
            <button type="button" key={suggestion} onClick={() => setPrompt(suggestion)}>{suggestion}</button>
          ))}
        </div>
        <form className="copilot-form" onSubmit={submit}>
          <label>
            <span className="sr-only">{t.copilotHint}</span>
            <textarea value={prompt} onChange={(event) => setPrompt(event.target.value)} maxLength={500} rows={2} placeholder={t.copilotHint} />
          </label>
          <div className="copilot-form-footer">
            <span>{prompt.length}/500</span>
            <button type="submit" className="button primary small" disabled={!prompt.trim() || status === "loading"}>
              {status === "loading" ? <LoaderCircle size={15} className="spin" /> : status === "error" ? <CheckCircle2 size={15} /> : <Send size={15} />}
              {t.send}
            </button>
          </div>
        </form>
      </aside>
    </div>
  );
}
