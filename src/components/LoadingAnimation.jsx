import React from 'react';

export default function LoadingAnimation() {
  return (
    <div className="mt-10 flex flex-col items-center gap-3 text-gray-700">
      <div className="flex gap-2">
        <span className="h-3 w-3 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.2s]"></span>
        <span className="h-3 w-3 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.1s]"></span>
        <span className="h-3 w-3 rounded-full bg-blue-600 animate-bounce"></span>
      </div>
      <div className="text-sm">Uploading & processing your contract…</div>
      <div className="w-48 h-1 bg-gray-200 overflow-hidden rounded">
        <div className="h-full w-1/2 bg-blue-500 animate-[move_1.4s_linear_infinite]"></div>
      </div>
      <style>{`@keyframes move {0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
    </div>
  );
}
