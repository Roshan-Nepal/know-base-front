import React from 'react';
import { Database, Upload, Quote, ShieldCheck, Zap } from 'lucide-react';

interface AuthBannerProps {
  isLogin: boolean;
}

export const AuthBanner: React.FC<AuthBannerProps> = ({ isLogin }) => {
  return (
    <div className={`
      hidden lg:flex flex-col justify-between absolute top-0 bottom-0 left-0 w-1/2 p-12
      transition-transform duration-700 ease-in-out z-0
      ${isLogin ? 'translate-x-0' : 'translate-x-full'}
    `}>
      <div className="transition-opacity duration-500 delay-100 h-full flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 mb-20">
            <div className="h-8 w-8 bg-white rounded flex items-center justify-center">
              <Database className="h-5 w-5 text-black" />
            </div>
            <span className="font-bold text-white text-xl tracking-wide">Know-Base</span>
          </div>
          
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            {isLogin ? (
              <>Your documents,<br />answered.</>
            ) : (
              <>Join the<br />knowledge revolution.</>
            )}
          </h1>
          
          <p className="text-[#a1a1aa] text-lg max-w-md leading-relaxed mb-16">
            {isLogin 
              ? "Upload your notes, code, and PDFs. Ask questions in plain language and get answers grounded in your own knowledge base, with sources cited."
              : "Create an account to build your personal, AI-powered knowledge base. Secure, fast, and entirely private."
            }
          </p>

          <div className="space-y-8">
            {isLogin ? (
              <>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#2563eb]/20 rounded-md">
                    <Upload className="h-5 w-5 text-[#3b82f6]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Upload anything</h3>
                    <p className="text-sm text-[#71717a]">PDF, markdown, code, or plain text</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#16a34a]/20 rounded-md">
                    <Quote className="h-5 w-5 text-[#22c55e]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Cited answers</h3>
                    <p className="text-sm text-[#71717a]">Every response points back to its source</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#d97706]/20 rounded-md">
                    <ShieldCheck className="h-5 w-5 text-[#f59e0b]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Secure & Private</h3>
                    <p className="text-sm text-[#71717a]">Your data is encrypted and isolated</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-[#9333ea]/20 rounded-md">
                    <Zap className="h-5 w-5 text-[#a855f7]" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Lightning Fast</h3>
                    <p className="text-sm text-[#71717a]">Instant semantic search and retrieval</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
