
import { useEffect, useState } from 'react'
const navigation = [
  { name: 'Dashboard', icon: '⌂' },
  { name: 'Employees', icon: '♟' },
  { name: 'Attendance', icon: '▦' },
  { name: 'Leave Management', icon: '▣' },
  { name: 'Performance', icon: '▥' },
  { name: 'Recruitment', icon: '▤' },
  { name: 'Payroll', icon: '₹' },
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
   const [token, setToken] = useState(
    () => sessionStorage.getItem('nexushr_token') || ''
  )
  const [activePage, setActivePage] = useState('Dashboard')
  const [search, setSearch] = useState('')
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
const [attendanceRecords, setAttendanceRecords] = useState([])
const [attendanceLoading, setAttendanceLoading] = useState(false)
const [selectedEmployeeId, setSelectedEmployeeId] = useState('')

const [leaveRequests, setLeaveRequests] = useState([])
const [leaveLoading, setLeaveLoading] = useState(false)

const [leaveEmployeeId, setLeaveEmployeeId] = useState('')
const [leaveStartDate, setLeaveStartDate] = useState('')
const [leaveEndDate, setLeaveEndDate] = useState('')
const [leaveReason, setLeaveReason] = useState('')


const [performanceReviews, setPerformanceReviews] = useState([]);
const [performanceLoading, setPerformanceLoading] = useState(false);
const [performanceError, setPerformanceError] = useState("");



const [jobOpenings, setJobOpenings] = useState([]);
const [candidates, setCandidates] = useState([]);
const [interviews, setInterviews] = useState([]);
const [showInterviewForm, setShowInterviewForm] = useState(false);
const [interviewForm, setInterviewForm] = useState({
  candidateId: "",
  interviewDate: "",
  interviewTime: "",
  interviewerName: "",
  meetingLink: "",
  notes: "",
});
const [payrollRecords, setPayrollRecords] = useState([]);
const [payrollLoading, setPayrollLoading] = useState(false);
const [payrollError, setPayrollError] = useState("");
const [payrollForm, setPayrollForm] = useState({
  employeeId: "",
  payPeriod: new Date().toISOString().slice(0, 7),
  basicSalary: "",
  hra: "",
  allowances: "",
  deductions: "",
});




const totalJobOpenings = jobOpenings.length;

const openJobOpenings = jobOpenings.filter(
  (job) => job.status === "OPEN"
).length;

const totalCandidates = candidates.length;

const interviewCandidates = candidates.filter(
  (candidate) => candidate.status === "INTERVIEW"
).length;

const selectedCandidates = candidates.filter(
  (candidate) => candidate.status === "SELECTED"
).length;

const rejectedCandidates = candidates.filter(
  (candidate) => candidate.status === "REJECTED"
).length;



const [candidateSearch, setCandidateSearch] = useState("");
const [candidateStatusFilter, setCandidateStatusFilter] = useState("ALL");
const [selectedJobFilter, setSelectedJobFilter] = useState("ALL");



const filteredCandidates = candidates.filter((candidate) => {
  const searchText = candidateSearch.trim().toLowerCase();

  const matchesSearch =
    (candidate.fullName || "").toLowerCase().includes(searchText) ||
    (candidate.email || "").toLowerCase().includes(searchText);

  const matchesStatus =
    candidateStatusFilter === "ALL" ||
    candidate.status === candidateStatusFilter;

  const matchesJob =
    selectedJobFilter === "ALL" ||
    Number(candidate.jobOpeningId) === Number(selectedJobFilter);

  return matchesSearch && matchesStatus && matchesJob;
});


const getApplicantsCount = (jobId) => {
  return candidates.filter(
    (candidate) =>
      Number(candidate.jobOpeningId) === Number(jobId)
  ).length;
};


const [recruitmentLoading, setRecruitmentLoading] = useState(false);
const [recruitmentError, setRecruitmentError] = useState("");
const [showJobForm, setShowJobForm] = useState(false);

const [showCandidateForm, setShowCandidateForm] = useState(false);

const [candidateForm, setCandidateForm] = useState({
  fullName: "",
  email: "",
  phone: "",
  skills: "",
  jobOpeningId: "",
});
const [editingCandidateId, setEditingCandidateId] = useState(null);
const [selectedCandidate, setSelectedCandidate] = useState(null);

const [jobForm, setJobForm] = useState({
  title: "",
  department: "",
  location: "",
  employmentType: "FULL_TIME",
  closingDate: "",
  description: "",
});
const [editingJobId, setEditingJobId] = useState(null);


const [performanceForm, setPerformanceForm] = useState({
  employeeId: "",
  reviewPeriod: "",
  rating: 3,
  goals: "",
  feedback: "",
});

const [editingPerformanceId, setEditingPerformanceId] = useState(null);



  



const [attendanceDate, setAttendanceDate] = useState(
  new Date().toISOString().split('T')[0]
)
const [attendanceStatus, setAttendanceStatus] = useState('PRESENT')

   const [formData, setFormData] = useState({
  name: '',
  email: '',
  department: '',
  designation: '',
})


const handleInputChange = (event) => {
  const { name, value } = event.target

  setFormData((previousData) => ({
    ...previousData,
    [name]: value,
  }))
}



const handleSubmit = async (event) => {
  event.preventDefault()

  try {
    const response = await fetch('/api/employees', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(formData),
});

    if (!response.ok) {
      throw new Error('Failed to save employee')
    }

    const newEmployee = await response.json()

    setEmployees((previousEmployees) => [
      ...previousEmployees,
      newEmployee,
    ])

    setFormData({
      name: '',
      email: '',
      department: '',
      designation: '',
    })

    setActivePage('Employees')
    alert('Employee added successfully!')
  } catch (error) {
    console.error('Error saving employee:', error)
    alert('Could not save employee. Please check the backend.')
  }
}



const handleUpdate = async (event) => {
  event.preventDefault()

  if (editingId === null) {
    alert('Please select an employee to edit.')
    return
  }

  try {
    
const response = await fetch(`/api/employees/${editingId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify(formData),
});


    if (!response.ok) {
      throw new Error('Failed to update employee')
    }

    // Update the employee in the frontend list
    setEmployees((previousEmployees) =>
      previousEmployees.map((employee) =>
        employee.id === editingId
          ? { ...employee, ...formData }
          : employee
      )
    )

    setEditingId(null)
    setActivePage('Employees')
    alert('Employee updated successfully!')
  } catch (error) {
    console.error('Error updating employee:', error)
    alert('Could not update employee. Please check the backend.')
  }
}




const handleDelete = async (employeeId) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this employee?'
  )

  if (!confirmed) {
    return
  }

  try {
    
    const response = await fetch(`/api/employees/${employeeId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })


    if (!response.ok) {
      throw new Error('Failed to delete employee')
    }

    setEmployees((previousEmployees) =>
      previousEmployees.filter(
        (employee) => employee.id !== employeeId
      )
    )

    alert('Employee deleted successfully!')
  } catch (error) {
    console.error('Error deleting employee:', error)
    alert('Could not delete employee. Please check the backend.')
  }
}



const loadAttendance = async (employeeId) => {
  setAttendanceLoading(true);

  try {
    const response = await fetch(
      `/api/attendance/employee/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to load attendance: HTTP ${response.status}`
      );
    }

    const data = await response.json();
    setAttendanceRecords(data);
  } catch (error) {
    console.error('Error loading attendance:', error);
    alert(error.message);
  } finally {
    setAttendanceLoading(false);
  }
};





