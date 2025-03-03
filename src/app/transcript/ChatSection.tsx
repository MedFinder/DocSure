"use client";
import React from "react";

interface ChatSectionProps {
  doctorName: string;
  transcripts: string[] | string;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ doctorName, transcripts }) => {
  // Check if transcripts is an array or a string
  const hasTranscripts = Array.isArray(transcripts) && transcripts.length > 0;
  //const initialMessage = !hasTranscripts || transcripts === "Waiting for conversation to begin...";

  return (
    <aside className="flex flex-col px-7 py-9 w-full rounded bg-sky-600 bg-opacity-10 max-md:px-5 max-md:mt-6 max-md:max-w-full h-full overflow-hidden">
      <p className="self-start text-xs tracking-tight text-zinc-800">
        Calling {doctorName || "Doctor"}…
      </p>
      <div className="flex-1 overflow-y-auto pr-2">
        {/* Initial welcome message */}
        {/* <div className="flex shrink-0 mt-4 bg-white p-3 min-h-[47px] items-center max-md:max-w-full">
          <p className="text-sm text-gray-700">
            Hello, I'm connecting you with {doctorName || "the doctor"}...
          </p>
        </div> */}
        
        {/* Display waiting message if no transcripts */}
        {/* {initialMessage && (
          <div className="flex shrink-0 mt-3 bg-white p-3 min-h-[47px] items-center max-md:max-w-full">
            <p className="text-sm text-gray-700">
              Please hold while the doctor reviews your information.
            </p>
          </div>
        )} */}
        
        {/* Map through transcripts if available */}
        {hasTranscripts && 
          transcripts.map((message, index) => (
            <div key={index} className="flex shrink-0 mt-3 bg-white p-3 min-h-[47px] items-center max-md:max-w-full">
              <p className="text-sm text-gray-700">{message}</p>
            </div>
          ))
        }
      </div>
      <button className="gap-2.5 self-start px-4 py-2.5 mt-6 text-sm tracking-tight text-center text-white bg-slate-400">
        View full chat
      </button>
    </aside>
  );
};
