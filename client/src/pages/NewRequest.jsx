import bow from "../assets/bows/bow.png";
import balloons from "../assets/balloons/balloons.png";
import { Link } from "react-router-dom";

export default function NewRequest() {
  return (
    <div className="min-h-screen w-full bg-[#f2d9db]" >
       {/* HEADER  */}
       <header className ="bg-[#ebbbc5] py-6">
       <div className="mx-auto  max-w-[1440px]" >
       
          <div className="flex h-20 items-center justify-between px-6">
            <div className="flex items-center gap-6 ">
             <img src={bow} alt="" className="h-8 w-8" draggable="false" />

             <h1 className=" font-serifDisplay text-5xl font-normal leading-[0.95] tracking-tight text-[#a6ba4c]">
              PapaPay
             </h1>

          <img src={bow} alt="" className="h-8 w-8" draggable="false" />
         </div>

         <Link
           to="/dad-login"
           className="inline-flex items-center rounded-full border-2 border-[#a6ba4c] bg-[#f7f0e6] px-4 py-1.5 text-sm font-semibold text-[#6f7f2a] shadow-[0_2px_0_rgba(0,0,0,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_4px_0_rgba(0,0,0,0.08)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a6ba4c]/50"
         >
           Dad Login -&gt;
         </Link>
        </div>
        </div>
        </header>


       {/* CONTAINER */}
       <main className=" p-4 md:p-6">
         <div className="mx-auto w-full max-w-[1440px] rounded-[28px] bg-[#f2d9db] px-6 py-6 shadow-sm md:px-10">
           {/* 2-column layout  */}
           <div className="grid grid-cols-1 gap-16 lg:grid-cols-[560px_1fr]">
            {/* LEFT: form */}
             <section>
            <h2 className=" font-serifDisplay text-6xl font-normal leading-none text-[#eaa3a2]">
              New Request
            </h2>

            <p className="mt-4 text-lg text-[#c09086]">
              Fill out the details to request money from Dad :
            </p>

            <form className="mt-10 space-y-7">
              <Field label="Requester">
                <input className={inputClass} placeholder="e.g., Niama" />
              </Field>

              <Field label="Reason">
                <input className={inputClass} placeholder="One short sentence" />
              </Field>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Field label="Amount">
                  <input type="number" className={inputClass} placeholder="25" />
                </Field>

                <Field label="Dad’s mood">
                  <input
                    className={inputClass}
                    placeholder="generous / grumpy..."
                  />
                </Field>
              </div>

              <Field label="Pitch">
                <textarea
                  rows={5}
                  className={`${inputClass} resize-none`}
                  placeholder="Make it persuasive (and funny)."
                />
              </Field>

              <Field label="Repay Plan">
                <input
                  className={inputClass}
                  placeholder="e.g., pay back next Friday"
                />
              </Field>

              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  className="w-64 rounded-2xl bg-[#aab44a] py-3.5 text-base font-semibold text-white shadow-sm transition hover:opacity-90"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </section>

          {/* RIGHT: tips + decoration area */}
          <aside className="relative pt-16">
            <h3 className="text-3xl font-semibold text-[#3e8440]">
              Tips for a Great Request :
            </h3>

            <ul className="mt-10 space-y-10 text-xl text-[#badd7f]">
              <li className="flex gap-4">
                <span>💡</span>
                <span>Keep your request short and clear.</span>
              </li>
              <li className="flex gap-4">
                <span>🎀</span>
                <span>Explain why you need the money in one sentence.</span>
              </li>
              <li className="flex gap-4">
                <span>😂</span>
                <span>A touch of humor makes your request more convincing</span>
              </li>
              <li className="flex gap-4">
                <span>💸</span>
                <span>Show you have a realistic repayment plan.</span>
              </li>
            </ul>

            <div className="relative mt-14 h-[520px] w-full overflow-hidden rounded-3xl">
              <img
                src={balloons}
                alt=""
                className="pointer-events-none absolute right-80 bottom-0 w-[120px] opacity-85"
                draggable="false"
              />

              <img
                src={balloons}
                alt=""
                className="pointer-events-none absolute right-0 top-0 w-[110px] opacity-85"
                draggable="false"
              />
            </div>
          </aside>
        </div>
      </div>
      </main>
    </div>
  );
}

const inputClass =
  "w-full rounded-2xl border-2 border-[#bad07f]/60 bg-white px-5 py-4 text-[15px] text-[#eaa3a2]/60 placeholder:text-[#eaa3a2]/60 outline-none transition focus:border-[#bad07f] focus:ring-4 focus:ring-[#bad07f]/20";

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-lg font-semibold text-[#eaa3a2]">{label}</div>
      {children}
    </label>
  );
}











