import { courseModules } from "../../lib/content";

export default function AdminCurriculumPage() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-8 text-[#0c0e16]">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-[#155e75] uppercase">
            Curriculum
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#0c0e16]">
            Modules & lessons
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#4b5563]">
            Content shown on the public curriculum section. Editing can be wired
            to a CMS later.
          </p>
        </div>
        <button
          type="button"
          className="rounded-[10px] bg-red-600 px-5 py-3 text-xs font-extrabold tracking-wider text-white uppercase"
        >
          Add module
        </button>
      </div>

      <div className="space-y-3">
        {courseModules.map((module, index) => (
          <article
            key={module.title}
            className="rounded-2xl border border-[#d5dae6] bg-white p-5 sm:p-6"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-mono text-[11px] font-semibold tracking-wider text-[#155e75] uppercase">
                  {module.week}
                </p>
                <h2 className="mt-1 text-lg font-semibold tracking-tight text-[#0c0e16]">
                  <span className="mr-2 font-mono text-[#9aa1bd]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {module.title}
                </h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-[#4b5563]">
                  {module.description}
                </p>
              </div>
              <span className="font-mono text-xs font-medium whitespace-nowrap text-[#374151]">
                {module.lessons.length} lessons
              </span>
            </div>

            <ol className="mt-5 grid gap-2 sm:grid-cols-2">
              {module.lessons.map((lesson, lessonIndex) => (
                <li
                  key={lesson}
                  className="flex gap-3 rounded-[10px] border border-[#d5dae6] bg-[#f4f5f9] px-3 py-3 text-sm"
                >
                  <span className="font-mono text-[11px] font-semibold text-[#b91c1c] tabular-nums">
                    {String(lessonIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="font-medium text-[#0c0e16]">{lesson}</span>
                </li>
              ))}
            </ol>
          </article>
        ))}
      </div>
    </div>
  );
}
