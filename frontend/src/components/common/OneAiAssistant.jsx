import React, { useEffect, useRef, useState } from 'react';
import { Icon } from '../icons/Icon';
import { Orb3dDots } from './Orb3dDots';
import { assistantApi } from '../../services/assistantApi';
import { voiceApi } from '../../services/voiceApi';

const prompts = [
  'Find roles that suit me',
  'Improve my resume',
  'Prepare for an interview',
];

export const OneAiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [voiceError, setVoiceError] = useState('');
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const processRecordingRef = useRef(false);
  const audioRef = useRef(null);
  const audioUrlRef = useRef(null);
  const sessionIdRef = useRef(null);

  useEffect(() => () => {
    processRecordingRef.current = false;
    if (mediaRecorderRef.current?.state === 'recording') mediaRecorderRef.current.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    audioRef.current?.pause();
    if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
  }, []);

  const stopVoiceInput = (processRecording = true) => {
    processRecordingRef.current = processRecording;
    const recorder = mediaRecorderRef.current;
    mediaRecorderRef.current = null;
    setIsListening(false);
    if (recorder?.state === 'recording') recorder.stop();
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  };

  const startVoiceInput = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setVoiceError('Audio recording is not supported in this browser.');
      return;
    }

    setVoiceError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : undefined;
      const recorder = preferredType
        ? new MediaRecorder(stream, { mimeType: preferredType })
        : new MediaRecorder(stream);
      const audioChunks = [];
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      processRecordingRef.current = true;
      recorder.ondataavailable = (event) => {
        if (event.data.size) audioChunks.push(event.data);
      };
      recorder.onerror = () => {
        setVoiceError('Microphone recording failed. Please try again.');
        stopVoiceInput(false);
      };
      recorder.onstop = async () => {
        const shouldProcess = processRecordingRef.current;
        processRecordingRef.current = false;
        stream.getTracks().forEach((track) => track.stop());
        if (!shouldProcess) return;
        const audioBlob = new Blob(audioChunks, { type: recorder.mimeType || 'audio/webm' });
        if (!audioBlob.size) {
          setVoiceError('No audio was recorded. Tap the mic and try again.');
          return;
        }

        setIsSending(true);
        try {
          const transcription = await voiceApi.transcribe(audioBlob);
          setMessage(transcription.text);
          await sendMessage(transcription.text, { speakReply: true });
        } catch (error) {
          setVoiceError(error.message || 'oneAi could not process the recording.');
        } finally {
          setIsSending(false);
        }
      };
      recorder.start();
      setIsListening(true);
    } catch (error) {
      setIsListening(false);
      setVoiceError(error.name === 'NotAllowedError'
        ? 'Allow microphone access to use oneAi voice.'
        : 'The microphone could not start. Please try again.');
    }
  };

  const sendMessage = async (text, { speakReply = false } = {}) => {
    const trimmedMessage = text.trim();
    if (!trimmedMessage || isSending) return;
    if (mediaRecorderRef.current) stopVoiceInput(false);

    const userMessageId = `${Date.now()}-user`;
    const assistantMessageId = `${Date.now()}-assistant`;
    setMessages((currentMessages) => [
      ...currentMessages,
      { id: userMessageId, sender: 'user', text: trimmedMessage },
      { id: assistantMessageId, sender: 'assistant', text: 'Thinking...' },
    ]);
    setMessage('');
    setIsListening(false);
    setIsSending(true);

    try {
      if (!sessionIdRef.current) {
        const session = await assistantApi.createSession();
        if (!session.sessionId) throw new Error('Could not start a oneAi chat session.');
        sessionIdRef.current = session.sessionId;
      }

      const response = await assistantApi.sendMessage(sessionIdRef.current, trimmedMessage);
      setMessages((currentMessages) => currentMessages.map((chatMessage) => (
        chatMessage.id === assistantMessageId
          ? { ...chatMessage, text: response.reply || 'oneAi did not return a reply.' }
          : chatMessage
      )));
      if (speakReply && response.reply) {
        try {
          const audioBlob = await voiceApi.speak(response.reply);
          if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
          const audioUrl = URL.createObjectURL(audioBlob);
          audioUrlRef.current = audioUrl;
          setMessages((currentMessages) => currentMessages.map((chatMessage) => (
            chatMessage.id === assistantMessageId
              ? { ...chatMessage, audioUrl }
              : chatMessage
          )));
          const audio = new Audio(audioUrl);
          audioRef.current = audio;
          audio.onended = () => {
            audioRef.current = null;
          };
          await audio.play();
        } catch {
          setVoiceError('oneAi replied. Use the audio controls to play the local voice reply.');
        }
      }
    } catch (error) {
      setMessages((currentMessages) => currentMessages.map((chatMessage) => (
        chatMessage.id === assistantMessageId
          ? { ...chatMessage, text: error.message || 'oneAi could not be reached. Please try again.' }
          : chatMessage
      )));
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(message);
  };

  return (
    <div className="one-ai-assistant">
      {isOpen && (
        <section className="one-ai-panel" role="dialog" aria-modal="false" aria-label="oneAi assistant">
          <header className={`one-ai-header ${isListening ? 'is-listening' : ''}`}>
            <div className="one-ai-title">
              <span className="one-ai-mark"><Icon name="sparkles" size={17} strokeWidth={2.4} /></span>
              <div>
                <strong>oneAi</strong>
                <span className="one-ai-status">{isListening ? 'Voice mode is listening' : 'Your career copilot'}</span>
              </div>
            </div>
            <button className="one-ai-icon-button" type="button" onClick={() => { stopVoiceInput(false); setIsOpen(false); }} aria-label="Close oneAi">
              <Icon name="close" size={18} />
            </button>
          </header>

          <div className="one-ai-content" aria-live="polite">
            {isListening ? (
              <div className="one-ai-voice-stage" aria-hidden="true">
                <Orb3dDots className="one-ai-voice-orb" spacing={15} hoverRadius={150} active />
                <span className="one-ai-voice-caption">Listening</span>
              </div>
            ) : messages.length === 0 ? (
              <>
                <p className="one-ai-greeting">Hi, I’m oneAi. How can I help with your career today?</p>
                <div className="one-ai-prompts">
                  {prompts.map((prompt) => (
                    <button key={prompt} type="button" onClick={() => sendMessage(prompt)} disabled={isSending}>{prompt}</button>
                  ))}
                </div>
              </>
            ) : (
              <div className="one-ai-messages">
                {messages.map((chatMessage) => (
                  <div key={chatMessage.id} className={`one-ai-message one-ai-message-${chatMessage.sender}`}>
                    <p className="one-ai-message-text">{chatMessage.text}</p>
                    {chatMessage.audioUrl && (
                      <audio
                        className="one-ai-message-audio"
                        controls
                        preload="none"
                        src={chatMessage.audioUrl}
                        aria-label="Play oneAi voice reply"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form className="one-ai-composer" onSubmit={handleSubmit}>
            {voiceError && <p className="one-ai-voice-error" role="alert">{voiceError}</p>}
            {isListening && (
              <div className="one-ai-listening" role="status">
                <span /><span /><span /> Listening…
              </div>
            )}
            <div className="one-ai-input-row">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder={isListening ? 'Listening…' : 'Ask oneAi anything…'}
                aria-label="Message oneAi"
                disabled={isSending}
              />
              <button
                className={`one-ai-voice-button ${isListening ? 'is-listening' : ''}`}
                type="button"
                onClick={() => { if (isListening) stopVoiceInput(true); else startVoiceInput(); }}
                aria-label={isListening ? 'Stop oneAi voice assistant' : 'Start oneAi voice assistant'}
                aria-pressed={isListening}
                disabled={isSending}
              >
                <Icon name="mic" size={18} />
              </button>
              <button className="one-ai-send-button" type="submit" aria-label="Send message" disabled={!message.trim() || isSending}>
                <Icon name="send" size={17} />
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        className={`one-ai-toggle ${isOpen ? 'is-open' : ''}`}
        type="button"
        onClick={() => { if (isOpen) stopVoiceInput(false); setIsOpen((open) => !open); }}
        aria-label={isOpen ? 'Close oneAi assistant' : 'Open oneAi assistant'}
        aria-expanded={isOpen}
      >
        <Icon name={isOpen ? 'close' : 'sparkles'} size={20} strokeWidth={2.5} />
        <span>oneAi</span>
      </button>
    </div>
  );
};
