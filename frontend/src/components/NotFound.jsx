import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-screen bg-[#0a1628] flex flex-col items-center justify-center px-4 relative overflow-hidden">

      {/* Background decorative circles */}
      <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#0f6e56]/5 pointer-events-none" />
      <div className="absolute -bottom-32 -right-20 w-96 h-96 rounded-full bg-[#1D9E75]/5 pointer-events-none" />

      {/* Big 404 */}
      <p className="text-[#1D9E75]/10 text-[160px] font-bold leading-none select-none tracking-tight mb-2">
        404
      </p>

      {/* Content */}
      <div className="flex flex-col items-center gap-4 -mt-8 relative z-10">

        {/* Icon */}
        <div className="w-14 h-14 rounded-full bg-[#0d1b2a] border border-[#1a3a4a] flex items-center justify-center">
          <span className="text-[#1D9E75] text-2xl">⊘</span>
        </div>

        <div className="text-center">
          <h1 className="text-[#e8f4f8] text-2xl font-bold tracking-tight mb-2">
            Page not found
          </h1>
          <p className="text-[#2a5a6e] text-sm leading-relaxed max-w-xs">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <button
          onClick={() => navigate("/feed")}
          className="mt-2 bg-[#0f6e56] hover:bg-[#0d5f4a] active:scale-[0.98] text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all shadow-lg shadow-[#0f6e56]/20"
        >
          Back to Feed →
        </button>
      </div>

    </div>
  );
};

export default NotFound;