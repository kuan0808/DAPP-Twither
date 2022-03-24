import { useRef, useState } from "react";
import {
  CalendarIcon,
  ChartBarIcon,
  EmojiHappyIcon,
  PhotographIcon,
  XIcon,
} from "@heroicons/react/outline";
import clsx from "clsx";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";

const Input = () => {
  const [input, setInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [showEmojis, setShowEmojis] = useState(false);
  const [loading, setLoading] = useState(false);
  const filePickerRef = useRef(null);
  const textAreaRef = useRef(null);

  const addImageToPost = (e) => {
    const reader = new FileReader();
    if (e.target.files.length) {
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setSelectedFile(reader.result);
      };
    }
  };
  console.log(selectedFile);
  const addEmoji = (e) => {
    let sym = e.unified.split("-");
    let codesArray = [];
    sym.forEach((el) => codesArray.push("0x" + el));
    let emoji = String.fromCodePoint(...codesArray);
    // Insert emoji into textarea at the current cursor position
    let cursorPosition = textAreaRef.current.selectionStart;
    let input_arr = Array.from(input);
    input_arr.splice(cursorPosition, 0, emoji);
    let result = input_arr.join("");
    setInput(result);
  };

  const sendPost = () => {
    if (loading) return;
    setLoading(true);
    setShowEmojis(false);
    // TODO: Tweet to blockchain
    // =========================
    setTimeout(() => {
      setLoading(false);
      setInput("");
      setSelectedFile(null);
    }, 3000);
  };

  return (
    <div
      className={clsx(
        "border-b border-gray-700 p-3 flex space-x-3 overflow-y-scroll scrollbar-hide",
        { "opacity-60": loading }
      )}
    >
      <img
        className="h-11 w-11 rounded-full object-cover cursor-pointer"
        src="data:image/jpeg;base64,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"
        alt=""
      />
      <div className="w-full divide-y divide-gray-700">
        {/* TODO: Make a spinner while loading */}
        <div className={clsx({ "pb-7": selectedFile, "space-y-2.5": input })}>
          <textarea
            className="bg-transparent outline-none text-[#d9d9d9] text-lg placeholder-gray-500 tracking-wide w-full min-h-[50px]"
            value={input}
            rows="2"
            placeholder="What's happening?"
            onChange={(e) => setInput(e.target.value)}
            ref={textAreaRef}
          />
          {selectedFile && (
            <div className="relative">
              <div
                onClick={() => setSelectedFile(null)}
                className="absolute w-8 h-8 bg-[#15181c] hover:bg-[#272c26] bg-opacity-75
              rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
              >
                <XIcon className="h-5 text-white" />
              </div>
              <img
                className="rounded-2xl max-h-80 object-contain"
                src={selectedFile}
                alt=""
              />
            </div>
          )}
        </div>
        {!loading && (
          <div className="flex items-center justify-between pt-2.5">
            <div className="flex items-center">
              <div
                className="icon"
                onClick={() => filePickerRef.current.click()}
              >
                <PhotographIcon className="h-[22px] text-[#1d9bf0]" />
                <input
                  type="file"
                  hidden
                  onChange={addImageToPost}
                  ref={filePickerRef}
                />
              </div>
              <div className="icon rotate-90">
                <ChartBarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>
              <div
                className="icon"
                onClick={() => setShowEmojis((prev) => !prev)}
              >
                <EmojiHappyIcon className="text-[#1d9bf0] h-[22px]" />
              </div>
              <div className="icon">
                <CalendarIcon className="text-[#1d9bf0] h-[22px]" />
              </div>
              {showEmojis && (
                <Picker
                  onSelect={addEmoji}
                  style={{
                    position: "absolute",
                    marginTop: "465px",
                    marginLeft: -40,
                    maxWidth: "320px",
                    borderRadius: "20px",
                  }}
                  theme="dark"
                />
              )}
            </div>
            <button
              className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
              disabled={!input.trim() && !selectedFile}
              onClick={sendPost}
            >
              Tweet
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Input;
