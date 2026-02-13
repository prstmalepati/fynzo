import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-100">
      
      {/* Top Bar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-teal-700">Fynzo</h1>
        <Link
          to="/onboarding"
          className="text-sm font-semibold text-teal-700 hover:underline"
        >
          Get Started
        </Link>
      </header>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-24 text-center">
        <h2 className="text-5xl font-bold text-slate-800 leading-tight">
          See your future wealth.<br />
          <span className="text-teal-700">Make better decisions today.</span>
        </h2>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto">
          Fynzo projects your net worth, FIRE progress, and financial path —
          so you can plan with confidence, not guesswork.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            to="/onboarding"
            className="px-8 py-4 rounded-xl bg-teal-600 text-white font-semibold shadow-lg hover:bg-teal-700 transition"
          >
            Start your plan
          </Link>

          <Link
            to="/overview"
            className="px-8 py-4 rounded-xl bg-white text-teal-700 font-semibold shadow hover:bg-teal-50 transition"
          >
            View demo
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 pb-24 grid md:grid-cols-3 gap-8">
        {[
          {
            title: "Connect your finances",
            text: "Add accounts, income, expenses, and goals in minutes."
          },
          {
            title: "Project your future",
            text: "See how your net worth grows over time with realistic assumptions."
          },
          {
            title: "Decide with clarity",
            text: "Understand trade-offs, FIRE timelines, and next best actions."
          }
        ].map((step, i) => (
          <div key={i} className="card text-center">
            <h3 className="text-xl font-bold text-slate-800">
              {step.title}
            </h3>
            <p className="mt-3 text-slate-600">
              {step.text}
            </p>
          </div>
        ))}
      </section>

      {/* Call to action */}
      <section className="bg-teal-700 py-16 text-center">
        <h3 className="text-3xl font-bold text-white">
          Your financial future deserves clarity
        </h3>
        <p className="mt-4 text-teal-100">
          Start building a plan you actually understand.
        </p>
        <Link
          to="/onboarding"
          className="inline-block mt-8 px-10 py-4 rounded-xl bg-white text-teal-700 font-semibold shadow hover:bg-teal-50 transition"
        >
          Start planning
        </Link>
      </section>

      {/* Footer */}
      <footer className="text-center py-6 text-sm text-slate-500">
        © {new Date().getFullYear()} Fynzo · Built for long-term thinking
      </footer>
    </div>
  );
}
