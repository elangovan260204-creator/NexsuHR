
import { useState } from 'react'

const navigation = [
  { name: 'Dashboard', icon: '⌂' },
  { name: 'Employees', icon: '♟' },
  { name: 'Attendance', icon: '▦' },
  { name: 'Leave Management', icon: '▣' },
  { name: 'Performance', icon: '▥' },
  { name: 'Recruitment', icon: '▤' },
  { name: 'Departments', icon: '▦' },
  { name: 'Reports', icon: '▧' },
  { name: 'Settings', icon: '⚙' },
]

const employees = [
  { id: 1, name: 'Arun Kumar', role: 'Software Engineer', department: 'Engineering', email: 'arun.kumar@nexushr.com', status: 'Active', date: '12 Oct 2026', initials: 'AK', color: 'bg-blue-100 text-blue-700' },
  { id: 2, name: 'Priya Sharma', role: 'HR Executive', department: 'Human Resources', email: 'priya.sharma@nexushr.com', status: 'Active', date: '10 Oct 2026', initials: 'PS', color: 'bg-pink-100 text-pink-700' },
  { id: 3, name: 'Karthik Raj', role: 'Sales Manager', department: 'Sales', email: 'karthik.raj@nexushr.com', status: 'Active', date: '08 Oct 2026', initials: 'KR', color: 'bg-amber-100 text-amber-700' },
  { id: 4, name: 'Divya S', role: 'Marketing Specialist', department: 'Marketing', email: 'divya.s@nexushr.com', status: 'Active', date: '05 Oct 2026', initials: 'DS', color: 'bg-purple-100 text-purple-700' },
  { id: 5, name: 'Vignesh M', role: 'Finance Analyst', department: 'Finance', email: 'vignesh.m@nexushr.com', status: 'Active', date: '01 Oct 2026', initials: 'VM', color: 'bg-emerald-100 text-emerald-700' },
]

const stats = [
  { label: 'Total Employees', value: '125', change: '+12%', icon: '♟', style: 'bg-blue-50 text-blue-600' },
  { label: 'Present Today', value: '98', change: '+8%', icon: '✓', style: 'bg-emerald-50 text-emerald-600' },
  { label: 'On Leave', value: '12', change: '-4%', icon: '◷', style: 'bg-amber-50 text-amber-600' },
  { label: 'Open Positions', value: '8', change: '+25%', icon: '▣', style: 'bg-violet-50 text-violet-600' },
]

const attendance = [
  { day: 'Mon', present: 82, absent: 18 },
  { day: 'Tue', present: 78, absent: 18 },
  { day: 'Wed', present: 79, absent: 18 },
  { day: 'Thu', present: 79, absent: 18 },
  { day: 'Fri', present: 78, absent: 18 },
  { day: 'Sat', present: 40, absent: 18 },
  { day: 'Sun', present: 35, absent: 18 },
]

const activities = [
  { icon: '♟', title: 'New employee joined', detail: 'Arun Kumar joined Engineering', time: '2 hours ago', color: 'bg-emerald-100 text-emerald-700' },
  { icon: '▦', title: 'Leave request approved', detail: "Priya's leave request approved", time: '4 hours ago', color: 'bg-blue-100 text-blue-700' },
  { icon: '▣', title: 'Department updated', detail: 'New Sales team created', time: '1 day ago', color: 'bg-violet-100 text-violet-700' },
  { icon: '●', title: 'Profile updated', detail: 'Employee profile information updated', time: '1 day ago', color: 'bg-amber-100 text-amber-700' },
]