const handleCheckIn = async (employeeId) => {
  try {
    const response = await fetch(
  `/api/attendance/check-in/${employeeId}`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

    const message = await response.text()

if (!response.ok) {
  throw new Error(message || 'Check-in failed')
}

    alert('Check-in successful!')
    await loadAttendance(employeeId)
  } catch (error) {
    console.error('Check-in error:', error)
    alert(error.message || 'Could not check in.')
  }
}





const handleCheckOut = async (employeeId) => {
  try {
    const response = await fetch(
      `/api/attendance/check-out/${employeeId}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Read the response as text first
    const responseText = await response.text();

    // Handle backend errors
    if (!response.ok) {
      throw new Error(
        responseText || `Check-out failed: HTTP ${response.status}`
      );
    }

    // Parse JSON only when the response contains a body
    const data = responseText
      ? JSON.parse(responseText)
      : null;

    console.log('Check-out response:', data);

    alert('Check-out successful!');

    // Refresh attendance history
    await loadAttendance(employeeId);
  } catch (error) {
    console.error('Check-out error:', error);
    alert(error.message || 'Could not check out.');
  }
};



const handleMarkAttendance = async () => {
  if (!selectedEmployeeId) {
    alert('Please select an employee')
    return
  }

  try {
    const response = await fetch('/api/attendance/mark', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    employeeId: Number(selectedEmployeeId),
    date: attendanceDate,
    status: attendanceStatus,
  }),
});

    const result = await response.text()

    if (!response.ok) {
      throw new Error(result || 'Failed to mark attendance')
    }

    alert('Attendance marked successfully!')
    await loadAttendance(selectedEmployeeId)
  } catch (error) {
    alert(error.message)
  }
}





const loadLeaveRequests = async () => {
  setLeaveLoading(true)

  try {
    const response = await fetch('/api/leaves', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to load leave requests: HTTP ${response.status}`)
    }

    const data = await response.json()
    setLeaveRequests(Array.isArray(data) ? data : [data])
  } catch (error) {
    console.error('Error loading leave requests:', error)
    alert(error.message)
  } finally {
    setLeaveLoading(false)
  }
}


const handleApplyLeave = async (event) => {
  event.preventDefault()

  if (!leaveEmployeeId || !leaveStartDate || !leaveEndDate || !leaveReason.trim()) {
    alert('Please fill in all leave details')
    return
  }

  if (leaveEndDate < leaveStartDate) {
    alert('End date cannot be before start date')
    return
  }

  try {
    const response = await fetch('/api/leaves', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
           Authorization: `Bearer ${token}`,
     },
      body: JSON.stringify({
        employeeId: Number(leaveEmployeeId),
        startDate: leaveStartDate,
        endDate: leaveEndDate,
        reason: leaveReason.trim(),
      }),
    })

    const result = await response.text()

    if (!response.ok) {
      throw new Error(result || 'Failed to submit leave request')
    }

    alert('Leave request submitted successfully!')

    setLeaveEmployeeId('')
    setLeaveStartDate('')
    setLeaveEndDate('')
    setLeaveReason('')

    await loadLeaveRequests()
  } catch (error) {
    alert(error.message)
  }
}

const handleUpdateLeaveStatus = async (id, status) => {
  try {
    const response = await fetch(
  `/api/leaves/${id}/status?status=${status}`,
  {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
)

    const result = await response.text()

    if (!response.ok) {
      throw new Error(result || 'Failed to update leave status')
    }

    alert(`Leave request ${status.toLowerCase()} successfully!`)
    await loadLeaveRequests()
  } catch (error) {
    alert(error.message)
  }
}


const loadPerformanceReviews = async () => {
  setPerformanceLoading(true);
  setPerformanceError("");

  try {
    const response = await fetch("/api/performance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        responseText || `Failed to load reviews: HTTP ${response.status}`
      );
    }

    setPerformanceReviews(
      responseText ? JSON.parse(responseText) : []
    );
  } catch (error) {
    setPerformanceError(error.message);
  } finally {
    setPerformanceLoading(false);
  }
};

const handlePerformanceInputChange = (event) => {
  const { name, value } = event.target;

  setPerformanceForm((previous) => ({
    ...previous,
    [name]: name === "rating" ? Number(value) : value,
  }));
};

const resetPerformanceForm = () => {
  setPerformanceForm({
    employeeId: "",
    reviewPeriod: "",
    rating: 3,
    goals: "",
    feedback: "",
  });

  setEditingPerformanceId(null);
};

const handlePerformanceSubmit = async (event) => {
  event.preventDefault();
  setPerformanceError("");

  const payload = {
    employeeId: Number(performanceForm.employeeId),
    reviewPeriod: performanceForm.reviewPeriod.trim(),
    rating: Number(performanceForm.rating),
    goals: performanceForm.goals.trim(),
    feedback: performanceForm.feedback.trim(),
  };

  try {
    const isEditing = editingPerformanceId !== null;

    const response = await fetch(
      isEditing
        ? `/api/performance/${editingPerformanceId}`
        : "/api/performance",
      {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const responseText = await response.text();

    if (!response.ok) {
      throw new Error(
        responseText || `Request failed: HTTP ${response.status}`
      );
    }

    resetPerformanceForm();
    await loadPerformanceReviews();
  } catch (error) {
    setPerformanceError(error.message);
  }
};

const handleEditPerformance = (review) => {
  setPerformanceForm({
    employeeId: String(review.employeeId),
    reviewPeriod: review.reviewPeriod || "",
    rating: Number(review.rating || 3),
    goals: review.goals || "",
    feedback: review.feedback || "",
  });

  setEditingPerformanceId(review.id);
};

const formatInterviewTime = (value) => {
  if (!value) return "—";
  if (typeof value === "string") return value.slice(0, 5);
  if (Array.isArray(value)) {
    const [hours, minutes] = value;
    return `${String(hours).padStart(2, "0")}:${String(minutes ?? 0).padStart(2, "0")}`;
  }
  return String(value);
};

const formatMoney = (value) =>
  Number(value || 0).toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });

const getEmployeeName = (employeeId) => {
  const employee = employees.find(
    (item) => Number(item.id) === Number(employeeId)
  );
  return employee?.name || `Employee #${employeeId}`;
};

const getCandidateName = (candidateId) => {
  const candidate = candidates.find(
    (item) => Number(item.id) === Number(candidateId)
  );
  return candidate?.fullName || `Candidate #${candidateId}`;
};

const handleInterviewInputChange = (event) => {
  const { name, value } = event.target;
  setInterviewForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handleScheduleInterview = async (event) => {
  event.preventDefault();
  setRecruitmentError("");

  if (
    !interviewForm.candidateId ||
    !interviewForm.interviewDate ||
    !interviewForm.interviewTime ||
    !interviewForm.interviewerName.trim()
  ) {
    setRecruitmentError("Candidate, date, time, and interviewer are required.");
    return;
  }

  try {
    setRecruitmentLoading(true);

    const response = await fetch("/api/recruitment/interviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        candidateId: Number(interviewForm.candidateId),
        interviewDate: interviewForm.interviewDate,
        interviewTime:
          interviewForm.interviewTime.length === 5
            ? `${interviewForm.interviewTime}:00`
            : interviewForm.interviewTime,
        interviewerName: interviewForm.interviewerName.trim(),
        meetingLink: interviewForm.meetingLink.trim(),
        notes: interviewForm.notes.trim(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = errorText;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorText;
      } catch {
        // keep text
      }
      throw new Error(errorMessage || "Failed to schedule interview");
    }

    setInterviewForm({
      candidateId: "",
      interviewDate: "",
      interviewTime: "",
      interviewerName: "",
      meetingLink: "",
      notes: "",
    });
    setShowInterviewForm(false);
    await loadRecruitmentData();
  } catch (error) {
    setRecruitmentError(error.message);
  } finally {
    setRecruitmentLoading(false);
  }
};

const handleUpdateInterviewStatus = async (interviewId, status) => {
  setRecruitmentLoading(true);
  setRecruitmentError("");

  try {
    const response = await fetch(
      `/api/recruitment/interviews/${interviewId}/status?status=${encodeURIComponent(status)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to update interview status");
    }

    await loadRecruitmentData();
  } catch (error) {
    setRecruitmentError(error.message);
  } finally {
    setRecruitmentLoading(false);
  }
};

const loadPayrollRecords = async () => {
  setPayrollLoading(true);
  setPayrollError("");

  try {
    const response = await fetch("/api/payroll", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Payroll request failed: HTTP ${response.status}`);
    }

    const data = await response.json();
    setPayrollRecords(Array.isArray(data) ? data : []);
  } catch (error) {
    setPayrollError(error.message);
  } finally {
    setPayrollLoading(false);
  }
};

const handlePayrollInputChange = (event) => {
  const { name, value } = event.target;
  setPayrollForm((previous) => ({
    ...previous,
    [name]: value,
  }));
};

