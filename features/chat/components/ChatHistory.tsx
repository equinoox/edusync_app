'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/providers/ThemeProvider';
import type { ChatSession } from '../types';
import { getSessions, deleteSession, renameSession } from '../actions/chat-history.actions';
import { TrashIcon, PencilIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ChatHistoryProps {
  currentSessionId?: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  refreshKey?: number;
}

export function ChatHistory({
  currentSessionId,
  onSelectSession,
  onNewChat,
  refreshKey = 0,
}: ChatHistoryProps) {
  const { darkMode } = useTheme();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    loadSessions();
  }, [refreshKey]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await getSessions();
      setSessions(data);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this chat?')) {
      try {
        await deleteSession(sessionId);
        setSessions(sessions.filter(s => s.id !== sessionId));
        if (currentSessionId === sessionId) {
          onNewChat();
        }
      } catch (error) {
        console.error('Failed to delete session:', error);
      }
    }
  };

  const handleRename = async (sessionId: string) => {
    if (!editTitle.trim()) return;
    try {
      await renameSession(sessionId, editTitle);
      setSessions(
        sessions.map(s =>
          s.id === sessionId ? { ...s, title: editTitle } : s
        )
      );
      setEditingId(null);
    } catch (error) {
      console.error('Failed to rename session:', error);
    }
  };

  return (
    <div
      className={`w-80 border-l flex flex-col h-full transition-colors duration-300 ${
        darkMode
          ? 'bg-slate-900 border-slate-700'
          : 'bg-slate-200 border-gray-200'
      }`}
    >
      {/* Header */}
      <div className={`p-4 shrink-0 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
        <button
          onClick={onNewChat}
          className={`w-full py-2 px-4 rounded-lg font-medium transition-colors duration-300 ${
            darkMode
              ? 'bg-violet-600 text-white hover:bg-violet-700'
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          + New Chat
        </button>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className={`p-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Loading...
          </div>
        ) : sessions.length === 0 ? (
          <div className={`p-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No chats yet
          </div>
        ) : (
          <div className="space-y-2 p-4">
            {sessions.map(session => (
              <div
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`p-3 rounded-lg cursor-pointer group transition-all duration-300 ${
                  currentSessionId === session.id
                    ? darkMode
                      ? 'bg-violet-600/20 border border-violet-500'
                      : 'bg-indigo-50 border border-indigo-300'
                    : darkMode
                    ? 'hover:bg-slate-800 border border-transparent'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
              >
                {editingId === session.id ? (
                  <div className="flex gap-2">
                    <input
                      autoFocus
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className={`flex-1 px-2 py-1 rounded text-sm ${
                        darkMode
                          ? 'bg-slate-700 text-white border-slate-600'
                          : 'bg-white text-slate-900 border-gray-300'
                      } border`}
                    />
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleRename(session.id);
                      }}
                      className={`p-1 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                      className={`p-1 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm font-medium truncate ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                        {session.title}
                      </h3>
                      <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {session.preview}
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setEditingId(session.id);
                          setEditTitle(session.title);
                        }}
                        className={`p-1 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={e => handleDelete(session.id, e)}
                        className={`p-1 rounded ${darkMode ? 'hover:bg-red-900/20 text-red-400' : 'hover:bg-red-50 text-red-600'}`}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
