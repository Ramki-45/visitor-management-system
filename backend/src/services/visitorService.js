import Visitor from "../models/Visitor.js";
import VisitRequest from "../models/VisitRequest.js";

/**
 * Find an existing visitor by phone.
 * If not found, create a new visitor.
 * If found, update latest details.
 */
export const findOrCreateVisitor = async (visitorData) => {
  const { name, phone, email, company } = visitorData;

  let visitor = await Visitor.findOne({ phone });

  if (visitor) {
    visitor.name = name;
    visitor.email = email;
    visitor.company = company;

    await visitor.save();

    return visitor;
  }

  return Visitor.create({
    name,
    phone,
    email,
    company,
  });
};

/**
 * Search visitors
 */
export const searchVisitors = async ({ search }) => {
  const filter = {};

  if (search?.trim()) {
    const keyword = search.trim();
    const conditions = [];

    // Search by name
    conditions.push({
      name: {
        $regex: keyword,
        $options: "i",
      },
    });

    // Search by company
    conditions.push({
      company: {
        $regex: keyword,
        $options: "i",
      },
    });

    // Search by phone
    const phoneKeyword = keyword.replace(/[^0-9+]/g, "");

    if (phoneKeyword.length > 0) {
      conditions.push({
        phone: {
          $regex: phoneKeyword,
          $options: "i",
        },
      });
    }

    filter.$or = conditions;
  }

  return Visitor.find(filter).sort({ createdAt: -1 }).limit(50).lean();
};

/**
 * Get complete visit history for a visitor.
 */
export const getVisitorHistory = async (visitorId) => {
  return VisitRequest.find({
    visitorId,
  })
    .populate("visitorId", "name phone email company")
    .populate("employeeId", "name department")
    .sort({
      visitDate: -1,
      createdAt: -1,
    })
    .lean();
};
