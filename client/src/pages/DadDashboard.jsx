import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import bow from "../assets/bows/bow.png";

export default function DadDashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRequests() {
      try {
        const res = await fetch("http://localhost:5174/api/requests");

        if (!res.ok) {
          throw new Error("Failed to fetch requests");
        }

        const data = await res.json();
        const normalizedRequests = Array.isArray(data)
          ? data.map((request) => ({
              id: request.id,
              requester: request.requester,
              amount: request.amount,
              reason: request.reason,
              pitch: request.pitch,
              dadsMood: request.dad_mood,
              repayPlan: request.repay_plan,
              status: request.status,
              createdAt: request.created_at,
            }))
          : [];

        setRequests(normalizedRequests);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, []);

  function formatAmount(amount) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(Number(amount) || 0);
  }

  return (
    <div className="min-h-screen w-full bg-[#f2d9db]">
      {/* desktop frame hint (1440x1024) */}
      <div className="mx-auto min-h-screen w-full max-w-[1440px]">
        {/* NAVBAR */}
        <header className="bg-[#ebbbc5] py-6">
          <div className="mx-auto max-w-[1440px] px-10">
            <div className="flex h-20 items-center justify-between">
              <div className="flex items-center gap-6">
                <img
                  src={bow}
                  alt=""
                  className="h-8 w-8"
                  draggable="false"
                />

                <h1 className="font-serifDisplay text-5xl font-normal leading-[0.95] tracking-tight text-[#a6ba4c]">
                  PapaPay
                </h1>

                <img
                  src={bow}
                  alt=""
                  className="h-8 w-8"
                  draggable="false"
                />
              </div>

              <button
                type="button"
                className="rounded-xl border-2 border-[#a6ba4c] bg-[#f2d9db] px-10 py-3 font-serifDisplay text-2xl text-[#a6ba4c] shadow-sm transition hover:brightness-95 active:scale-[0.99]"
                onClick={() => {
                
                   navigate("/dad-login");
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="px-16 py-14">
          <h2 className="font-serifDisplay text-6xl text-[#a6ba4c]">
            Dad Dashboard
          </h2>
          <p className="mt-3 text-sm font-semibold text-[#c09086]">
            Review requests and approve or deny :
          </p>

          {loading ? (
            <section className="mt-10 w-full max-w-[760px] rounded-2xl border border-[#bad07f]/60 bg-[#f7f0e6] p-10 shadow-[0_6px_0_rgba(215,205,160,0.55)]">
              <p className="font-serifDisplay text-3xl text-[#a6ba4c]">
                Loading requests...
              </p>
            </section>
          ) : error ? (
            <section className="mt-10 w-full max-w-[760px] rounded-2xl border border-[#eaa3a2]/60 bg-[#f7f0e6] p-10 shadow-[0_6px_0_rgba(215,205,160,0.55)]">
              <p className="font-serifDisplay text-3xl text-[#d97979]">
                Could not load requests
              </p>
              <p className="mt-4 text-sm text-[#c09086]">{error}</p>
            </section>
          ) : requests.length === 0 ? (
            <section className="mt-10 w-full max-w-[760px] rounded-2xl border border-[#bad07f]/60 bg-[#f7f0e6] p-10 shadow-[0_6px_0_rgba(215,205,160,0.55)]">
              <div className="flex items-center justify-between">
                <p className="font-serifDisplay text-3xl text-[#a6ba4c]">
                  No requests yet <span className="ml-1">💌</span>
                </p>
              </div>

              <p className="mt-5 text-sm text-[#eaa3a2]">
                When a request is submitted, it will appear here for you to review.
              </p>
            </section>
          ) : (
            <div className="mt-10 flex w-full max-w-[760px] flex-col gap-6">
              {requests.map((request) => (
                <section
                  key={request.id}
                  className="rounded-2xl border border-[#bad07f]/60 bg-[#f7f0e6] p-10 shadow-[0_6px_0_rgba(215,205,160,0.55)]"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-serifDisplay text-3xl text-[#a6ba4c]">
                        {request.requester}
                      </p>
                      <p className="mt-2 text-sm text-[#eaa3a2]">
                        Submitted {new Date(request.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span className="inline-flex items-center rounded-full bg-[#b8cf5c] px-5 py-2 font-serifDisplay text-xl capitalize text-[#6f7f2a] shadow-sm">
                      {request.status}
                    </span>
                  </div>

                  <div className="mt-8 rounded-2xl border border-[#bad07f]/60 bg-[#f7f0e6] p-8">
                    <div className="flex items-start justify-between gap-6">
                      <div className="grid w-full grid-cols-2 gap-y-4">
                        <div className="text-xl text-[#c09086]">Name</div>
                        <div className="text-xl text-[#c09086]">Amount</div>

                        <div className="font-serifDisplay text-2xl text-[#a6ba4c]">
                          {request.requester}
                        </div>
                        <div className="font-serifDisplay text-2xl text-[#a6ba4c]">
                          {formatAmount(request.amount)}
                        </div>

                        <div className="col-span-2 mt-2 grid grid-cols-[120px_1fr] gap-y-3 text-[#c09086]">
                          <div className="text-sm">Reason :</div>
                          <div className="text-sm">{request.reason}</div>

                          <div className="text-sm">Pitch :</div>
                          <div className="text-sm">{request.pitch}</div>

                          <div className="text-sm">Dad&apos;s Mood :</div>
                          <div className="text-sm">{request.dadsMood || "Not specified"}</div>

                          <div className="text-sm">Repay plan :</div>
                          <div className="text-sm">{request.repayPlan || "Not specified"}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 flex items-center justify-between px-4">
                      <button
                        type="button"
                        className="w-44 rounded-xl bg-[#a6ba4c] py-4 font-serifDisplay text-2xl text-white shadow-sm transition hover:brightness-95 active:scale-[0.99]"
                        onClick={() => console.log("reject", request.id)}
                      >
                        Reject
                      </button>

                      <button
                        type="button"
                        className="w-44 rounded-xl bg-[#a6ba4c] py-4 font-serifDisplay text-2xl text-white shadow-sm transition hover:brightness-95 active:scale-[0.99]"
                        onClick={() => console.log("approve", request.id)}
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

