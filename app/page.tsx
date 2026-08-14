"use client";

import { useMemo, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

type Job = {
  id: number;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  skills: string[];
  match: number;
  posted: string;
  logo: string;
};

const fallbackJobs: Job[] = [
  {
    id: 1,
    title: "Machine Learning Engineer",
    company: "Vertex Labs",
    location: "Hyderabad, India",
    type: "Remote",
    salary: "₹12L – ₹18L",
    skills: ["Python", "TensorFlow", "SQL"],
    match: 94,
    posted: "2h ago",
    logo: "VL",
  },
  {
    id: 2,
    title: "Data Analyst",
    company: "Nexa Analytics",
    location: "Bengaluru, India",
    type: "Hybrid",
    salary: "₹7L – ₹11L",
    skills: ["Python", "SQL", "Power BI"],
    match: 91,
    posted: "5h ago",
    logo: "NA",
  },
  {
    id: 3,
    title: "Frontend Engineer",
    company: "Orbit Systems",
    location: "Remote, India",
    type: "Remote",
    salary: "₹10L – ₹16L",
    skills: ["React", "Next.js", "TypeScript"],
    match: 87,
    posted: "1d ago",
    logo: "OS",
  },
  {
    id: 4,
    title: "AI Research Associate",
    company: "Cognitive Works",
    location: "Pune, India",
    type: "Hybrid",
    salary: "₹9L – ₹14L",
    skills: ["Python", "ML", "Research"],
    match: 89,
    posted: "1d ago",
    logo: "CW",
  },
  {
    id: 5,
    title: "Software Engineer",
    company: "Northstar Technologies",
    location: "Chennai, India",
    type: "On-site",
    salary: "₹8L – ₹13L",
    skills: ["Java", "Python", "SQL"],
    match: 84,
    posted: "2d ago",
    logo: "NT",
  },
  {
    id: 6,
    title: "Data Scientist",
    company: "Insight AI",
    location: "Hyderabad, India",
    type: "Hybrid",
    salary: "₹14L – ₹22L",
    skills: ["Python", "Scikit-learn", "Pandas"],
    match: 92,
    posted: "2d ago",
    logo: "IA",
  },
];


export default function Home() {
  const [search, setSearch] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);

const supabase = createClient();

useEffect(() => {
  const fetchJobs = async () => {
    const { data, error } = await supabase
      .from("jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching jobs:", error);
      return;
    }

    if (data) {
      setJobs(data as Job[]);
    }
  };

  fetchJobs();
}, []);
  const [location, setLocation] = useState("");
  const [remote, setRemote] = useState("All");
  const [saved, setSaved] = useState<number[]>([]);
  const [savedLoaded, setSavedLoaded] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [compareJobs, setCompareJobs] = useState<number[]>([]);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [showApplication, setShowApplication] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [sort, setSort] = useState("Best Match");
  const [applications, setApplications] = useState<any[]>([]);
  const [applicationSearch, setApplicationSearch] = useState("");
  const [applicationStatusFilter, setApplicationStatusFilter] = useState("All");
  const [applicationSort, setApplicationSort] = useState("Newest");
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [applicationNotes, setApplicationNotes] = useState<Record<number, string>>({});
  const [applicationFollowUps, setApplicationFollowUps] = useState<Record<number, string>>({});
  const [applicationHistory, setApplicationHistory] =
  useState<Record<number, { status: string; date: string }[]>>({});
  useEffect(() => {
  try {
    const stored = localStorage.getItem("savedJobs");

    if (stored) {
      setSaved(JSON.parse(stored));
    }
  } catch (error) {
    console.error("Failed to load saved jobs:", error);
  } finally {
    setSavedLoaded(true);
  }
}, []);