const handleGeneratePayroll = async (event) => {
  event.preventDefault();
  setPayrollError("");

  if (!payrollForm.employeeId || !payrollForm.payPeriod || !payrollForm.basicSalary) {
    setPayrollError("Employee, pay period, and basic salary are required.");
    return;
  }

  try {
    setPayrollLoading(true);

    const response = await fetch("/api/payroll", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        employeeId: Number(payrollForm.employeeId),
        payPeriod: payrollForm.payPeriod,
        basicSalary: Number(payrollForm.basicSalary),
        hra: Number(payrollForm.hra || 0),
        allowances: Number(payrollForm.allowances || 0),
        deductions: Number(payrollForm.deductions || 0),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = errorText;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorText;
      } catch {
        // keep text
      }
      throw new Error(errorMessage || "Failed to generate payroll");
    }

    setPayrollForm({
      employeeId: "",
      payPeriod: new Date().toISOString().slice(0, 7),
      basicSalary: "",
      hra: "",
      allowances: "",
      deductions: "",
    });
    await loadPayrollRecords();
  } catch (error) {
    setPayrollError(error.message);
  } finally {
    setPayrollLoading(false);
  }
};

const handleMarkPayrollPaid = async (id) => {
  setPayrollError("");

  try {
    const response = await fetch(`/api/payroll/${id}/pay`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to mark payroll as paid");
    }

    await loadPayrollRecords();
  } catch (error) {
    setPayrollError(error.message);
  }
};

const handleDownloadPayslip = async (payroll) => {
  const employeeName = getEmployeeName(payroll.employeeId);
  const payslipWindow = window.open("", "_blank");

  if (!payslipWindow) {
    alert("Please allow pop-ups to view the payslip.");
    return;
  }

  payslipWindow.document.write(`
    <html>
      <head>
        <title>Payslip ${payroll.payPeriod}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 32px; color: #0f172a; }
          h1 { margin-bottom: 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 24px; }
          th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
          .total { font-weight: bold; background: #f8fafc; }
        </style>
      </head>
      <body>
        <h1>NexusHR Payslip</h1>
        <p>${employeeName} · Period ${payroll.payPeriod} · Status ${payroll.status}</p>
        <table>
          <tr><th>Component</th><th>Amount</th></tr>
          <tr><td>Basic Salary</td><td>${formatMoney(payroll.basicSalary)}</td></tr>
          <tr><td>HRA</td><td>${formatMoney(payroll.hra)}</td></tr>
          <tr><td>Allowances</td><td>${formatMoney(payroll.allowances)}</td></tr>
          <tr><td>Deductions</td><td>${formatMoney(payroll.deductions)}</td></tr>
          <tr><td>Tax</td><td>${formatMoney(payroll.tax)}</td></tr>
          <tr class="total"><td>Net Salary</td><td>${formatMoney(payroll.netSalary)}</td></tr>
        </table>
      </body>
    </html>
  `);
  payslipWindow.document.close();
  payslipWindow.focus();
  payslipWindow.print();
};

const departmentGroups = employees.reduce((groups, employee) => {
  const department = employee.department || "Unassigned";
  if (!groups[department]) {
    groups[department] = [];
  }
  groups[department].push(employee);
  return groups;
}, {});

const handleDeletePerformance = async (id) => {
  if (!window.confirm("Are you sure you want to delete this review?")) {
    return;
  }

  setPerformanceError("");

  try {
    const response = await fetch(`/api/performance/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || `Delete failed: HTTP ${response.status}`);
    }

    await loadPerformanceReviews();
  } catch (error) {
    setPerformanceError(error.message);
  }
};




const loadRecruitmentData = async () => {
  setRecruitmentLoading(true);
  setRecruitmentError("");

  try {
    const [jobsResponse, candidatesResponse, interviewsResponse] = await Promise.all([
      fetch("/api/recruitment/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch("/api/recruitment/candidates", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      fetch("/api/recruitment/interviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    ]);

    if (!jobsResponse.ok) {
      throw new Error(`Jobs request failed: HTTP ${jobsResponse.status}`);
    }

    if (!candidatesResponse.ok) {
      throw new Error(
        `Candidates request failed: HTTP ${candidatesResponse.status}`
      );
    }

    if (!interviewsResponse.ok) {
      throw new Error(
        `Interviews request failed: HTTP ${interviewsResponse.status}`
      );
    }

    const jobs = await jobsResponse.json();
    const candidateList = await candidatesResponse.json();
    const interviewList = await interviewsResponse.json();

    setJobOpenings(jobs);
    setCandidates(candidateList);
    setInterviews(Array.isArray(interviewList) ? interviewList : []);
  } catch (error) {
    console.error("Recruitment loading error:", error);
    setRecruitmentError(error.message);
  } finally {
    setRecruitmentLoading(false);
  }
};

const handleJobInputChange = (event) => {
  const { name, value } = event.target;

  setJobForm((previousForm) => ({
    ...previousForm,
    [name]: value,
  }));
};


const handleCandidateInputChange = (event) => {
  const { name, value } = event.target;

  setCandidateForm((previousForm) => ({
    ...previousForm,
    [name]: value,
  }));
};

const handleEditCandidate = (candidate) => {
  setCandidateForm({
    fullName: candidate.fullName || "",
    email: candidate.email || "",
    phone: candidate.phone || "",
    skills: candidate.skills || "",
    jobOpeningId: String(candidate.jobOpeningId || ""),
  });

  setEditingCandidateId(candidate.id);
  setShowCandidateForm(true);
};



const handleCreateCandidate = async (event) => {

  if (
  !candidateForm.fullName.trim() ||
  !candidateForm.email.trim()
) {
  setRecruitmentError("Candidate name and email are required.");
  return;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailPattern.test(candidateForm.email.trim())) {
  setRecruitmentError("Please enter a valid email address.");
  return;
}

setRecruitmentError("");

  event.preventDefault();

  const isEditing = editingCandidateId !== null;

  const url = isEditing
    ? `/api/recruitment/candidates/${editingCandidateId}`
    : "/api/recruitment/candidates";

  const method = isEditing ? "PUT" : "POST";

  try {
    setRecruitmentLoading(true);
    setRecruitmentError("");

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...candidateForm,
        jobOpeningId: Number(candidateForm.jobOpeningId),
      }),
    });

   if (!response.ok) {
  const errorText = await response.text();

  let errorMessage = errorText;

  try {
    const errorData = JSON.parse(errorText);
    errorMessage =
      errorData.message ||
      errorData.error ||
      errorText;
  } catch {
    // Keep the original response text
  }

  throw new Error(
    errorMessage || "Failed to create candidate"
  );
}

    await loadRecruitmentData();

    setCandidateForm({
      fullName: "",
      email: "",
      phone: "",
      skills: "",
      jobOpeningId: "",
    });

    setEditingCandidateId(null);
    setShowCandidateForm(false);
  } catch (error) {
    setRecruitmentError(error.message);
  } finally {
    setRecruitmentLoading(false);
  }
};



const handleUpdateCandidateStatus = async (candidateId, newStatus) => {
  setRecruitmentLoading(true);
  setRecruitmentError("");

  try {
    const response = await fetch(
      `/api/recruitment/candidates/${candidateId}/status?status=${encodeURIComponent(newStatus)}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Failed to update status: HTTP ${response.status}`
      );
    }

    await loadRecruitmentData();
  } catch (error) {
    console.error("Candidate status update error:", error);
    setRecruitmentError(error.message);
  } finally {
    setRecruitmentLoading(false);
  }
};


const handleDeleteCandidate = async (candidateId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this candidate?"
  );

  if (!confirmed) {
    return;
  }

  setRecruitmentLoading(true);
  setRecruitmentError("");

  try {
    const response = await fetch(
      `/api/recruitment/candidates/${candidateId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Failed to delete candidate: HTTP ${response.status}`
      );
    }

    await loadRecruitmentData();
  } catch (error) {
    console.error("Candidate deletion error:", error);
    setRecruitmentError(error.message);
  } finally {
    setRecruitmentLoading(false);
  }
};



const handleCreateJob = async (event) => {
  event.preventDefault();

  const isEditing = editingJobId !== null;

  const url = isEditing
    ? `/api/recruitment/jobs/${editingJobId}`
    : "/api/recruitment/jobs";

  const method = isEditing ? "PUT" : "POST";

  setRecruitmentLoading(true);
  setRecruitmentError("");

  try {
    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(jobForm),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText ||
          `Failed to ${isEditing ? "update" : "create"} job: HTTP ${response.status}`
      );
    }

    await loadRecruitmentData();

    setJobForm({
      title: "",
      department: "",
      location: "",
      employmentType: "FULL_TIME",
      closingDate: "",
      description: "",
    });

    setEditingJobId(null);
    setShowJobForm(false);
  } catch (error) {
    console.error("Job save error:", error);
    setRecruitmentError(error.message);
  } finally {
    setRecruitmentLoading(false);
  }
};




const handleEditJob = (job) => {
  setJobForm({
    title: job.title || "",
    department: job.department || "",
    location: job.location || "",
    employmentType: job.employmentType || "FULL_TIME",
    closingDate: job.closingDate
      ? String(job.closingDate).slice(0, 10)
      : "",
    description: job.description || "",
  });

  setEditingJobId(job.id);
  setShowJobForm(true);
};




const handleDeleteJob = async (jobId) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this job opening?"
  );

  if (!confirmed) {
    return;
  }

  setRecruitmentLoading(true);
  setRecruitmentError("");

  try {
    const response = await fetch(
      `/api/recruitment/jobs/${jobId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        errorText || `Failed to delete job: HTTP ${response.status}`
      );
    }

    await loadRecruitmentData();

    if (editingJobId === jobId) {
      setEditingJobId(null);
      setShowJobForm(false);
      setJobForm({
        title: "",
        department: "",
        location: "",
        employmentType: "FULL_TIME",
        closingDate: "",
        description: "",
      });
    }
  } catch (error) {
    console.error("Job deletion error:", error);
    setRecruitmentError(error.message);
  } finally {
    setRecruitmentLoading(false);
  }
};




const handleLogin = async (event) => {
  event.preventDefault();

  const form = event.currentTarget;
  const username = form.username.value.trim();
  const password = form.password.value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const responseText = await response.text();

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = { message: responseText };
    }

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (!data.token) {
      throw new Error('Login response did not contain a token');
    }

    // Save the new JWT token
    sessionStorage.setItem('nexushr_token', data.token);

    // Update React state
    setToken(data.token);

    alert('Login successful!');
  } catch (error) {
    alert(error.message);
  }
};









