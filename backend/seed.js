import {
  connectDatabase,
  disconnectDatabase,
} from "./src/database/connection.js";

import User from "./src/models/User.js";
import Employee from "./src/models/Employee.js";
import Visitor from "./src/models/Visitor.js";
import VisitRequest from "./src/models/VisitRequest.js";
import ActivityLog from "./src/models/ActivityLog.js";

import { ROLES } from "./src/constants/roles.js";
import { VISIT_STATUS } from "./src/constants/visitStatus.js";
import { ACTIVITY_ACTIONS } from "./src/constants/activityActions.js";

const SEED_PASSWORD = "Password123!"; // dev-only default, change after first login

async function upsertUser({ name, email, password, role }) {
  let user = await User.findOne({ email });
  if (user) {
    console.log(`- User already exists, skipping: ${email}`);
    return user;
  }
  user = await User.create({ name, email, password, role });
  console.log(`- Created ${role} user: ${email} / ${password}`);
  return user;
}

async function upsertEmployee({ name, department, designation, userId }) {
  let employee = await Employee.findOne({ name, department });
  if (employee) {
    console.log(`- Employee already exists, skipping: ${name}`);
    return employee;
  }
  employee = await Employee.create({ name, department, designation, userId });
  console.log(`- Created employee: ${name} (${department})`);
  return employee;
}

async function upsertVisitor(data) {
  let visitor = await Visitor.findOne({ phone: data.phone });
  if (visitor) {
    console.log(`- Visitor already exists, skipping: ${data.name}`);
    return visitor;
  }
  visitor = await Visitor.create(data);
  console.log(`- Created visitor: ${data.name}`);
  return visitor;
}

/**
 * Creates a VisitRequest in a specific target status, plus the
 * matching ActivityLog trail, as if it had gone through that part
 * of the real workflow. Skipped entirely on reseed if a request for
 * this visitor+status already exists (see idempotency note above).
 */
async function seedVisitRequest({
  visitor,
  employeeId,
  receptionistId,
  employeeUserId,
  status,
}) {
  const existing = await VisitRequest.findOne({
    visitorId: visitor._id,
    status,
  });
  if (existing) {
    console.log(
      `- VisitRequest already exists, skipping: ${visitor.name} (${status})`,
    );
    return existing;
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const base = {
    visitorId: visitor._id,
    employeeId,
    purpose: "Business meeting",
    visitDate: today,
    expectedArrivalTime: "10:00",
    createdBy: receptionistId,
    status: VISIT_STATUS.PENDING,
  };

  const logs = [
    { action: ACTIVITY_ACTIONS.CREATED, performedBy: receptionistId },
  ];

  if (status === VISIT_STATUS.PENDING) {
    // base already represents PENDING — nothing more to layer on.
  }

  if (
    status === VISIT_STATUS.APPROVED ||
    status === VISIT_STATUS.CHECKED_IN ||
    status === VISIT_STATUS.CHECKED_OUT
  ) {
    base.status = VISIT_STATUS.APPROVED;
    base.approvedBy = employeeUserId;
    base.approvedAt = now;
    logs.push({
      action: ACTIVITY_ACTIONS.APPROVED,
      performedBy: employeeUserId,
    });
  }

  if (status === VISIT_STATUS.REJECTED) {
    base.status = VISIT_STATUS.REJECTED;
    base.rejectedBy = employeeUserId;
    base.rejectedAt = now;
    base.remarks = "Not available at requested time";
    logs.push({
      action: ACTIVITY_ACTIONS.REJECTED,
      performedBy: employeeUserId,
      remarks: base.remarks,
    });
  }

  if (
    status === VISIT_STATUS.CHECKED_IN ||
    status === VISIT_STATUS.CHECKED_OUT
  ) {
    base.status = VISIT_STATUS.CHECKED_IN;
    base.checkInTime = new Date(now.getTime() - 2 * 60 * 60 * 1000); // 2h ago
    base.checkedInBy = receptionistId;
    logs.push({
      action: ACTIVITY_ACTIONS.CHECKED_IN,
      performedBy: receptionistId,
    });
  }

  if (status === VISIT_STATUS.CHECKED_OUT) {
    base.status = VISIT_STATUS.CHECKED_OUT;
    base.checkOutTime = new Date(now.getTime() - 1 * 60 * 60 * 1000); // 1h ago, after check-in
    base.checkedOutBy = receptionistId;
    logs.push({
      action: ACTIVITY_ACTIONS.CHECKED_OUT,
      performedBy: receptionistId,
    });
  }

  const visitRequest = await VisitRequest.create(base);

  await ActivityLog.insertMany(
    logs.map((log) => ({ ...log, visitRequestId: visitRequest._id })),
  );

  console.log(`- Created visit request: ${visitor.name} -> ${status}`);
  return visitRequest;
}

async function seed() {
  await connectDatabase();
  console.log("Seeding development data...\n");

  // 1. Admin — no linked Employee, pure system access.
  await upsertUser({
    name: "System Admin",
    email: "admin@visitorpass.com",
    password: SEED_PASSWORD,
    role: ROLES.ADMIN,
  });

  // 2. Receptionist — no linked Employee, front-desk system access.
  const receptionistUser = await upsertUser({
    name: "Front Desk Receptionist",
    email: "receptionist@visitorpass.com",
    password: SEED_PASSWORD,
    role: ROLES.RECEPTIONIST,
  });

  // 3. Employee — User created first, then the Employee record
  // references it via userId (single direction of truth, per the
  // locked Step 3 review — User itself stores no employeeId).
  const employeeUser = await upsertUser({
    name: "Jordan Lee",
    email: "employee@visitorpass.com",
    password: SEED_PASSWORD,
    role: ROLES.EMPLOYEE,
  });

  const employee = await upsertEmployee({
    name: "Jordan Lee",
    department: "Engineering",
    designation: "Software Engineer",
    userId: employeeUser._id,
  });

  // 4. Sample visitors — one per seeded status, so the partial
  // unique index (active statuses only) never sees a conflict.
  console.log("\nSeeding visitors and visit requests...");

  const visitorDefs = [
    {
      name: "Amit Sharma",
      phone: "9000000001",
      email: "amit@example.com",
      company: "Acme Corp",
      status: VISIT_STATUS.PENDING,
    },
    {
      name: "Priya Nair",
      phone: "9000000002",
      email: "priya@example.com",
      company: "Globex Inc",
      status: VISIT_STATUS.APPROVED,
    },
    {
      name: "Rahul Verma",
      phone: "9000000003",
      email: "rahul@example.com",
      company: "Initech",
      status: VISIT_STATUS.CHECKED_IN,
    },
    {
      name: "Sneha Iyer",
      phone: "9000000004",
      email: "sneha@example.com",
      company: "Umbrella Ltd",
      status: VISIT_STATUS.CHECKED_OUT,
    },
    {
      name: "Karan Mehta",
      phone: "9000000005",
      email: "karan@example.com",
      company: "Wayne Enterprises",
      status: VISIT_STATUS.REJECTED,
    },
  ];

  for (const def of visitorDefs) {
    const visitor = await upsertVisitor({
      name: def.name,
      phone: def.phone,
      email: def.email,
      company: def.company,
    });

    await seedVisitRequest({
      visitor,
      employeeId: employee._id,
      receptionistId: receptionistUser._id,
      employeeUserId: employeeUser._id,
      status: def.status,
    });
  }

  console.log("\nSeeding complete.");
}

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectDatabase();
  });