useEffect(() => {
  if (!savedLoaded) return;

  localStorage.setItem("savedJobs", JSON.stringify(saved));
}, [saved, savedLoaded]);
  useEffect(() => {
  localStorage.setItem(
    "applicationNotes",
    JSON.stringify(applicationNotes)
  );
}, [applicationNotes]);
useEffect(() => {
  localStorage.setItem(
    "applicationHistory",
    JSON.stringify(applicationHistory)
  );
}, [applicationHistory]);
  useEffect(() => {
  const savedApplications = localStorage.getItem("applications");

  if (savedApplications) {
    try {
      setApplications(JSON.parse(savedApplications));
    } catch (error) {
      console.error("Failed to load applications:", error);
    }
  }
  const savedNotes = localStorage.getItem("applicationNotes");

if (savedNotes) {
  try {
    setApplicationNotes(JSON.parse(savedNotes));
  } catch (error) {
    console.error("Failed to load application notes:", error);
  }
}
const savedFollowUps = localStorage.getItem("applicationFollowUps");

if (savedFollowUps) {
  try {
    setApplicationFollowUps(JSON.parse(savedFollowUps));
  } catch (error) {
    console.error("Failed to load application follow-ups:", error);
  }
}
const savedHistory = localStorage.getItem("applicationHistory");

if (savedHistory) {
  try {
    setApplicationHistory(JSON.parse(savedHistory));
  } catch (error) {
    console.error("Failed to load application history:", error);
  }
}
}, []);

  const filteredJobs = useMemo(() => {
  let result = jobs.filter((job) => {
    const title = String(job.title ?? "").toLowerCase();
    const company = String(job.company ?? "").toLowerCase();
    const jobLocation = String(job.location ?? "").toLowerCase();
    const jobType = String(job.type ?? "").toLowerCase();

    const jobSkills = Array.isArray(job.skills)
      ? job.skills.map((skill) => String(skill).toLowerCase())
      : [];

    const searchText = search.trim().toLowerCase();
    const locationText = location.trim().toLowerCase();
    const remoteText = remote.trim().toLowerCase();

    const matchesSearch =
      searchText === "" ||
      title.includes(searchText) ||
      company.includes(searchText) ||
      jobSkills.some((skill) => skill.includes(searchText));

    const matchesLocation =
      locationText === "" ||
      jobLocation.includes(locationText);

    const matchesRemote =
      remoteText === "all" ||
      jobType === remoteText.toLowerCase();

    return matchesSearch && matchesLocation && matchesRemote;
  });

  if (sort === "Best Match") {
    result = [...result].sort((a, b) => b.match - a.match);
  }

  if (sort === "Most Recent") {
    result = [...result].sort((a, b) => a.id - b.id);
  }

  return result;
}, [jobs, search, location, remote, sort]);

  const toggleSave = (id: number) => {
    setSaved((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };
  const toggleCompare = (id: number) => {
  setCompareJobs((current) =>
    current.includes(id)
      ? current.filter((jobId) => jobId !== id)
      : current.length < 2
        ? [...current, id]
        : current
  );
};

 const filteredApplications = applications.filter((application) => {
  const matchesSearch =
    application.jobTitle.toLowerCase().includes(applicationSearch.toLowerCase()) ||
    application.company.toLowerCase().includes(applicationSearch.toLowerCase());

  const matchesStatus =
    applicationStatusFilter === "All" ||
    application.status === applicationStatusFilter;

    return matchesSearch && matchesStatus;
});
const today = new Date().toLocaleDateString("en-CA");

const overdueFollowUps = applications.filter((app) => {
  const followUpDate = applicationFollowUps[app.id];
  return followUpDate && followUpDate < today;
}).length;

const upcomingFollowUps = applications.filter((app) => {
  const followUpDate = applicationFollowUps[app.id];
  return followUpDate && followUpDate >= today;
}).length;
const sortedApplications = [...filteredApplications].sort((a, b) => {
  if (applicationSort === "Newest") {
    return b.id - a.id;
  }

  return a.id - b.id;
});
  return (
    <main className="min-h-screen bg-[#fafafa] text-[#111]">
      {/* NAVBAR */}
      <header className="border-b border-black/[0.08] bg-white">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 lg:px-8">
          <div className="flex items-center gap-10">
            <div className="text-xl font-semibold tracking-[-0.04em]">
              Hire<span className="text-[#666]">Flow</span>
            </div>

            <nav className="hidden items-center gap-7 text-sm text-[#666] md:flex">
              <a className="font-medium text-black" href="#">
                Discover
              </a>
              <a className="transition hover:text-black" href="#">
                Saved
              </a>
              <a className="transition hover:text-black" href="#">
                Compare
              </a>
              <a className="transition hover:text-black" href="#applications">
  Applications
</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
           <button
  type="button"
  onClick={() => {
  setShowSignIn(true);
}}
  className="hidden text-sm text-[#555] transition hover:text-black sm:block"
>
  Sign in
</button>
           <button
  type="button"
  onClick={() => {
  setShowSignUp(false);
  setShowSignIn(true);
}}
  className="rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#333]"
>
  Get started
</button>
          </div>
        </div>
      </header>
      

      {/* HERO */}
      <section className="border-b border-black/[0.08] bg-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-16 lg:px-8 lg:pb-18 lg:pt-20">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-black/[0.1] bg-[#fafafa] px-3.5 py-1.5 text-xs font-medium text-[#555]">
              <span className="h-1.5 w-1.5 rounded-full bg-black" />
              Smarter job discovery
            </div>

            <h1 className="text-5xl font-semibold leading-[1.02] tracking-[-0.055em] sm:text-6xl lg:text-7xl">
              Find work
              <br />
              that fits you.
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#666] sm:text-lg">
              Discover opportunities matched to your skills, experience and
              ambitions — without the noise.
            </p>
          </div>

          {/* SEARCH */}
          <div className="mt-10 rounded-2xl border border-black/[0.12] bg-white p-2 shadow-[0_8px_35px_rgba(0,0,0,0.06)]">
            <div className="grid gap-2 md:grid-cols-[1.5fr_1fr_auto]">
              <div className="flex items-center gap-3 rounded-xl bg-[#f7f7f7] px-4 py-3">
                <span className="text-lg text-[#777]">⌕</span>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Job title, skill or company"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#999]"
                />
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-[#f7f7f7] px-4 py-3">
                <span className="text-sm text-[#777]">⌖</span>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-[#999]"
                />
              </div>

              <button
                onClick={() => {}}
                className="rounded-xl bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-[#222]"
              >
                Search jobs
              </button>
            </div>
          </div>

          {/* QUICK FILTERS */}
          <div className="mt-5 flex flex-wrap gap-2">
            {["All", "Remote", "Hybrid", "On-site"].map((item) => (
              <button
                key={item}
                onClick={() => setRemote(item)}
                className={`rounded-full border px-4 py-2 text-xs font-medium transition ${
                  remote === item
                    ? "border-black bg-black text-white"
                    : "border-black/[0.12] bg-white text-[#555] hover:border-black/30"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* JOB DISCOVERY */}
      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-[#777]">Opportunities</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.035em]">
              Recommended for you
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#888]">Sort by</span>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-lg border border-black/[0.12] bg-white px-3 py-2 text-sm outline-none"
            >
              <option>Best Match</option>
              <option>Most Recent</option>
            </select>
          </div>
        </div>

        <div className="mt-7 grid gap-4">
          {filteredJobs.map((job) => (
            <article
              key={job.id}
              className="group rounded-2xl border border-black/[0.09] bg-white p-5 transition hover:-translate-y-0.5 hover:border-black/[0.18] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] sm:p-6"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex min-w-0 gap-4">
                  {/* COMPANY LOGO */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f0f0f0] text-xs font-semibold text-[#444]">
                    {job.logo}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold tracking-[-0.02em]">
                        {job.title}
                      </h3>

                      <span className="rounded-full bg-[#f1f1f1] px-2 py-1 text-[10px] font-medium text-[#666]">
                        {job.posted}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-[#555]">
                      {job.company}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#777]">
                      <span>{job.location}</span>
                      <span>{job.type}</span>
                      <span>{job.salary}</span>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="rounded-md bg-[#f6f6f6] px-2.5 py-1.5 text-[11px] font-medium text-[#555]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* RIGHT SIDE */}
                <div className="flex items-center justify-between gap-5 md:min-w-[220px] md:justify-end">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#999]">
                      Match
                    </p>
                    <p className="mt-0.5 text-2xl font-semibold tracking-[-0.04em]">
                      {job.match}%
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSave(job.id)}
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border text-lg transition ${
                        saved.includes(job.id)
                          ? "border-black bg-black text-white"
                          : "border-black/[0.12] bg-white text-[#555] hover:border-black"
                      }`}
                      aria-label="Save job"
                    >
                      {saved.includes(job.id) ? "✓" : "♡"}
                    </button>

                    <button onClick={() => setSelectedJob(job)} className="rounded-xl bg-black px-4 py-2.5 text-xs font-medium text-white transition hover:bg-[#222]">
                      View job
                    </button>
                    <button
  type="button"
  onClick={() => toggleCompare(job.id)}
  className={`rounded-xl px-4 py-2.5 text-xs font-medium transition ${
    compareJobs.includes(job.id)
      ? "bg-black text-white"
      : "border border-black/10 bg-white text-[#555] hover:border-black/30"
  }`}
>
  {compareJobs.includes(job.id) ? "✓ Compared" : "Compare"}
</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredJobs.length === 0 && (
          <div className="mt-7 rounded-2xl border border-dashed border-black/[0.15] bg-white px-6 py-16 text-center">
            <div className="text-2xl">⌕</div>
            <h3 className="mt-3 font-semibold">No jobs found</h3>
            <p className="mt-1 text-sm text-[#777]">
              Try a different keyword, location or filter.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setLocation("");
                setRemote("All");
              }}
              className="mt-5 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* FOOTER STAT */}
        <div className="mt-12 flex flex-col justify-between gap-3 border-t border-black/[0.08] pt-6 text-xs text-[#888] sm:flex-row">
          <span>{filteredJobs.length} opportunities found</span>
          <span>HireFlow · Find work that fits you.</span>
        </div>
      </section>
      {compareJobs.length > 0 && (
  <section className="mx-auto max-w-7xl px-6 py-10">
    <div className="flex items-center justify-between mb-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#999]">
          Compare
        </p>
        <h2 className="mt-1 text-2xl font-semibold">
          Compare selected jobs
        </h2>
      </div>

      <button
        onClick={() => setCompareJobs([])}
        className="rounded-lg border border-black/10 bg-white px-4 py-2 text-sm font-medium text-[#555] hover:border-black"
      >
        Clear
      </button>
    </div>

    <div className="grid gap-4 md:grid-cols-2">
      {compareJobs.map((id) => {
        const job = jobs.find((item) => item.id === id);

        if (!job) return null;

        return (
          <div
            key={job.id}
            className="rounded-2xl border border-black/10 bg-white p-5"
          >
            <h3 className="text-lg font-semibold">
              {job.title}
            </h3>

            <p className="mt-1 text-sm text-[#666]">
              {job.company}
            </p>

            <div className="mt-4 space-y-2 text-sm text-[#555]">
              <p>
                <strong>Location:</strong> {job.location}
              </p>
              <p>
                <strong>Type:</strong> {job.type}
              </p>
              <p>
                <strong>Salary:</strong> {job.salary}
              </p>
              <p>
                <strong>Match:</strong> {job.match}%
              </p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-md bg-[#f6f6f6] px-2.5 py-1 text-[11px] font-medium text-[#555]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </section>
)}
      {/* APPLICATIONS SECTION */}
<section id="applications" className="mt-16 border-t border-black/10 pt-10">
{/* APPLICATION SUMMARY */}
<div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-8">

  <div className="rounded-2xl border border-black/10 bg-white p-4">
    <p className="text-xs font-medium text-[#888]">Total</p>
    <p className="mt-1 text-2xl font-semibold">
      {applications.length}
    </p>
  </div>
  <div className="rounded-2xl border border-black/10 bg-white p-4">
  <p className="text-xs font-medium text-[#888]">Applied</p>
  <p className="mt-1 text-2xl font-semibold">
    {applications.filter((app) => app.status === "Applied").length}
  </p>
</div>

  <div className="rounded-2xl border border-black/10 bg-white p-4">
    <p className="text-xs font-medium text-[#888]">Screening</p>
    <p className="mt-1 text-2xl font-semibold">
      {applications.filter((app) => app.status === "Screening").length}
    </p>
  </div>

  <div className="rounded-2xl border border-black/10 bg-white p-4">
    <p className="text-xs font-medium text-[#888]">Interviews</p>
    <p className="mt-1 text-2xl font-semibold">
      {applications.filter((app) => app.status === "Interview").length}
    </p>
  </div>
  <div className="rounded-2xl border border-black/10 bg-white p-4">
  <p className="text-xs font-medium text-[#888]">Rejected</p>
  <p className="mt-1 text-2xl font-semibold">
    {applications.filter((app) => app.status === "Rejected").length}
  </p>
</div>

  <div className="rounded-2xl border border-black/10 bg-white p-4">
    <p className="text-xs font-medium text-[#888]">Offers</p>
    <p className="mt-1 text-2xl font-semibold">
      {applications.filter((app) => app.status === "Offer").length}
    </p>
  </div>

</div>
  <div className="flex items-center justify-between mb-6">
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">
        Your activity
      </p>
      <h2 className="mt-1 text-2xl font-semibold">
        Applications
      </h2>
      <div className="flex flex-col md:flex-row gap-3 mb-6">
  <input
    type="text"
    placeholder="Search applications..."
    value={applicationSearch}
    onChange={(e) => setApplicationSearch(e.target.value)}
    className="flex-1 rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/30"
  />

  <select
    value={applicationStatusFilter}
    onChange={(e) => setApplicationStatusFilter(e.target.value)}
    className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
  >
    <option value="All">All Statuses</option>
    <option value="Applied">Applied</option>
    <option value="Screening">Screening</option>
    <option value="Interview">Interview</option>
    <option value="Offer">Offer</option>
    <option value="Rejected">Rejected</option>
  </select>
  <select
  value={applicationSort}
  onChange={(e) => setApplicationSort(e.target.value)}
  className="rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
>
  <option value="Newest">Newest</option>
  <option value="Oldest">Oldest</option>
</select>
</div>
{/* FOLLOW-UP SUMMARY */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

  <div className="rounded-2xl border border-black/10 bg-white p-5">
    <p className="text-sm text-[#777]">Overdue Follow-ups</p>
    <p className="mt-1 text-2xl font-semibold">
      {overdueFollowUps}
    </p>
  </div>

  <div className="rounded-2xl border border-black/10 bg-white p-5">
    <p className="text-sm text-[#777]">Upcoming Follow-ups</p>
    <p className="mt-1 text-2xl font-semibold">
      {upcomingFollowUps}
    </p>
  </div>

</div>

      
    </div>

    <span className="rounded-full bg-[#f5f5f5] px-3 py-1 text-sm text-[#666]">
      {applications.length}
    </span>
  </div>

  {applications.length === 0 ? (
    <div className="rounded-2xl border border-dashed border-black/10 bg-white p-10 text-center">
      <div className="text-2xl">□</div>

      <h3 className="mt-3 font-semibold">
        No applications yet
      </h3>

      <p className="mt-1 text-sm text-[#777]">
        Jobs you apply to will appear here.
      </p>
    </div>
  ) : (
    <div className="grid gap-4">
      {sortedApplications.map((application) => (
        <article
          key={application.id}
          className="rounded-2xl border border-black/10 bg-white p-5 cursor-pointer hover:border-black/30 transition"
onClick={() => setSelectedApplication(application)}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-semibold">
                {application.jobTitle}
              </h3>

              <p className="mt-1 text-sm text-[#666]">
                {application.company}
              </p>

              <p className="mt-2 text-xs text-[#999]">
                Applied on{" "}
                {new Date(application.id).toLocaleDateString()}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#777]">
  <span>{application.location}</span>
  <span>{application.type}</span>
  <span>{application.salary}</span>
</div>

{application.skills && (
  <div className="mt-3 flex flex-wrap gap-2">
    {application.skills.map((skill: string) => (
      <span
        key={skill}
        className="rounded-md bg-[#f5f5f5] px-2.5 py-1 text-[11px] font-medium text-[#555]"
      >
        {skill}
      </span>
    ))}
  </div>
)}
<div className="mt-4">
  <label className="block text-xs font-medium text-[#777] mb-1">
    Follow-up date
  </label>

  <input
    type="date"
    value={applicationFollowUps[application.id] || ""}
    onChange={(e) => {
      const updatedFollowUps = {
        ...applicationFollowUps,
        [application.id]: e.target.value,
      };

      setApplicationFollowUps(updatedFollowUps);

      localStorage.setItem(
        "applicationFollowUps",
        JSON.stringify(updatedFollowUps)
      );
    }}
    className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none"
  />

  {applicationFollowUps[application.id] && (
    <p className="mt-2 text-xs font-medium">
      {new Date(applicationFollowUps[application.id]) < new Date()
        ? "🔴 Follow-up overdue"
        : "🟢 Follow-up upcoming"}
    </p>
  )}
</div>
<div className="mt-4">
  <textarea
    value={applicationNotes[application.id] || ""}
    onChange={(e) => {
      const updatedNotes = {
        ...applicationNotes,
        [application.id]: e.target.value,
      };

      setApplicationNotes(updatedNotes);
    }}
    placeholder="Add notes about this application..."
    rows={3}
    className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none resize-none focus:border-black/30"
  />
</div>
{/* APPLICATION HISTORY */}
<div className="mt-4">
  <p className="text-xs font-semibold uppercase tracking-wide text-[#999]">
    Status History
  </p>

  <div className="mt-2 space-y-2">
    {(applicationHistory[application.id] || []).length === 0 ? (
      <p className="text-xs text-[#999]">
        No status changes yet.
      </p>
    ) : (
      (applicationHistory[application.id] || [])
        .slice()
        .reverse()
        .map((history, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg border border-black/10 bg-white px-3 py-2 text-xs"
          >
            <span className="font-medium">
              {history.status}
            </span>

            <span className="text-[#888]">
              {new Date(history.date).toLocaleDateString("en-IN")}
            </span>
          </div>
        ))
    )}
  </div>
</div>
            <div className="flex items-center gap-3">
              <select
  value={application.status}
  onChange={(e) => {
    const newStatus = e.target.value;

if (newStatus !== application.status) {
  setApplicationHistory((current) => ({
    ...current,
    [application.id]: [
      ...(current[application.id] || []),
      {
        status: newStatus,
        date: new Date().toISOString(),
      },
    ],
  }));
}
    const updatedApplications = applications.map((app) =>
      app.id === application.id
        ? { ...app, status: e.target.value }
        : app
    );

    setApplications(updatedApplications);
    localStorage.setItem(
      "applications",
      JSON.stringify(updatedApplications)
    );
  }}
  className={`rounded-full border px-3 py-1 text-xs font-medium outline-none ${
  application.status === "Applied"
    ? "border-gray-200 bg-gray-100 text-gray-700"
    : application.status === "Screening"
    ? "border-blue-200 bg-blue-50 text-blue-700"
    : application.status === "Interview"
    ? "border-purple-200 bg-purple-50 text-purple-700"
    : application.status === "Offer"
    ? "border-green-200 bg-green-50 text-green-700"
    : "border-red-200 bg-red-50 text-red-700"
}`}
>
  <option value="Applied">Applied</option>
  <option value="Screening">Screening</option>
  <option value="Interview">Interview</option>
  <option value="Offer">Offer</option>
  <option value="Rejected">Rejected</option>
</select>


              <button
                type="button"
                onClick={() => {
                  const updated = applications.filter(
                    (item) => item.id !== application.id
                  );

                  localStorage.setItem(
                    "applications",
                    JSON.stringify(updated)
                  );

                  setApplications(updated);
                }}
                className="rounded-lg border border-black/10 px-3 py-2 text-xs font-medium hover:bg-[#f5f5f5]"
              >
                Remove
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )}
</section>

{selectedJob && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
    <div className="w-full max-w-xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">

      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#111]">
            {selectedJob.title}
          </h2>

          <p className="mt-1 text-sm text-[#666]">
            {selectedJob.company}
          </p>
        </div>

        <button
          onClick={() => setSelectedJob(null)}
          className="rounded-full px-3 py-1 text-xl text-[#777] hover:bg-[#f5f5f5]"
        >
          ×
        </button>
      </div>

      <div className="mt-5 flex flex-wrap gap-3 text-sm text-[#555]">
        <span>{selectedJob.location}</span>
        <span>•</span>
        <span>{selectedJob.type}</span>
        <span>•</span>
        <span>{selectedJob.salary}</span>
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">
          Skills
        </p>

        <div className="mt-2 flex flex-wrap gap-2">
          {selectedJob.skills.map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-[#f5f5f5] px-3 py-1.5 text-sm text-[#555]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6">
  <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">
    About the Role
  </p>

  <p className="mt-2 text-sm leading-6 text-[#555]">
    We are looking for a talented {selectedJob.title} to join the team at{" "}
    {selectedJob.company}. You will work on real-world projects,
    collaborate with other teams, and build solutions using modern
    technologies.
  </p>
</div>

<div className="mt-6">
  <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">
    Requirements
  </p>

  <ul className="mt-2 space-y-2 text-sm text-[#555]">
    {selectedJob.skills.map((skill) => (
      <li key={skill} className="flex items-start gap-2">
        <span>•</span>
        <span>Experience or strong knowledge of {skill}</span>
      </li>
    ))}
  </ul>
</div>
<div className="mt-6">
  <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">
    Responsibilities
  </p>

  <ul className="mt-2 space-y-2 text-sm text-[#555]">
    <li className="flex items-start gap-2">
      <span>•</span>
      <span>Work on real-world projects and deliver high-quality solutions.</span>
    </li>

    <li className="flex items-start gap-2">
      <span>•</span>
      <span>Collaborate with cross-functional teams to solve technical problems.</span>
    </li>

    <li className="flex items-start gap-2">
      <span>•</span>
      <span>Apply modern technologies and best practices to assigned projects.</span>
    </li>

    <li className="flex items-start gap-2">
      <span>•</span>
      <span>Continuously learn and improve technical and problem-solving skills.</span>
    </li>
  </ul>
</div>

<div className="mt-6">
  <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">
    What We Offer
  </p>

  <div className="mt-2 flex flex-wrap gap-2 text-sm text-[#555]">
    <span className="rounded-md bg-[#f5f5f5] px-3 py-1.5">
      Competitive Salary
    </span>

    <span className="rounded-md bg-[#f5f5f5] px-3 py-1.5">
      Growth Opportunities
    </span>

    <span className="rounded-md bg-[#f5f5f5] px-3 py-1.5">
      Collaborative Environment
    </span>

    <span className="rounded-md bg-[#f5f5f5] px-3 py-1.5">
      Learning & Development
    </span>
  </div>
</div>
      <div className="mt-6 flex justify-end gap-2">
  <button
    onClick={() => {
  setShowApplication(true);
}}
    className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#222]"
  >
    Apply Now
  </button>

  <button
    onClick={() => setSelectedJob(null)}
    className="rounded-lg border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-[#555] transition hover:border-black/30"
  >
    Close
  </button>
</div>

    </div>
  </div>
)}
{showApplication && selectedJob && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
    <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#999]">
            Apply for
          </p>
          <h2 className="mt-1 text-2xl font-semibold">
            {selectedJob.title}
          </h2>
          <p className="mt-1 text-sm text-[#666]">
            {selectedJob.company}
          </p>
        </div>

        <button
          onClick={() => setShowApplication(false)}
          className="rounded-full px-3 py-1 text-xl text-[#777] hover:bg-[#f5f5f5]"
        >
          ×
        </button>
      </div>

      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
  e.preventDefault();

  const form = e.currentTarget;

  const application = {
    id: Date.now(),
    jobId: selectedJob?.id,
    jobTitle: selectedJob?.title,
    company: selectedJob?.company,location: selectedJob?.location,
    type: selectedJob?.type,
    salary: selectedJob?.salary,
    skills: selectedJob?.skills,
    fullName: (form.elements.namedItem("fullName") as HTMLInputElement).value,
    email: (form.elements.namedItem("email") as HTMLInputElement).value,
    phone: (form.elements.namedItem("phone") as HTMLInputElement).value,
    resume: (form.elements.namedItem("resume") as HTMLInputElement).files?.[0]?.name || "",
    linkedin: (form.elements.namedItem("linkedin") as HTMLInputElement).value,
    coverLetter: (form.elements.namedItem("coverLetter") as HTMLTextAreaElement).value,
    status: "Applied",
  };

  const existingApplications = JSON.parse(
    localStorage.getItem("applications") || "[]"
  );

  const updatedApplications = [...existingApplications, application];

  localStorage.setItem(
    "applications",
    JSON.stringify(updatedApplications)
  );

  setApplications(updatedApplications);
  setShowApplication(false);
  setShowSuccess(true);
}}
      >
        <div>
          <label className="text-sm font-medium text-[#444]">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            required
            placeholder="Enter your full name"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#444]">
            Email
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#444]">
            Phone
          </label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="Enter your phone number"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#444]">
            Resume
          </label>
          <input
            type="file"
            name="resume"
            accept=".pdf,.doc,.docx"
            required
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#444]">
            LinkedIn URL
          </label>
          <input
            type="url"
            name="linkedin"
            placeholder="https://linkedin.com/in/yourname"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#444]">
            Cover Letter
          </label>
          <textarea
            name="coverLetter"
            rows={4}
            placeholder="Write a short cover letter..."
            className="mt-1 w-full resize-none rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => setShowApplication(false)}
            className="rounded-lg border border-black/10 bg-white px-5 py-2.5 text-sm font-medium text-[#555]"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#222]"
          >
            Submit Application
          </button>
        </div>
      </form>
    </div>
  </div>
)}
{showSuccess && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
      
      <div className="flex flex-col items-center text-center">
        
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white">
          <span className="text-2xl">✓</span>
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#999]">
          Application Received
        </p>

        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#111]">
          Application Submitted
        </h2>

        <p className="mt-3 max-w-sm text-sm leading-6 text-[#666]">
          Your application has been successfully submitted. 
          We’ve saved your application details for this position.
        </p>

        <button
          type="button"
          onClick={() => setShowSuccess(false)}
          className="mt-7 rounded-lg bg-black px-7 py-3 text-sm font-medium text-white transition hover:bg-[#222]"
        >
          Done
        </button>

      </div>
    </div>
    {showSignIn && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 px-4">
    <div className="relative z-[10000] w-full max-w-md rounded-2xl bg-white p-7 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-[#111]">
            Welcome back
          </h2>
          <p className="mt-1 text-sm text-[#666]">
            Sign in to continue to HireFlow.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowSignIn(false)}
          className="rounded-full px-3 py-1 text-xl text-[#777] hover:bg-[#f5f5f5]"
        >
          ×
        </button>
      </div>
      <form
        className="mt-6 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setShowSignIn(false);
        }}
      >
        <div>
          <label className="text-sm font-medium text-[#444]">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black/30"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-[#444]">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="Enter your password"
            className="mt-1 w-full rounded-lg border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black/30"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-[#333]"
        >
          Sign In
        </button>

        <p className="text-center text-sm text-[#666]">
          Don't have an account?{" "}
          <button
            type="button"
            onClick={() => {
              setShowSignIn(false);
              setShowSignUp(true);
            }}
            className="font-medium text-black underline"
          >
            Create one
          </button>
        </p>
      </form>
    </div>
  </div>
)}
  </div>
)}
</main>
  );
}