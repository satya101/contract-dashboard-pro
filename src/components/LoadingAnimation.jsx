import React from "react";

export default function LoadingAnimation({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2">
        <span className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-3 h-3 rounded-full bg-blue-600 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-3 h-3 rounded-full bg-blue-600 animate-bounce" />
      </div>
      <div className="mt-3 text-sm text-gray-600">{label}</div>
    </div>
  );
}