useEffect(() => {
  if (!token) {
    setLoading(false);
    return;
  }

  fetch('/api/employees', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(async (response) => {
      const responseText = await response.text();

      console.log('Employee API status:', response.status);
      console.log('Employee API response:', responseText);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch employees: ${response.status}`
        );
      }

      return JSON.parse(responseText);
    })
    .then((data) => {
      const employeeList = Array.isArray(data)
        ? data
        : Array.isArray(data.value)
          ? data.value
          : [];

      console.log('Parsed employee list:', employeeList);
      setEmployees(employeeList);
    })
    .catch((error) => {
      console.error('Error fetching employees:', error);
    })
    .finally(() => {
      setLoading(false);
    });
}, [token]);



useEffect(() => {
  if (activePage === 'Leave Management' || activePage === 'Reports') {
    loadLeaveRequests()
  }
}, [activePage])


useEffect(() => {
  if (activePage === "Performance" && token) {
    loadPerformanceReviews();
  }
}, [activePage, token]);

const filteredEmployees = employees.filter((employee) =>
  `${employee.name} ${employee.designation} ${employee.department} ${employee.email}`
    .toLowerCase()
    .includes(search.toLowerCase())
)
   

useEffect(() => {
  if ((activePage === "Recruitment" || activePage === "Reports") && token) {
    loadRecruitmentData();
  }
}, [activePage, token]);

useEffect(() => {
  if ((activePage === "Payroll" || activePage === "Reports") && token) {
    loadPayrollRecords();
  }
}, [activePage, token]);




return (
  <>
    {!token ? (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-xl"
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">
              NexusHR
            </h1>
            <p className="mt-2 text-slate-500">
              Sign in to your workforce dashboard
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Username
            </label>
            <input
              name="username"
              type="text"
              required
              autoComplete="username"
              className="w-full rounded-lg border p-3"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border p-3"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 font-semibold text-white hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    ) : (
      <div className="min-h-screen bg-slate-100 text-slate-800 md:flex">
      {loading && <p>Loading employees...</p>}
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
                 
            ) : activePage === 'Attendance' ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">
                  Attendance Management
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Select an employee to manage attendance.
                </p>

                <div className="mt-6 max-w-md">
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Select Employee
                  </label>

                  <select
                    value={selectedEmployeeId}
                    onChange={(event) => {
                      const employeeId = event.target.value
                      setSelectedEmployeeId(employeeId)

                      if (employeeId) {
                        loadAttendance(employeeId)
                      } else {
                        setAttendanceRecords([])
                      }
                    }}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                  >
                    <option value="">Choose an employee</option>

                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} (ID: {employee.id})
                      </option>
                    ))}
                  </select>
                </div>
                
                    {/* Admin Mark Attendance */}
                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-5">
                      <h4 className="text-lg font-semibold text-slate-900">
                        Admin Mark Attendance
                      </h4>

                      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Attendance Date
                          </label>

                          <input
                            type="date"
                            value={attendanceDate}
                            onChange={(event) => setAttendanceDate(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                          />
                        </div>

                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Attendance Status
                          </label>

                          <select
                            value={attendanceStatus}
                            onChange={(event) => setAttendanceStatus(event.target.value)}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                          >
                            <option value="PRESENT">Present</option>
                            <option value="ABSENT">Absent</option>
                            <option value="LEAVE">Leave</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={!selectedEmployeeId || !attendanceDate}
                        onClick={handleMarkAttendance}
                        className="mt-4 rounded-lg bg-purple-600 px-5 py-2.5 font-semibold text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Save Attendance
                      </button>
                    </div>



                    <div className="mt-6 flex flex-wrap gap-3">
                      <button
                        type="button"
                        disabled={!selectedEmployeeId}
                        onClick={() => handleCheckIn(selectedEmployeeId)}
                        className="rounded-lg bg-emerald-600 px-5 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Check In
                      </button>

                      <button
                        type="button"
                        disabled={!selectedEmployeeId}
                        onClick={() => handleCheckOut(selectedEmployeeId)}
                        className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Check Out
                      </button>

                      
                    </div>
                
                    <div className="mt-8">
                      <h4 className="mb-4 text-lg font-semibold text-slate-900">
                        Attendance History
                      </h4>

                      {attendanceLoading ? (
                        <p className="text-sm text-slate-500">
                          Loading attendance records...
                        </p>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-sm">
                            <thead className="border-b bg-slate-50 text-slate-500">
                              <tr>
                                <th className="p-3">Employee ID</th>
                                <th className="p-3">Date</th>
                                <th className="p-3">Check In</th>
                                <th className="p-3">Check Out</th>
                                <th className="p-3">Status</th>
                              </tr>
                            </thead>

                            <tbody>
                              {attendanceRecords.map((record) => (
                                <tr key={record.id} className="border-b border-slate-100">
                                  <td className="p-3">{record.employeeId}</td>
                                  <td className="p-3">{record.attendanceDate}</td>
                                  <td className="p-3">
                                    {record.checkIn
                                      ? new Date(record.checkIn).toLocaleTimeString()
                                      : '-'}
                                  </td>
                                  <td className="p-3">
                                    {record.checkOut
                                      ? new Date(record.checkOut).toLocaleTimeString()
                                      : '-'}
                                  </td>
                                  <td className="p-3">
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                      {record.status}
                                    </span>
                                  </td>
                                </tr>
                              ))}

                              {attendanceRecords.length === 0 && (
                                <tr>
                                  <td colSpan="5" className="p-6 text-center text-slate-500">
                                    No attendance records found.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>


       
            </section>
            ) : activePage === 'Leave Management' ? (
              <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900">
                  Leave Management
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Submit leave requests and manage employee leave applications.
                </p>

                {/* Apply for Leave */}
                <form onSubmit={handleApplyLeave} className="mt-6 max-w-2xl space-y-4">
                  <h4 className="text-lg font-semibold text-slate-900">
                    Apply for Leave
                  </h4>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Select Employee
                    </label>

                    <select
                      value={leaveEmployeeId}
                      onChange={(event) => setLeaveEmployeeId(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5"
                      required
                    >
                      <option value="">Choose an employee</option>
                      {employees.map((employee) => (
                        <option key={employee.id} value={employee.id}>
                          {employee.name} (ID: {employee.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={leaveStartDate}
                        onChange={(event) => setLeaveStartDate(event.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                        required
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-slate-700">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={leaveEndDate}
                        min={leaveStartDate || undefined}
                        onChange={(event) => setLeaveEndDate(event.target.value)}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Reason
                    </label>
                    <textarea
                      value={leaveReason}
                      onChange={(event) => setLeaveReason(event.target.value)}
                      placeholder="Enter the reason for leave"
                      rows={3}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2.5"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                  >
                    Submit Leave Request
                  </button>
                </form>

                {/* Leave Requests */}
                <div className="mt-10">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-lg font-semibold text-slate-900">
                      Leave Requests
                    </h4>

                    <button
                      type="button"
                      onClick={loadLeaveRequests}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                    >
                      Refresh
                    </button>
                  </div>

                  {leaveLoading ? (
                    <p className="text-sm text-slate-500">Loading leave requests...</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="border-b bg-slate-50 text-slate-500">
                          <tr>
                            <th className="p-3">Employee ID</th>
                            <th className="p-3">Start Date</th>
                            <th className="p-3">End Date</th>
                            <th className="p-3">Reason</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Actions</th>
                          </tr>
                        </thead>

                        <tbody>
                          {leaveRequests.map((request) => (
                            <tr key={request.id} className="border-b border-slate-100">
                              <td className="p-3">{request.employeeId}</td>
                              <td className="p-3">{request.startDate}</td>
                              <td className="p-3">{request.endDate}</td>
                              <td className="p-3">{request.reason}</td>
                              <td className="p-3">
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                                  {request.status}
                                </span>
                              </td>
                              <td className="p-3">
                                {request.status === 'PENDING' ? (
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateLeaveStatus(request.id, 'APPROVED')
                                      }
                                      className="rounded-md bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700 hover:bg-emerald-100"
                                    >
                                      Approve
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleUpdateLeaveStatus(request.id, 'REJECTED')
                                      }
                                      className="rounded-md bg-red-50 px-3 py-1.5 font-medium text-red-700 hover:bg-red-100"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-slate-400">No actions</span>
                                )}
                              </td>
                            </tr>
                          ))}

                          {leaveRequests.length === 0 && (
                            <tr>
                              <td colSpan={6} className="p-6 text-center text-slate-500">
                                No leave requests found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>


              </section>






) : activePage === "Performance" ? (
  <section className="space-y-6">

    {/* Performance Page Header */}
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">
          Performance Management
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Track employee performance, review goals, and manage feedback.
        </p>
      </div>

      <button
        type="button"
        onClick={loadPerformanceReviews}
        disabled={performanceLoading}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50"
      >
        <span>↻</span>
        {performanceLoading ? "Refreshing..." : "Refresh Reviews"}
      </button>
    </div>

    {/* Performance Overview Cards */}
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

      {/* Total Reviews */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Total Reviews
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {performanceReviews.length}
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              All recorded reviews
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-2xl text-blue-600">
            ▤
          </div>
        </div>
      </div>

      {/* Average Rating */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Average Rating
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {performanceReviews.length > 0
                ? (
                    performanceReviews.reduce(
                      (total, review) =>
                        total + Number(review.rating || 0),
                      0
                    ) / performanceReviews.length
                  ).toFixed(1)
                : "—"}
              <span className="ml-1 text-base font-medium text-slate-400">
                / 5
              </span>
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              Average across all reviews
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-2xl text-amber-500">
            ★
          </div>
        </div>
      </div>

      {/* Top Ratings */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">
              Top Ratings
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              {
                performanceReviews.filter(
                  (review) => Number(review.rating) >= 4
                ).length
              }
            </h3>
            <p className="mt-2 text-xs text-slate-500">
              Reviews rated 4 or 5
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl text-emerald-600">
            ↗
          </div>
        </div>
      </div>

    </div>

    {/* Error Message */}
    {performanceError && (
      <div
        role="alert"
        className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
      >
        {performanceError}
      </div>
    )}

    {/* Performance Review Form */}
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h4 className="text-lg font-bold text-slate-900">
          {editingPerformanceId !== null
            ? "Edit Performance Review"
            : "Create Performance Review"}
        </h4>
        <p className="mt-1 text-sm text-slate-500">
          Enter the employee's review details below.
        </p>
      </div>

      <form
        onSubmit={handlePerformanceSubmit}
        className="grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Employee
          </label>
          <select
            name="employeeId"
            value={performanceForm.employeeId}
            onChange={handlePerformanceInputChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} (ID: {employee.id})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Review Period
          </label>
          <input
            name="reviewPeriod"
            value={performanceForm.reviewPeriod}
            onChange={handlePerformanceInputChange}
            placeholder="e.g. Q4 2026"
            required
            className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Performance Rating
          </label>
          <select
            name="rating"
            value={performanceForm.rating}
            onChange={handlePerformanceInputChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {[1, 2, 3, 4, 5].map((rating) => (
              <option key={rating} value={rating}>
                {rating} / 5 {rating === 5 ? "— Outstanding" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Goals
          </label>
          <input
            name="goals"
            value={performanceForm.goals}
            onChange={handlePerformanceInputChange}
            placeholder="Enter employee goals"
            className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Manager Feedback
          </label>
          <textarea
            name="feedback"
            value={performanceForm.feedback}
            onChange={handlePerformanceInputChange}
            rows={4}
            placeholder="Describe achievements, areas for improvement, and recommendations..."
            className="w-full resize-y rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap gap-3 md:col-span-2">
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            {editingPerformanceId !== null
              ? "Update Review"
              : "Save Review"}
          </button>

          {editingPerformanceId !== null && (
            <button
              type="button"
              onClick={resetPerformanceForm}
              className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>

    {/* Performance Reviews Table */}
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 p-6">
        <div>
          <h4 className="text-lg font-bold text-slate-900">
            Performance Reviews
          </h4>
          <p className="mt-1 text-sm text-slate-500">
            Review and manage employee assessments.
          </p>
        </div>

        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-sm font-semibold text-blue-700">
          {performanceReviews.length} reviews
        </span>
      </div>

      {performanceLoading ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Loading performance reviews...
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Employee</th>
                <th className="px-5 py-4 font-semibold">Review Period</th>
                <th className="px-5 py-4 font-semibold">Rating</th>
                <th className="px-5 py-4 font-semibold">Goals</th>
                <th className="px-5 py-4 font-semibold">Feedback</th>
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {performanceReviews.map((review) => {
                const employee = employees.find(
                  (item) => Number(item.id) === Number(review.employeeId)
                );

                return (
                  <tr
                    key={review.id}
                    className="transition hover:bg-slate-50"
                  >
                    <td className="px-5 py-4">
                      <div className="font-semibold text-slate-800">
                        {employee?.name || `Employee ${review.employeeId}`}
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        ID: {review.employeeId}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      {review.reviewPeriod}
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 font-semibold text-amber-700">
                        <span>★</span>
                        {review.rating} / 5
                      </span>
                    </td>

                    <td className="max-w-48 px-5 py-4 text-slate-600">
                      {review.goals || "—"}
                    </td>

                    <td className="max-w-56 px-5 py-4 text-slate-600">
                      {review.feedback || "—"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleEditPerformance(review)}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeletePerformance(review.id)}
                        className="ml-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}

              {performanceReviews.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center"
                  >
                    <p className="font-semibold text-slate-700">
                      No performance reviews yet
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Create your first review using the form above.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>

   </section>




          ) : activePage === "Recruitment" ? (

          <section className="space-y-6">


           
        {/* Summary Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Job Openings</p>
                <h4 className="mt-2 text-3xl font-bold text-slate-900">
                  {jobOpenings.length}
                </h4>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Open Positions</p>
                <h4 className="mt-2 text-3xl font-bold text-green-600">
                  {jobOpenings.filter((job) => job.status === "OPEN").length}
                </h4>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-sm text-slate-500">Total Candidates</p>
                <h4 className="mt-2 text-3xl font-bold text-blue-600">
                  {candidates.length}
                </h4>
              </div>
            </div>
         
                    {/* Recruitment Analytics Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      {/* Total Job Openings */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              Total Job Openings
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-slate-900">
                              {totalJobOpenings}
                            </h3>
                          </div>
                          <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                            <span className="text-xl">💼</span>
                          </div>
                        </div>
                      </div>

                      {/* Open Positions */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              Open Positions
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-slate-900">
                              {openJobOpenings}
                            </h3>
                          </div>
                          <div className="rounded-xl bg-green-50 p-3 text-green-600">
                            <span className="text-xl">📂</span>
                          </div>
                        </div>
                      </div>

                      {/* Total Candidates */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              Total Candidates
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-slate-900">
                              {totalCandidates}
                            </h3>
                          </div>
                          <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                            <span className="text-xl">👥</span>
                          </div>
                        </div>
                      </div>

                      {/* Interviews */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              Interviews
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-slate-900">
                              {interviews.length || interviewCandidates}
                            </h3>
                          </div>
                          <div className="rounded-xl bg-amber-50 p-3 text-amber-600">
                            <span className="text-xl">📅</span>
                          </div>
                        </div>
                      </div>

                      {/* Selected Candidates */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              Selected Candidates
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-slate-900">
                              {selectedCandidates}
                            </h3>
                          </div>
                          <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                            <span className="text-xl">✅</span>
                          </div>
                        </div>
                      </div>

                      {/* Rejected Candidates */}
                      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-slate-500">
                              Rejected Candidates
                            </p>
                            <h3 className="mt-2 text-3xl font-bold text-slate-900">
                              {rejectedCandidates}
                            </h3>
                          </div>
                          <div className="rounded-xl bg-red-50 p-3 text-red-600">
                            <span className="text-xl">❌</span>
                          </div>
                        </div>
                      </div>
                    </div>

           {/* Recruitment Header */}
             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="text-2xl font-bold text-slate-900">
                  Recruitment Management
                </h3>
                
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setShowInterviewForm(!showInterviewForm)}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  {showInterviewForm ? "Cancel Interview" : "+ Schedule Interview"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJobForm(!showJobForm)}
                  className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  {showJobForm ? "Cancel" : "+ Add Job Opening"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {recruitmentError && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {recruitmentError}
              </div>
            )}

            {showInterviewForm && (
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h4 className="mb-5 text-lg font-bold text-slate-900">
                  Schedule Interview
                </h4>
                <form
                  onSubmit={handleScheduleInterview}
                  className="grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Candidate
                    </label>
                    <select
                      name="candidateId"
                      value={interviewForm.candidateId}
                      onChange={handleInterviewInputChange}
                      required
                      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm"
                    >
                      <option value="">Select candidate</option>
                      {candidates.map((candidate) => (
                        <option key={candidate.id} value={candidate.id}>
                          {candidate.fullName} ({candidate.status})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Interviewer
                    </label>
                    <input
                      name="interviewerName"
                      value={interviewForm.interviewerName}
                      onChange={handleInterviewInputChange}
                      placeholder="e.g. Priya Sharma"
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Date
                    </label>
                    <input
                      type="date"
                      name="interviewDate"
                      value={interviewForm.interviewDate}
                      onChange={handleInterviewInputChange}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Time
                    </label>
                    <input
                      type="time"
                      name="interviewTime"
                      value={interviewForm.interviewTime}
                      onChange={handleInterviewInputChange}
                      required
                      className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Meeting link
                    </label>
                    <input
                      name="meetingLink"
                      value={interviewForm.meetingLink}
                      onChange={handleInterviewInputChange}
                      placeholder="https://meet.google.com/..."
                      className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Notes
                    </label>
                    <input
                      name="notes"
                      value={interviewForm.notes}
                      onChange={handleInterviewInputChange}
                      placeholder="Round 1 technical"
                      className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <button
                      type="submit"
                      disabled={recruitmentLoading}
                      className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      {recruitmentLoading ? "Saving..." : "Save Interview"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h4 className="mb-4 text-lg font-bold text-slate-900">
                Scheduled Interviews
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3">Candidate</th>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Time</th>
                      <th className="px-4 py-3">Interviewer</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {interviews.map((interview) => (
                      <tr key={interview.id}>
                        <td className="px-4 py-3 font-medium text-slate-800">
                          {getCandidateName(interview.candidateId)}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {interview.interviewDate || "—"}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {formatInterviewTime(interview.interviewTime)}
                        </td>
                        <td className="px-4 py-3 text-slate-600">
                          {interview.interviewerName}
                        </td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                            {interview.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleUpdateInterviewStatus(interview.id, "COMPLETED")}
                              className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                            >
                              Complete
                            </button>
                            <button
                              type="button"
                              onClick={() => handleUpdateInterviewStatus(interview.id, "CANCELLED")}
                              className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                            >
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {interviews.length === 0 && (
                      <tr>
                        <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                          No interviews scheduled yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
                {/* Add Job Opening Form */}
      {showJobForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h4 className="mb-5 text-lg font-bold text-slate-900">
            Create Job Opening
          </h4>

          <form
            onSubmit={handleCreateJob}
            className="grid grid-cols-1 gap-5 md:grid-cols-2"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Title
              </label>
              <input
                name="title"
                value={jobForm.title}
                onChange={handleJobInputChange}
                placeholder="e.g. Java Developer"
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Department
              </label>
              <input
                name="department"
                value={jobForm.department}
                onChange={handleJobInputChange}
                placeholder="e.g. Engineering"
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Location
              </label>
              <input
                name="location"
                value={jobForm.location}
                onChange={handleJobInputChange}
                placeholder="e.g. Bengaluru"
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={jobForm.employmentType}
                onChange={handleJobInputChange}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="CONTRACT">Contract</option>
                <option value="INTERNSHIP">Internship</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Closing Date
              </label>
              <input
                type="date"
                name="closingDate"
                value={jobForm.closingDate}
                onChange={handleJobInputChange}
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Job Description
              </label>
              <textarea
                name="description"
                value={jobForm.description}
                onChange={handleJobInputChange}
                rows={4}
                placeholder="Describe the role and responsibilities..."
                required
                className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
              />
            </div>

            <div className="flex gap-3 md:col-span-2">
              
              <button
                type="submit"
                disabled={recruitmentLoading}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {recruitmentLoading
                  ? "Saving..."
                  : editingJobId !== null
                    ? "Update Job Opening"
                    : "Add Job Opening"}
              </button>


              <button
                type="button"
                onClick={() => setShowJobForm(false)}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
          
           
                {/* Job Openings Table */}
                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-100 p-6">
                    <h4 className="text-lg font-bold text-slate-900">
                      Job Openings
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      View currently available positions.
                    </p>
                  </div>

                  {recruitmentLoading ? (
                    <p className="py-10 text-center text-sm text-slate-500">
                      Loading recruitment data...
                    </p>
                  ) : jobOpenings.length === 0 ? (
                    <p className="py-10 text-center text-sm text-slate-500">
                      No job openings found. Add your first job opening.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                          <tr>
                            <th className="px-5 py-4">Job Title</th>
                            <th className="px-5 py-4">Department</th>
                            <th className="px-5 py-4">Location</th>
                            <th className="px-5 py-4">Employment Type</th>
                            <th className="px-5 py-4">Closing Date</th>
                            <th className="px-5 py-4">Applicants</th>
                            <th className="px-5 py-4">Status</th>
                            <th className="px-5 py-4 text-center">Actions</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {jobOpenings.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-50">
                              <td className="px-5 py-4 font-semibold text-slate-800">
                                {job.title}
                              </td>

                              <td className="px-5 py-4 text-slate-600">
                                {job.department}
                              </td>


                              <td className="px-5 py-4 text-slate-600">
                                {job.location}
                              </td>

                              <td className="px-5 py-4 text-slate-600">
                                {job.employmentType?.replace("_", " ")}
                              </td>

                              

                              <td className="px-5 py-4 text-slate-600">
                                {job.closingDate || "-"}
                              </td>

                              <td className="px-5 py-4">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedJobFilter(String(job.id));
                                          document.getElementById("candidates-section")
                                            ?.scrollIntoView({ behavior: "smooth" });
                                        }}
                                        className="font-semibold text-blue-600 hover:underline"
                                      >
                                        {getApplicantsCount(job.id)}
                                      </button>
                                    </td>

                              <td className="px-5 py-4">
                                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                                  {job.status}
                                </span>
                              </td>

                              {/* Actions: Edit and Delete */}
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleEditJob(job)}
                                    disabled={recruitmentLoading}
                                    className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteJob(job.id)}
                                    disabled={recruitmentLoading}
                                    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>


         
{/* Add Candidate Button and Form */}
<div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
  <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
      <h4 className="text-lg font-bold text-slate-900">
        Candidate Management
      </h4>
      <p className="mt-1 text-sm text-slate-500">
        Register and update candidates for available job openings.
      </p>
    </div>

    <button
      type="button"
      onClick={() => {
        setShowCandidateForm(false);
        setEditingCandidateId(null);
        setCandidateForm({
          fullName: "",
          email: "",
          phone: "",
          skills: "",
          jobOpeningId: "",
        });
        setShowCandidateForm(true);
      }}
      className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
    >
      + Add Candidate
    </button>
  </div>

  {showCandidateForm && (
    <form
      onSubmit={handleCreateCandidate}
      className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Full Name
        </label>
        <input
          name="fullName"
          value={candidateForm.fullName}
          onChange={handleCandidateInputChange}
          placeholder="Enter candidate name"
          required
          className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Email
        </label>
        <input
          type="email"
          name="email"
          value={candidateForm.email}
          onChange={handleCandidateInputChange}
          placeholder="candidate@example.com"
          required
          className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Phone
        </label>
        <input
          type="tel"
          name="phone"
          value={candidateForm.phone}
          onChange={handleCandidateInputChange}
          placeholder="Enter phone number"
          className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Skills
        </label>
        <input
          name="skills"
          value={candidateForm.skills}
          onChange={handleCandidateInputChange}
          placeholder="Java, React, SQL"
          className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
        />
      </div>

      <div className="md:col-span-2">
        <label className="mb-2 block text-sm font-semibold text-slate-700">
          Job Opening
        </label>
        <select
          name="jobOpeningId"
          value={candidateForm.jobOpeningId}
          onChange={handleCandidateInputChange}
          required
          disabled={editingCandidateId !== null}
          className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm disabled:bg-slate-100"
        >
          <option value="">Select a job opening</option>

          {jobOpenings
            .filter((job) => job.status === "OPEN")
            .map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.location}
              </option>
            ))}
        </select>

        {editingCandidateId !== null && (
          <p className="mt-1 text-xs text-slate-500">
            Job opening cannot be changed while editing.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-3 md:col-span-2">
        <button
          type="submit"
          disabled={
            recruitmentLoading ||
            (
              editingCandidateId === null &&
              jobOpenings.filter((job) => job.status === "OPEN").length === 0
            )
          }
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {recruitmentLoading
            ? "Saving..."
            : editingCandidateId !== null
              ? "Update Candidate"
              : "Add Candidate"}
        </button>

        <button
          type="button"
          onClick={() => {
            setShowCandidateForm(false);
            setEditingCandidateId(null);
            setCandidateForm({
              fullName: "",
              email: "",
              phone: "",
              skills: "",
              jobOpeningId: "",
            });
          }}
          className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </form>
  )}
</div>

{/* Candidates Table */}
<div
  id="candidates-section"
  className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
>  
          <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row">
            {/* Search by candidate name or email */}
            <div className="flex-1">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Search Candidates
              </label>
              <input
                type="text"
                value={candidateSearch}
                onChange={(event) => setCandidateSearch(event.target.value)}
                placeholder="Search by name or email..."
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>

            {/* Filter by application status */}
            <div className="w-full md:w-64">
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Filter by Status
              </label>
              <select
                value={candidateStatusFilter}
                onChange={(event) => setCandidateStatusFilter(event.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="APPLIED">Applied</option>
                <option value="SCREENING">Screening</option>
                <option value="INTERVIEW">Interview</option>
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>

            <div className="border-b border-slate-100 p-6">
              <h4 className="text-lg font-bold text-slate-900">
                Candidates
              </h4>
              <p className="mt-1 text-sm text-slate-500">
                Track applicants and their application status.
              </p>
            </div>

  
          {filteredCandidates.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              {candidates.length === 0
                ? "No candidates have applied yet."
                : "No candidates match your search or selected status."}
            </p>
) : (

    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-5 py-4">Candidate</th>
            <th className="px-5 py-4">Email</th>
            <th className="px-5 py-4">Phone</th>
            <th className="px-5 py-4">Skills</th>
            <th className="px-5 py-4">Job ID</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
              {filteredCandidates.map((candidate) => (           
             <tr key={candidate.id} className="hover:bg-slate-50">
              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(candidate)}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  {candidate.fullName}
                </button>
              </td>

              <td className="px-5 py-4 text-slate-600">
                {candidate.email}
              </td>

              <td className="px-5 py-4 text-slate-600">
                {candidate.phone || "-"}
              </td>

              <td className="px-5 py-4 text-slate-600">
                {candidate.skills || "-"}
              </td>

              <td className="px-5 py-4 text-slate-600">
                {candidate.jobOpeningId}
              </td>

              <td className="px-5 py-4">
                <select
                  value={candidate.status}
                  onChange={(event) =>
                    handleUpdateCandidateStatus(
                      candidate.id,
                      event.target.value
                    )
                  }
                  disabled={recruitmentLoading}
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500"
                >
                  <option value="APPLIED">Applied</option>
                  <option value="SCREENING">Screening</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="SELECTED">Selected</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </td>

              <td className="whitespace-nowrap px-5 py-4">
                <button
                  type="button"
                  onClick={() => handleEditCandidate(candidate)}
                  disabled={recruitmentLoading}
                  className="mr-2 rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-100 disabled:opacity-50"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteCandidate(candidate.id)}
                  disabled={recruitmentLoading}
                  className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}

  
            {selectedCandidate && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {selectedCandidate.fullName}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedCandidate.email}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedCandidate(null)}
                      className="rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-100"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <p className="text-sm text-slate-500">Phone</p>
                      <p className="font-medium text-slate-800">
                        {selectedCandidate.phone || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Skills</p>
                      <p className="font-medium text-slate-800">
                        {selectedCandidate.skills || "Not provided"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Applied Job</p>
                      <p className="font-medium text-slate-800">
                        {jobOpenings.find(
                          (job) => Number(job.id) === Number(selectedCandidate.jobOpeningId)
                        )?.title || "Unknown job"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Job Location</p>
                      <p className="font-medium text-slate-800">
                        {jobOpenings.find(
                          (job) => Number(job.id) === Number(selectedCandidate.jobOpeningId)
                        )?.location || "Not available"}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-slate-500">Application Status</p>
                      <p className="font-semibold text-blue-600">
                        {selectedCandidate.status || "APPLIED"}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedCandidate(null)}
                    className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}



</div>
</section>








) : activePage === "Payroll" ? (
  <section className="space-y-6">
    <div>
      <h3 className="text-2xl font-bold text-slate-900">Payroll Processing</h3>
      <p className="mt-1 text-sm text-slate-500">
        Generate salary, apply tax, and export payslips.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Payroll Runs</p>
        <h4 className="mt-2 text-3xl font-bold text-slate-900">{payrollRecords.length}</h4>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Paid</p>
        <h4 className="mt-2 text-3xl font-bold text-emerald-600">
          {payrollRecords.filter((item) => item.status === "PAID").length}
        </h4>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Net Payout</p>
        <h4 className="mt-2 text-2xl font-bold text-blue-600">
          {formatMoney(
            payrollRecords.reduce((sum, item) => sum + Number(item.netSalary || 0), 0)
          )}
        </h4>
      </div>
    </div>

    {payrollError && (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        {payrollError}
      </div>
    )}

    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h4 className="mb-5 text-lg font-bold text-slate-900">Generate Payroll</h4>
      <form onSubmit={handleGeneratePayroll} className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Employee</label>
          <select
            name="employeeId"
            value={payrollForm.employeeId}
            onChange={handlePayrollInputChange}
            required
            className="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm"
          >
            <option value="">Select employee</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Pay period</label>
          <input
            type="month"
            name="payPeriod"
            value={payrollForm.payPeriod}
            onChange={handlePayrollInputChange}
            required
            className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Basic salary</label>
          <input
            type="number"
            min="1"
            name="basicSalary"
            value={payrollForm.basicSalary}
            onChange={handlePayrollInputChange}
            required
            className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">HRA</label>
          <input
            type="number"
            min="0"
            name="hra"
            value={payrollForm.hra}
            onChange={handlePayrollInputChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Allowances</label>
          <input
            type="number"
            min="0"
            name="allowances"
            value={payrollForm.allowances}
            onChange={handlePayrollInputChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">Deductions</label>
          <input
            type="number"
            min="0"
            name="deductions"
            value={payrollForm.deductions}
            onChange={handlePayrollInputChange}
            className="w-full rounded-xl border border-slate-300 px-3 py-3 text-sm"
          />
        </div>
        <div className="md:col-span-3">
          <button
            type="submit"
            disabled={payrollLoading}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {payrollLoading ? "Calculating..." : "Calculate & Save"}
          </button>
        </div>
      </form>
    </div>

    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-slate-50 text-slate-500">
          <tr>
            <th className="px-4 py-3">Employee</th>
            <th className="px-4 py-3">Period</th>
            <th className="px-4 py-3">Gross / Tax / Net</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {payrollRecords.map((payroll) => (
            <tr key={payroll.id}>
              <td className="px-4 py-3 font-medium text-slate-800">
                {getEmployeeName(payroll.employeeId)}
              </td>
              <td className="px-4 py-3 text-slate-600">{payroll.payPeriod}</td>
              <td className="px-4 py-3 text-slate-600">
                {formatMoney(
                  Number(payroll.basicSalary || 0) +
                    Number(payroll.hra || 0) +
                    Number(payroll.allowances || 0)
                )}{" "}
                / {formatMoney(payroll.tax)} / {formatMoney(payroll.netSalary)}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    payroll.status === "PAID"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {payroll.status}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  {payroll.status !== "PAID" && (
                    <button
                      type="button"
                      onClick={() => handleMarkPayrollPaid(payroll.id)}
                      className="rounded-lg bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700"
                    >
                      Mark paid
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDownloadPayslip(payroll)}
                    className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"
                  >
                    Payslip
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {payrollRecords.length === 0 && (
            <tr>
              <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                {payrollLoading ? "Loading payroll..." : "No payroll records yet."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </section>
) : activePage === "Departments" ? (
  <section className="space-y-6">
    <div>
      <h3 className="text-2xl font-bold text-slate-900">Departments</h3>
      <p className="mt-1 text-sm text-slate-500">
        Employees grouped by department.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Object.entries(departmentGroups).map(([department, members]) => (
        <div key={department} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-bold text-slate-900">{department}</h4>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {members.length} people
            </span>
          </div>
          <ul className="mt-4 space-y-2">
            {members.map((member) => (
              <li key={member.id} className="text-sm text-slate-600">
                {member.name} · {member.designation || "No designation"}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {Object.keys(departmentGroups).length === 0 && (
        <p className="text-sm text-slate-500">No employees available yet.</p>
      )}
    </div>
  </section>
) : activePage === "Reports" ? (
  <section className="space-y-6">
    <div>
      <h3 className="text-2xl font-bold text-slate-900">Workforce Reports</h3>
      <p className="mt-1 text-sm text-slate-500">
        Live snapshot of employees, leave, recruitment, and payroll.
      </p>
    </div>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Employees</p>
        <h4 className="mt-2 text-3xl font-bold">{employees.length}</h4>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Pending Leave</p>
        <h4 className="mt-2 text-3xl font-bold">
          {leaveRequests.filter((item) => item.status === "PENDING").length}
        </h4>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Open Jobs</p>
        <h4 className="mt-2 text-3xl font-bold">{openJobOpenings}</h4>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Payroll Paid</p>
        <h4 className="mt-2 text-3xl font-bold">
          {payrollRecords.filter((item) => item.status === "PAID").length}
        </h4>
      </div>
    </div>
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h4 className="mb-3 text-lg font-bold">Export</h4>
      <p className="text-sm text-slate-500">
        Open Payroll and use Payslip to print or save as PDF. Recruitment and
        employee lists can be copied from their pages for Excel.
      </p>
    </div>
  </section>
) : activePage === "Settings" ? (
  <section className="space-y-6">
    <div>
      <h3 className="text-2xl font-bold text-slate-900">Settings</h3>
      <p className="mt-1 text-sm text-slate-500">
        Session and workspace options.
      </p>
    </div>
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-600">
        You are signed in with a JWT session stored in this browser tab.
      </p>
      <button
        type="button"
        onClick={() => {
          sessionStorage.removeItem("nexushr_token");
          setToken("");
        }}
        className="mt-4 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
      >
        Sign out
      </button>
    </div>
  </section>
) : (

  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h3 className="text-xl font-bold text-slate-900">
          Employee Management
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          View and manage your employee records.
        </p>
      </div>
      <button
        onClick={() => setActivePage('Add Employee')} 
        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        + Add Employee
      </button>
    </div>

    {activePage === 'Employees' && (
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-slate-50 text-slate-500">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Designation</th>
              <th className="p-3">Department</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => (
              <tr key={employee.id} className="border-b border-slate-100">
                <td className="p-3">{employee.id}</td>
                <td className="p-3 font-medium text-slate-800">{employee.name}</td>
                <td className="p-3">{employee.designation}</td>
                <td className="p-3">{employee.department}</td>
                <td className="p-3">{employee.email}</td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(employee.id)
                      setFormData({
                        name: employee.name,
                        email: employee.email,
                        department: employee.department,
                        designation: employee.designation,
                      })
                      setActivePage('Edit Employee')
                    }}
                    className="rounded-lg bg-blue-50 px-3 py-1.5 font-medium text-blue-700 hover:bg-blue-100"
                  >
                    Edit
                  </button>

                  
                  <button
                    type="button"
                    onClick={() => handleDelete(employee.id)}
                    className="ml-2 rounded-lg bg-red-50 px-3 py-1.5 font-medium text-red-700 hover:bg-red-100"
                  >
                    Delete
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredEmployees.length === 0 && (
          <p className="py-8 text-center text-slate-500">
            No employees found.
          </p>
        )}
      </div>
    )}

   {/*Add Employee From*/}   
{activePage === 'Add Employee' && (
  <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
    <h4 className="text-lg font-semibold text-slate-900">
      New Employee Details
    </h4>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Full Name
      </label>
      <input
     type="text"
      name="name"
      value={formData.name}
      onChange={handleInputChange}
      placeholder="Enter employee name"
      className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
      required
       />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="employee@example.com"
        className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
        required
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Department
      </label>
      <input
    type="text"
    name="department"
    value={formData.department}
    onChange={handleInputChange}
    placeholder="e.g. Engineering"
    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
    required
    />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Designation
      </label>
      <input
    type="text"
    name="designation"
    value={formData.designation}
    onChange={handleInputChange}
    placeholder="e.g. Java Developer"
    className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
    required
      />
    </div>

    <div className="flex gap-3">
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
      >
        Save Employee
      </button>

      <button
        type="button"
        onClick={() => setActivePage('Employees')}
        className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
      >
        Cancel
      </button>
    </div>
  </form>
)}

{/*Edit Employee From*/}

{activePage === 'Edit Employee' && (
  <form
    onSubmit={handleUpdate}
    className="max-w-2xl space-y-5"
  >
    <h4 className="text-lg font-semibold text-slate-900">
      Edit Employee Details
    </h4>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Full Name
      </label>
      <input
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
        required
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Email Address
      </label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
        required
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Department
      </label>
      <input
        name="department"
        value={formData.department}
        onChange={handleInputChange}
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
        required
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        Designation
      </label>
      <input
        name="designation"
        value={formData.designation}
        onChange={handleInputChange}
        className="w-full rounded-lg border border-slate-300 px-3 py-2"
        required
      />
    </div>

    <div className="flex gap-3">
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white"
      >
        Update Employee
      </button>

      <button
        type="button"
        onClick={() => setActivePage('Employees')}
        className="rounded-lg border border-slate-300 px-5 py-2.5"
      >
        Cancel
      </button>
    </div>
  </form>
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
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">{employee.designation}</td>
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
    )}
  </>
  )
}

export default App