function App() {
  const [activePage, setActivePage] = useState('Dashboard')
  const [search, setSearch] = useState('')

  const filteredEmployees = employees.filter((employee) =>
    `${employee.name} ${employee.role} ${employee.department} ${employee.email}`
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      {/* Sidebar */}
      <aside className="flex w-full flex-col bg-[#101d35] text-slate-200 md:fixed md:inset-y-0 md:left-0 md:w-64">
        <div className="flex items-center gap-3 border-b border-white/10 px-6 py-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-2xl font-bold text-white">
            N
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-white">NexusHR</h1>
            <p className="mt-1 text-xs text-slate-400">Workforce Intelligence</p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto p-3 md:flex-1 md:flex-col md:overflow-y-auto">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivePage(item.name)}
              className={`flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-left text-sm transition ${
                activePage === item.name
                  ? 'bg-blue-600 font-semibold text-white shadow-lg shadow-blue-950/30'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="w-5 text-center text-lg">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="hidden border-t border-white/10 p-4 md:block">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
              AU
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-slate-400">System Administrator</p>
            </div>
          </div>
          <button
            onClick={() => setActivePage('Login')}
            className="mt-3 w-full rounded-lg px-3 py-2 text-left text-sm text-slate-300 hover:bg-white/10"
          >
            ↪ Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 md:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4 md:px-8">
          <div className="relative w-full max-w-md">
            <span className="absolute left-3 top-2.5 text-lg text-slate-400">⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search employees, departments..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              aria-label="Notifications"
              className="relative rounded-full border border-slate-200 p-2 hover:bg-slate-50"
            >
              ♧
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-white bg-red-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                AU
              </div>
              <span className="hidden text-sm font-medium sm:block">Admin User</span>
            </div>
          </div>
        </header>

        <div className="space-y-6 p-5 md:p-8">
          <section className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-blue-600">NexusHR Workspace</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                {activePage}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Welcome back! Here's what's happening at NexusHR.
              </p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm">
              ◷ Friday, 16 October 2026
            </div>
          </section>

          {activePage === 'Dashboard' ? (
            <>
              {/* Statistics */}
              <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <article key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">{stat.value}</p>
                      </div>
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl font-bold ${stat.style}`}>
                        {stat.icon}
                      </div>
                    </div>
                    <p className="mt-4 text-sm">
                      <span className={stat.change.startsWith('+') ? 'font-semibold text-emerald-600' : 'font-semibold text-red-500'}>
                        {stat.change}
                      </span>
                      <span className="ml-2 text-slate-400">from last month</span>
                    </p>
                  </article>
                ))}
              </section>

              {/* Charts and activity */}
              <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900">Attendance Overview</h3>
                    <span className="text-xs text-slate-500">This week</span>
                  </div>
                  <div className="mt-7 flex h-48 items-end justify-between gap-2 border-b border-slate-100 pb-2">
                    {attendance.map((day) => (
                      <div key={day.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                        <div className="flex h-40 w-full items-end justify-center gap-1">
                          <div
                            title={`${day.present}% present`}
                            className="w-3 rounded-t-md bg-blue-600 sm:w-5"
                            style={{ height: `${day.present}%` }}
                          />
                          <div
                            title={`${day.absent}% absent`}
                            className="w-2 rounded-t-md bg-slate-200 sm:w-3"
                            style={{ height: `${day.absent}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-500">{day.day}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-center gap-5 text-xs text-slate-500">
                    <span><span className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-blue-600" />Present</span>
                    <span><span className="mr-2 inline-block h-2.5 w-2.5 rounded-sm bg-slate-200" />Absent</span>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="font-bold text-slate-900">Department Distribution</h3>
                  <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
                    <div
                      className="flex h-36 w-36 shrink-0 items-center justify-center rounded-full"
                      style={{ background: 'conic-gradient(#2563eb 0% 32%, #10b981 32% 48%, #f59e0b 48% 60%, #a78bfa 60% 80%, #fb7185 80% 92%, #cbd5e1 92% 100%)' }}
                    >
                      <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-white">
                        <span className="text-2xl font-bold text-slate-900">125</span>
                        <span className="text-xs text-slate-500">Employees</span>
                      </div>
                    </div>
                    <div className="w-full space-y-3">
                      {[
                        ['Engineering', '32%', 'bg-blue-600'],
                        ['HR', '16%', 'bg-emerald-500'],
                        ['Finance', '12%', 'bg-amber-500'],
                        ['Sales', '20%', 'bg-violet-400'],
                        ['Marketing', '12%', 'bg-rose-400'],
                        ['Others', '8%', 'bg-slate-300'],
                      ].map(([name, value, color]) => (
                        <div key={name} className="flex items-center gap-2 text-sm">
                          <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                          <span className="flex-1 text-slate-600">{name}</span>
                          <span className="font-semibold text-slate-700">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>

                <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Recent Activities</h3>
                    <button onClick={() => setActivePage('Reports')} className="text-sm font-medium text-blue-600 hover:text-blue-800">View all</button>
                  </div>
                  <div className="mt-5 space-y-5">
                    {activities.map((activity) => (
                      <div key={activity.title} className="flex items-start gap-3">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${activity.color}`}>
                          {activity.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-800">{activity.title}</p>
                          <p className="mt-1 text-xs leading-5 text-slate-500">{activity.detail}</p>
                          <p className="mt-1 text-xs text-slate-400">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            </>
          ) : (
            <section className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">{activePage}</h3>
              <p className="mt-2 text-sm text-slate-500">
                This section is part of the NexusHR navigation. We'll implement its features step by step.
              </p>
              {activePage === 'Employees' && (
                <p className="mt-4 text-sm text-blue-600">Use the employee table below on the Dashboard to preview the current sample records.</p>
              )}
            </section>
          )}

          {/* Recent employees */}
          <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-5">
              <div>
                <h3 className="font-bold text-slate-900">Recent Employees</h3>
                <p className="mt-1 text-xs text-slate-500">Sample records for the UI preview</p>
              </div>
              <button
                onClick={() => setActivePage('Employees')}
                className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50"
              >
                Manage employees →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Employee</th>
                    <th className="px-5 py-4 font-semibold">Position</th>
                    <th className="px-5 py-4 font-semibold">Department</th>
                    <th className="px-5 py-4 font-semibold">Email</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Joining Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold ${employee.color}`}>
                            {employee.initials}
                          </div>
                          <span className="font-semibold text-slate-800">{employee.name}</span>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">{employee.role}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">{employee.department}</td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">{employee.email}</td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          {employee.status}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-slate-500">{employee.date}</td>
                    </tr>
                  ))}
                  {filteredEmployees.length === 0 && (
                    <tr>
                      <td colSpan="6" className="px-5 py-10 text-center text-slate-500">
                        No employees match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
              Showing {filteredEmployees.length} of {employees.length} sample employees
            </div>
          </section>

          <footer className="pb-2 text-center text-xs text-slate-400">
            © 2026 NexusHR · Workforce Intelligence Platform
          </footer>
        </div>
      </main>
    </div>
  )
} 

export default App
