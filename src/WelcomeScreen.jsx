export default function WelcomeScreen({ onEnter }) {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-8">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up {
          opacity: 0;
          animation: fadeUp 1s ease forwards;
        }
      `}</style>

      <div className="flex flex-col items-center text-center flex-1 justify-center">
        <div className="fade-up text-5xl mb-8 tracking-widest" style={{ animationDelay: '0.3s' }}>
          ⛩️ <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72/1f1ef-1f1f5.png" alt="Japan flag" width="48" height="48" style={{ display: 'inline', verticalAlign: 'middle' }} /> 🗼
        </div>

        <p
          className="fade-up text-base text-gray-400 mb-2 tracking-wide"
          style={{ animationDelay: '0.9s' }}
        >
          Welcome to 
        </p>

        <h1
          className="fade-up text-4xl font-black text-black leading-tight"
          style={{ animationDelay: '1.5s' }}
        >
          Tokyo Ward Finder
        </h1>

        <p
          className="fade-up text-sm text-gray-400 mt-5 leading-relaxed max-w-xs"
          style={{ animationDelay: '2.2s' }}
        >
          Explore Tokyo's 23 wards, ranked by parks, museums, temples, and nightlife.
        </p>
      </div>

      <div
        className="fade-up w-full max-w-xs pb-14"
        style={{ animationDelay: '3s' }}
      >
        <button
          onClick={onEnter}
          className="w-full py-4 rounded-2xl bg-black text-white font-bold text-base tracking-wide active:scale-95 transition-transform duration-100"
        >
          Explore Tokyo →
        </button>
      </div>
    </div>
  );
}
