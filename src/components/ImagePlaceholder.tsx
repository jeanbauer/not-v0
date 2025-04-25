import { FiImage } from "react-icons/fi";

const ImagePlaceholder = ({
  text = "Placeholder",
  aspect = "aspect-[4/3]",
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 ${aspect} w-full max-w-[300px] max-h-[200px]`}
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        <FiImage className="w-8 h-8 text-slate-400" />
        <div className="text-slate-500 text-sm font-medium">{text}</div>
      </div>
    </div>
  );
};

export default ImagePlaceholder;
