/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, CheckCircle2, ExternalLink, ShieldCheck, X, Sparkles, Send, KeyRound } from 'lucide-react';

export interface DispatchedNotification {
  id: string;
  type: 'email' | 'sms';
  recipient: string;
  subjectOrHeader: string;
  content: string;
  sentAt: string;
  actionToken?: string;
  actionType?: 'verify_email' | 'reset_password';
}

interface EmailSmsPreviewModalProps {
  notifications: DispatchedNotification[];
  onClose: () => void;
  onVerifyEmailAction?: (email: string) => void;
  onResetPasswordAction?: (email: string) => void;
}

export const EmailSmsPreviewModal: React.FC<EmailSmsPreviewModalProps> = ({
  notifications,
  onClose,
  onVerifyEmailAction,
  onResetPasswordAction
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'email' | 'sms'>('all');

  const filtered = notifications.filter(n => activeTab === 'all' || n.type === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn select-none">
      <div className="bg-slate-900 border border-emerald-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-950/60 pb-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-950 text-emerald-400 p-2 rounded-xl border border-emerald-800">
              <Send className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Outbound Email & SMS Dispatch Simulator</h3>
              <p className="text-[10px] text-slate-400">Live preview of carrier SMS and SMTP email notifications</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-slate-800">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex gap-2 shrink-0">
          {[
            { id: 'all', label: 'All Dispatches' },
            { id: 'email', label: 'Emails' },
            { id: 'sms', label: 'SMS Messages' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id 
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                  : 'bg-slate-950 text-slate-400 border border-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dispatch List */}
        <div className="space-y-3 overflow-y-auto custom-scrollbar pr-1 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-500">
              No outbound notifications dispatched yet.
            </div>
          ) : (
            filtered.map((item) => (
              <div 
                key={item.id}
                className={`p-4 rounded-2xl border space-y-2 ${
                  item.type === 'email' 
                    ? 'bg-slate-950/80 border-slate-800' 
                    : 'bg-emerald-950/20 border-emerald-900/40'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {item.type === 'email' ? (
                      <span className="bg-sky-950 text-sky-400 p-1.5 rounded-lg border border-sky-900 flex items-center gap-1 font-bold text-[10px]">
                        <Mail className="h-3.5 w-3.5" /> EMAIL
                      </span>
                    ) : (
                      <span className="bg-emerald-950 text-emerald-400 p-1.5 rounded-lg border border-emerald-900 flex items-center gap-1 font-bold text-[10px]">
                        <MessageSquare className="h-3.5 w-3.5" /> SMS
                      </span>
                    )}
                    <span className="font-bold text-slate-200">{item.recipient}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{item.sentAt}</span>
                </div>

                <h4 className="text-xs font-extrabold text-slate-100">{item.subjectOrHeader}</h4>
                <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 whitespace-pre-wrap">
                  {item.content}
                </p>

                {/* Simulated Verification / Reset Action Button */}
                {item.actionType === 'verify_email' && (
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        onVerifyEmailAction?.(item.recipient);
                        onClose();
                      }}
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Simulate Clicking Email Verification Link</span>
                    </button>
                  </div>
                )}

                {item.actionType === 'reset_password' && (
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        onResetPasswordAction?.(item.recipient);
                        onClose();
                      }}
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
                    >
                      <KeyRound className="h-4 w-4" />
                      <span>Click Password Reset Link</span>
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default EmailSmsPreviewModal;
