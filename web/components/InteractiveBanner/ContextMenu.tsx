import { useRef } from "react";
import { motion } from "motion/react";
import { GrFormUpload } from "react-icons/gr";

interface ContextMenuProps {
  xPercent: number;
  yPx: number;
  width: number;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart?: (e: React.TouchEvent) => void;
  onUploadImage: (file: File) => void;
}

const ContextMenu = ({
  xPercent,
  yPx,
  width,
  onMouseDown,
  onTouchStart,
  onUploadImage,
}: ContextMenuProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const buttonClass =
    "cursor-pointer rounded-lg p-2 text-left block w-full transition delay-150 duration-200 ease-in-out hover:-translate-y-[2px] hover:scale-[1.03] hover:bg-gray-100";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUploadImage(file);
    }
  };

  return (
    <div
      className="absolute bg-white rounded-lg z-50 shadow-lg"
      style={{
        left: `${xPercent}%`,
        top: `${yPx}px`,
        transform: `translateX(calc(-100% - ${width}px / 2 - 15px))`,
      }}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col bg-white border-1 border-gray-200 p-1 rounded-lg text-[10px] font-space-mono gap-1 items-center"
      >
        <button
          className={buttonClass}
          onClick={() => fileInputRef.current?.click()}
        >
          <GrFormUpload className="inline" size={16} /> Upload Image
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      </motion.div>
    </div>
  );
};

export default ContextMenu;
