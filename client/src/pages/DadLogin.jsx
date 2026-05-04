import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import bow from "../assets/bows/bow.png";
import tape from "../assets/tape/tape.png"; 
import totoro from "../assets/totoro/totoro.png"; 

export default function DadLogin({ onSuccess }) {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/dad/me", {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          navigate("/dad-dashboard", { replace: true });
        }
      })
      .catch(() => {});
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!code.trim()) {
      setError("Please enter the admin code.");
      return;
    }

    try {
      setLoading(true);

    
      // POST /api/admin/
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({  code }),
      });

      if (!res.ok) {
        setError("Invalid admin code. Please try again.");
        setLoading(false);
        return;
      }

      setLoading(false);
      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/dad-dashboard", { replace: true });
      }
    } catch (err) {
      setLoading(false);
      setError("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen w-full bg-[#f2d9db]">
      {/* desktop frame hint (1440x1024) */}
      <div className="mx-auto min-h-screen w-full max-w-[1440px]">
        {/* NAVBAR */}
        <header className="bg-[#ebbbc5] py-6">
            <div className="mx-auto  max-w-[1440px]" >
              <div className="flex h-20 items-center justify-start ">
                <div className="flex items-center gap-6 ">
                  <img
                    src={bow}
                  alt=""
                 className="h-8 w-8 "
                  draggable="false"
                />

                 <h1 className="font-serifDisplay text-5xl font-normal leading-[0.95] tracking-tight text-[#a6ba4c]">
                    PapaPay
                </h1>

                <img
                   src={bow}
                   alt=""
                   className=" h-8 w-8 "
                  draggable="false"
            />
          </div>
          </div>
          </div>
        </header>

        
        

        {/* MAIN */}
        <main className="relative mx-auto flex min-h-[calc(100vh-110px)] max-w-[1200px] items-start justify-center px-6 pt-20">
          {/* LOGIN CARD */}
          <section className="relative w-full max-w-[820px] rounded-2xl bg-[#f7f0e6] px-16 py-14 shadow-[0_6px_0_rgba(215,205,160,0.55)]">
             
              {/* Top Right Tape */}
             <img
          src={tape}
          alt=""
          draggable="false"
          className="pointer-events-none absolute left-[96%] top-[-3%] w-[70px] rotate-45 opacity-95"
             />

              {/* Bottom left Tape */}
             <img
          src={tape}
          alt=""
          draggable="false"
          className="pointer-events-none absolute left-[-3%] top-[96%] w-[70px] rotate-[225deg] opacity-95"
             />


            <h2 className=" font-serifDisplay text-6xl font-normal tracking-tight text-[#a6ba4c]">
              Dad Login
            </h2>

            <p className="mt-8 max-w-[520px] text-[15px] font-semibold text-[#c09086]">
              Enter the admin code to review and manage requests :
            </p>

            <form onSubmit={handleSubmit} className="mt-10">
              

              <Field label="Admin code">
            <input
              value={code}
             onChange={(e) => setCode(e.target.value)}
             placeholder="Enter admin code"
             className={inputClass}
             />
             </Field>


              {/* ERROR */}
              <div className="mt-3 min-h-[18px] text-sm text-[#eaa3a2]">
                {error ? error : ""}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 inline-flex h-10 items-center justify-center rounded-xl bg-[#a6ba4c] px-10 text-sm font-semibold text-white shadow-[0_2px_0_rgba(0,0,0,0.08)] transition active:translate-y-[1px] disabled:opacity-70"
              >
                {loading ? "Logging in ..." : "Login"}
              </button>

              <p className="mt-10 text-sm text-[#eaa3a2]">
                Forgot your admin code? Contact your daughter 🙂{" "}
              </p>
            </form>
          </section>

          {/* bottom-right sticker */}
          <img
            src={totoro}
            alt=""
            draggable="false"
            className="pointer-events-none absolute bottom-6 right-10 w-[120px] opacity-95"
          />
        </main>
      </div>
    </div>
  );
}

const inputClass =
  "w-[260px] rounded-2xl border-2 border-[#bad07f]/60 bg-white px-5 py-4 text-[15px] text-[#CFD78C] placeholder:text-[#eaa3a2]/60 outline-none transition focus:border-[#bad07f] focus:ring-4 focus:ring-[#bad07f]/20";


  function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-[15px] font-semibold text-[#c09086]">
        {label}
      </div>
      {children}
    </label>
  );
}


