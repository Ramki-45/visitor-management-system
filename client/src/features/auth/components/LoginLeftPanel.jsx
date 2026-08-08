import { ShieldCheck } from "lucide-react";

export function LoginLeftPanel() {
  return (
    <section className="relative hidden min-h-screen overflow-hidden bg-indigo-950 md:flex md:w-1/2">
      {/* Decorative background glow */}
      <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

      <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />

      {/* Content */}
      <div className="relative z-10 flex w-full items-center px-12 py-16 lg:px-20">
        <div className="max-w-xl">
          {/* Logo / Icon */}
          <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500">
            <ShieldCheck size={30} className="text-white" />
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-white lg:text-5xl">
            Visitor
            <br />
            Management System
          </h1>

          {/* Description */}
          <p className="mt-7 max-w-md text-base leading-7 text-indigo-200 lg:text-lg">
            Streamline visitor registration, employee approvals, and workplace
            access securely and efficiently.
          </p>

          {/* Small feature indicators */}
          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span className="text-sm text-indigo-200">
                Secure visitor registration
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span className="text-sm text-indigo-200">
                Role-based access control
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span className="text-sm text-indigo-200">
                Real-time visit tracking
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
