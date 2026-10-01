import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("🌱 Starting database seed...");

  // ==========================================================
  // STATES
  // ==========================================================

  console.log("📍 Seeding states...");

  const haryana = await prisma.state.upsert({
    where: {
      slug: "haryana",
    },
    update: {
      name: "Haryana",
    },
    create: {
      name: "Haryana",
      slug: "haryana",
    },
  });

  const delhi = await prisma.state.upsert({
    where: {
      slug: "delhi",
    },
    update: {
      name: "Delhi",
    },
    create: {
      name: "Delhi",
      slug: "delhi",
    },
  });

  const punjab = await prisma.state.upsert({
    where: {
      slug: "punjab",
    },
    update: {
      name: "Punjab",
    },
    create: {
      name: "Punjab",
      slug: "punjab",
    },
  });

  // ==========================================================
  // CITIES
  // ==========================================================

  console.log("🏙️ Seeding cities...");

  const hisar = await prisma.city.upsert({
    where: {
      stateId_slug: {
        stateId: haryana.id,
        slug: "hisar",
      },
    },
    update: {
      name: "Hisar",
    },
    create: {
      name: "Hisar",
      slug: "hisar",
      stateId: haryana.id,
    },
  });

  const rohtak = await prisma.city.upsert({
    where: {
      stateId_slug: {
        stateId: haryana.id,
        slug: "rohtak",
      },
    },
    update: {
      name: "Rohtak",
    },
    create: {
      name: "Rohtak",
      slug: "rohtak",
      stateId: haryana.id,
    },
  });

  const gurugram = await prisma.city.upsert({
    where: {
      stateId_slug: {
        stateId: haryana.id,
        slug: "gurugram",
      },
    },
    update: {
      name: "Gurugram",
    },
    create: {
      name: "Gurugram",
      slug: "gurugram",
      stateId: haryana.id,
    },
  });

  const delhiCity = await prisma.city.upsert({
    where: {
      stateId_slug: {
        stateId: delhi.id,
        slug: "new-delhi",
      },
    },
    update: {
      name: "New Delhi",
    },
    create: {
      name: "New Delhi",
      slug: "new-delhi",
      stateId: delhi.id,
    },
  });

  const amritsar = await prisma.city.upsert({
    where: {
      stateId_slug: {
        stateId: punjab.id,
        slug: "amritsar",
      },
    },
    update: {
      name: "Amritsar",
    },
    create: {
      name: "Amritsar",
      slug: "amritsar",
      stateId: punjab.id,
    },
  });

  // ==========================================================
  // COURSE CATEGORIES
  // ==========================================================

  console.log("📚 Seeding course categories...");

  const engineering = await prisma.category.upsert({
    where: {
      slug: "engineering",
    },
    update: {
      name: "Engineering",
      description:
        "Engineering and technology programs covering computer science, electronics, mechanical engineering and related fields.",
    },
    create: {
      name: "Engineering",
      slug: "engineering",
      description:
        "Engineering and technology programs covering computer science, electronics, mechanical engineering and related fields.",
    },
  });

  const management = await prisma.category.upsert({
    where: {
      slug: "management",
    },
    update: {
      name: "Management",
      description:
        "Management and business programs for careers in business, finance, marketing and administration.",
    },
    create: {
      name: "Management",
      slug: "management",
      description:
        "Management and business programs for careers in business, finance, marketing and administration.",
    },
  });

  const computerApplications = await prisma.category.upsert({
    where: {
      slug: "computer-applications",
    },
    update: {
      name: "Computer Applications",
      description:
        "Computer application programs focused on software development, programming and information technology.",
    },
    create: {
      name: "Computer Applications",
      slug: "computer-applications",
      description:
        "Computer application programs focused on software development, programming and information technology.",
    },
  });

  // ==========================================================
  // COURSES
  // ==========================================================

  console.log("🎓 Seeding courses...");

  const btechCse = await prisma.course.upsert({
    where: {
      slug: "btech-computer-science-engineering",
    },
    update: {},
    create: {
      name: "B.Tech Computer Science and Engineering",
      slug: "btech-computer-science-engineering",
      shortName: "B.Tech CSE",
      degree: "B.Tech",
      level: "UG",
      entryLevel: "AFTER_12TH",
      categoryId: engineering.id,
      durationYears: 4,
      eligibility:
        "10+2 with Physics and Mathematics along with one of Chemistry, Biotechnology, Computer Science or Biology, subject to university requirements.",
      averageFees: 150000,
      careerOptions:
        "Software Developer, Full Stack Developer, Data Analyst, Cloud Engineer, DevOps Engineer and Software Engineer.",
      description:
        "An undergraduate engineering program focused on programming, algorithms, software development, databases, computer networks and modern computing technologies.",
    },
  });

  const btechEce = await prisma.course.upsert({
    where: {
      slug: "btech-electronics-communication-engineering",
    },
    update: {},
    create: {
      name: "B.Tech Electronics and Communication Engineering",
      slug: "btech-electronics-communication-engineering",
      shortName: "B.Tech ECE",
      degree: "B.Tech",
      level: "UG",
      entryLevel: "AFTER_12TH",
      categoryId: engineering.id,
      durationYears: 4,
      eligibility:
        "10+2 with Physics and Mathematics, subject to university requirements.",
      averageFees: 130000,
      careerOptions:
        "Electronics Engineer, Communication Engineer, Embedded Systems Engineer and Network Engineer.",
      description:
        "An undergraduate engineering program covering electronics, communication systems, embedded systems and digital technologies.",
    },
  });

  const bba = await prisma.course.upsert({
    where: {
      slug: "bba",
    },
    update: {},
    create: {
      name: "Bachelor of Business Administration",
      slug: "bba",
      shortName: "BBA",
      degree: "BBA",
      level: "UG",
      entryLevel: "AFTER_12TH",
      categoryId: management.id,
      durationYears: 3,
      eligibility: "10+2 from a recognized board.",
      averageFees: 90000,
      careerOptions:
        "Business Analyst, Marketing Executive, Sales Executive, HR Executive and Management Trainee.",
      description:
        "An undergraduate management program covering business administration, marketing, finance, human resources and organizational management.",
    },
  });

  const bca = await prisma.course.upsert({
    where: {
      slug: "bca",
    },
    update: {},
    create: {
      name: "Bachelor of Computer Applications",
      slug: "bca",
      shortName: "BCA",
      degree: "BCA",
      level: "UG",
      entryLevel: "AFTER_12TH",
      categoryId: computerApplications.id,
      durationYears: 3,
      eligibility: "10+2 from a recognized board.",
      averageFees: 85000,
      careerOptions:
        "Software Developer, Web Developer, Application Developer, QA Engineer and IT Support Specialist.",
      description:
        "An undergraduate computer applications program focused on programming, databases, web development and software applications.",
    },
  });
  
// =====================================================
// Additional Engineering Courses
// =====================================================

const btechMechanical = await prisma.course.upsert({
  where: {
    slug: "btech-mechanical-engineering",
  },
  update: {},
  create: {
    name: "B.Tech Mechanical Engineering",
    slug: "btech-mechanical-engineering",
    shortName: "B.Tech Mechanical",
    degree: "B.Tech",
    level: "UG",
    entryLevel: "AFTER_12TH",
    categoryId: engineering.id,
    durationYears: 4,
    eligibility:
      "10+2 with Physics and Mathematics along with one of Chemistry, Biotechnology, Computer Science or Biology, subject to university requirements.",
    averageFees: 125000,
    careerOptions:
      "Mechanical Engineer, Design Engineer, Production Engineer, Manufacturing Engineer, Automobile Engineer and Maintenance Engineer.",
    description:
      "An undergraduate engineering program focused on mechanical systems, manufacturing processes, thermodynamics, machine design, materials and industrial engineering.",
  },
});

const btechCivil = await prisma.course.upsert({
  where: {
    slug: "btech-civil-engineering",
  },
  update: {},
  create: {
    name: "B.Tech Civil Engineering",
    slug: "btech-civil-engineering",
    shortName: "B.Tech Civil",
    degree: "B.Tech",
    level: "UG",
    entryLevel: "AFTER_12TH",
    categoryId: engineering.id,
    durationYears: 4,
    eligibility:
      "10+2 with Physics and Mathematics along with one of Chemistry, Biotechnology, Computer Science or Biology, subject to university requirements.",
    averageFees: 120000,
    careerOptions:
      "Civil Engineer, Structural Engineer, Site Engineer, Construction Engineer, Transportation Engineer and Project Engineer.",
    description:
      "An undergraduate engineering program covering structural engineering, construction, surveying, transportation, environmental engineering and infrastructure development.",
  },
});

const btechElectrical = await prisma.course.upsert({
  where: {
    slug: "btech-electrical-engineering",
  },
  update: {},
  create: {
    name: "B.Tech Electrical Engineering",
    slug: "btech-electrical-engineering",
    shortName: "B.Tech Electrical",
    degree: "B.Tech",
    level: "UG",
    entryLevel: "AFTER_12TH",
    categoryId: engineering.id,
    durationYears: 4,
    eligibility:
      "10+2 with Physics and Mathematics along with one of Chemistry, Biotechnology, Computer Science or Biology, subject to university requirements.",
    averageFees: 125000,
    careerOptions:
      "Electrical Engineer, Power Systems Engineer, Control Engineer, Electrical Design Engineer and Maintenance Engineer.",
    description:
      "An undergraduate engineering program focused on electrical systems, power generation, transmission, electronics, control systems and electrical machines.",
  },
});

const btechAiml = await prisma.course.upsert({
  where: {
    slug: "btech-artificial-intelligence-machine-learning",
  },
  update: {},
  create: {
    name: "B.Tech Artificial Intelligence and Machine Learning",
    slug: "btech-artificial-intelligence-machine-learning",
    shortName: "B.Tech AI & ML",
    degree: "B.Tech",
    level: "UG",
    entryLevel: "AFTER_12TH",
    categoryId: engineering.id,
    durationYears: 4,
    eligibility:
      "10+2 with Physics and Mathematics along with one of Chemistry, Biotechnology, Computer Science or Biology, subject to university requirements.",
    averageFees: 160000,
    careerOptions:
      "AI Engineer, Machine Learning Engineer, Data Scientist, Data Analyst, Computer Vision Engineer and AI Software Developer.",
    description:
      "An undergraduate engineering program focused on artificial intelligence, machine learning, data processing, algorithms, neural networks and intelligent software systems.",
  },
});

const btechIt = await prisma.course.upsert({
  where: {
    slug: "btech-information-technology",
  },
  update: {},
  create: {
    name: "B.Tech Information Technology",
    slug: "btech-information-technology",
    shortName: "B.Tech IT",
    degree: "B.Tech",
    level: "UG",
    entryLevel: "AFTER_12TH",
    categoryId: engineering.id,
    durationYears: 4,
    eligibility:
      "10+2 with Physics and Mathematics along with one of Chemistry, Biotechnology, Computer Science or Biology, subject to university requirements.",
    averageFees: 145000,
    careerOptions:
      "Software Developer, Full Stack Developer, Cloud Engineer, System Administrator, Database Administrator and IT Consultant.",
    description:
      "An undergraduate engineering program focused on software development, information systems, databases, networking, cloud computing and modern IT infrastructure.",
  },
});

// =====================================================
// Additional Management Courses
// =====================================================

const bms = await prisma.course.upsert({
  where: {
    slug: "bachelor-of-management-studies",
  },
  update: {},
  create: {
    name: "Bachelor of Management Studies",
    slug: "bachelor-of-management-studies",
    shortName: "BMS",
    degree: "BMS",
    level: "UG",
    entryLevel: "AFTER_12TH",
    categoryId: management.id,
    durationYears: 3,
    eligibility:
      "10+2 from a recognized board. Admission requirements may vary by university or institution.",
    averageFees: 80000,
    careerOptions:
      "Management Trainee, Business Analyst, Marketing Executive, HR Executive, Sales Executive and Operations Executive.",
    description:
      "An undergraduate management program covering business management, marketing, finance, human resources, operations and organizational behavior.",
  },
});

const mba = await prisma.course.upsert({
  where: {
    slug: "mba",
  },
  update: {},
  create: {
    name: "Master of Business Administration",
    slug: "mba",
    shortName: "MBA",
    degree: "MBA",
    level: "PG",
    entryLevel: "UNDERGRADUATE",
    categoryId: management.id,
    durationYears: 2,
    eligibility:
      "Bachelor's degree from a recognized university. Admission may be based on merit, entrance examination or institutional requirements.",
    averageFees: 180000,
    careerOptions:
      "Business Manager, Product Manager, Marketing Manager, Financial Analyst, HR Manager, Operations Manager and Management Consultant.",
    description:
      "A postgraduate management program covering business strategy, finance, marketing, operations, human resources and organizational leadership.",
  },
});

const pgdm = await prisma.course.upsert({
  where: {
    slug: "pgdm",
  },
  update: {},
  create: {
    name: "Post Graduate Diploma in Management",
    slug: "pgdm",
    shortName: "PGDM",
    degree: "PGDM",
    level: "PG",
    entryLevel: "UNDERGRADUATE",
    categoryId: management.id,
    durationYears: 2,
    eligibility:
      "Bachelor's degree from a recognized university. Admission requirements may include an entrance examination, academic performance or institutional selection criteria.",
    averageFees: 200000,
    careerOptions:
      "Business Analyst, Management Consultant, Product Manager, Marketing Manager, Finance Manager and Operations Manager.",
    description:
      "A postgraduate management program designed to develop practical business and leadership skills through subjects such as marketing, finance, operations, strategy and human resources.",
  }});

// =====================================================
// Additional Computer Applications Courses
// =====================================================

const mca = await prisma.course.upsert({
  where: {
    slug: "mca",
  },
  update: {},
  create: {
    name: "Master of Computer Applications",
    slug: "mca",
    shortName: "MCA",
    degree: "MCA",
    level: "PG",
    entryLevel: "UNDERGRADUATE",
    categoryId: computerApplications.id,
    durationYears: 2,
    eligibility:
      "Bachelor's degree from a recognized university with Mathematics or an equivalent subject as required by the institution.",
    averageFees: 110000,
    careerOptions:
      "Software Developer, Full Stack Developer, Backend Developer, Database Administrator, Cloud Engineer and Software Engineer.",
    description:
      "A postgraduate computer applications program focused on software development, programming, databases, web technologies, cloud computing and advanced computer applications.",
  },
});

const mscComputerScience = await prisma.course.upsert({
  where: {
    slug: "msc-computer-science",
  },
  update: {},
  create: {
    name: "M.Sc Computer Science",
    slug: "msc-computer-science",
    shortName: "M.Sc Computer Science",
    degree: "M.Sc",
    level: "PG",
    entryLevel: "UNDERGRADUATE",
    categoryId: computerApplications.id,
    durationYears: 2,
    eligibility:
      "Bachelor's degree in Computer Science, Computer Applications, Information Technology or a related discipline from a recognized university.",
    averageFees: 95000,
    careerOptions:
      "Software Developer, Data Analyst, Database Administrator, Research Assistant, System Analyst and IT Consultant.",
    description:
      "A postgraduate computer science program covering advanced programming, algorithms, databases, computer networks, operating systems and emerging computing technologies.",
  }});

const bscComputerScience = await prisma.course.upsert({
  where: {
    slug: "bsc-computer-science",
  },
  update: {},
  create: {
    name: "B.Sc Computer Science",
    slug: "bsc-computer-science",
    shortName: "B.Sc Computer Science",
    degree: "B.Sc",
    level: "UG",
    entryLevel: "AFTER_12TH",
    categoryId: computerApplications.id,
    durationYears: 3,
    eligibility:
      "10+2 from a recognized board with Mathematics or Computer Science, subject to university requirements.",
    averageFees: 75000,
    careerOptions:
      "Software Developer, Web Developer, Data Analyst, Technical Support Engineer, QA Engineer and Junior System Administrator.",
    description:
      "An undergraduate computer science program focused on programming, algorithms, databases, computer networks, operating systems and software development.",
  }});

const bscInformationTechnology = await prisma.course.upsert({
  where: {
    slug: "bsc-information-technology",
  },
  update: {},
  create: {
    name: "B.Sc Information Technology",
    slug: "bsc-information-technology",
    shortName: "B.Sc IT",
    degree: "B.Sc",
    level: "UG",
    entryLevel: "AFTER_12TH",
    categoryId: computerApplications.id,
    durationYears: 3,
    eligibility:
      "10+2 from a recognized board with Mathematics or Computer Science, subject to university requirements.",
    averageFees: 70000,
    careerOptions:
      "IT Support Engineer, Web Developer, Software Developer, System Administrator, Database Assistant and Network Support Engineer.",
    description:
      "An undergraduate information technology program covering programming, databases, networking, web technologies, operating systems and IT infrastructure.",
  }});


await prisma.course.updateMany({
  where: {
    slug: {
      in: [
        "btech-computer-science-engineering",
        "btech-electronics-communication-engineering",
        "bba",
        "bca",
      ],
    },
  },
  data: {
    entryLevel: "AFTER_12TH",
  },
});
  // ==========================================================
  // COLLEGES
  // ==========================================================

  console.log("🏫 Seeding colleges...");

  const guruJambheshwar = await prisma.college.upsert({
    where: {
      slug: "guru-jambheshwar-university-of-science-and-technology",
    },
    update: {
      name: "Guru Jambheshwar University of Science and Technology",
      shortName: "GJUST",
      collegeType: "GOVERNMENT",
      status: "ACTIVE",
      website: "https://www.gjust.ac.in/",
      stateId: haryana.id,
      cityId: hisar.id,
      verified: true,
    },
    create: {
      name: "Guru Jambheshwar University of Science and Technology",
      slug: "guru-jambheshwar-university-of-science-and-technology",
      shortName: "GJUST",
      collegeType: "GOVERNMENT",
      status: "ACTIVE",
      description:
        "A state government university located in Hisar, Haryana, offering programs in engineering, technology, sciences, management and related disciplines.",
      establishedYear: 1995,
      website: "https://www.gjust.ac.in/",
      address: "Hisar, Haryana",
      stateId: haryana.id,
      cityId: hisar.id,
      verified: true,
      seoTitle:
        "GJUST Hisar - Courses, Fees, Admissions, Placements & Reviews",
      seoDescription:
        "Explore GJUST Hisar courses, fees, admissions, placements and other college information.",
    },
  });

  const mdu = await prisma.college.upsert({
    where: {
      slug: "maharshi-dayanand-university",
    },
    update: {
      name: "Maharshi Dayanand University",
      shortName: "MDU",
      collegeType: "GOVERNMENT",
      status: "ACTIVE",
      website: "https://mdu.ac.in/",
      stateId: haryana.id,
      cityId: rohtak.id,
      verified: true,
    },
    create: {
      name: "Maharshi Dayanand University",
      slug: "maharshi-dayanand-university",
      shortName: "MDU",
      collegeType: "GOVERNMENT",
      status: "ACTIVE",
      description:
        "A state university located in Rohtak, Haryana offering undergraduate, postgraduate and research programs across multiple disciplines.",
      establishedYear: 1976,
      website: "https://mdu.ac.in/",
      address: "Rohtak, Haryana",
      stateId: haryana.id,
      cityId: rohtak.id,
      verified: true,
      seoTitle:
        "MDU Rohtak - Courses, Fees, Admissions, Placements & Reviews",
      seoDescription:
        "Explore Maharshi Dayanand University courses, fees, admissions, placements and college information.",
    },
  });

  const amity = await prisma.college.upsert({
    where: {
      slug: "amity-university-haryana",
    },
    update: {
      name: "Amity University Haryana",
      shortName: "AUH",
      collegeType: "PRIVATE",
      status: "ACTIVE",
      website: "https://www.amity.edu/gurugram/",
      stateId: haryana.id,
      cityId: gurugram.id,
      verified: true,
    },
    create: {
      name: "Amity University Haryana",
      slug: "amity-university-haryana",
      shortName: "AUH",
      collegeType: "PRIVATE",
      status: "ACTIVE",
      description:
        "A private university in Gurugram, Haryana offering undergraduate, postgraduate and doctoral programs across multiple disciplines.",
      establishedYear: 2010,
      website: "https://www.amity.edu/gurugram/",
      address: "Gurugram, Haryana",
      stateId: haryana.id,
      cityId: gurugram.id,
      verified: true,
      seoTitle:
        "Amity University Haryana - Courses, Fees, Admissions & Placements",
      seoDescription:
        "Explore Amity University Haryana courses, fees, admissions and other college information.",
    },
  });

  const delhiUniversity = await prisma.college.upsert({
    where: {
      slug: "university-of-delhi",
    },
    update: {
      name: "University of Delhi",
      shortName: "DU",
      collegeType: "GOVERNMENT",
      status: "ACTIVE",
      website: "https://www.du.ac.in/",
      stateId: delhi.id,
      cityId: delhiCity.id,
      verified: true,
    },
    create: {
      name: "University of Delhi",
      slug: "university-of-delhi",
      shortName: "DU",
      collegeType: "GOVERNMENT",
      status: "ACTIVE",
      description:
        "A major public central university in New Delhi offering undergraduate, postgraduate and doctoral programs through its colleges and departments.",
      establishedYear: 1922,
      website: "https://www.du.ac.in/",
      address: "Delhi, India",
      stateId: delhi.id,
      cityId: delhiCity.id,
      verified: true,
      seoTitle:
        "University of Delhi - Courses, Admissions, Fees & College Information",
      seoDescription:
        "Explore University of Delhi courses, admissions, fees and college information.",
    },
  });

  const guruNanakDev = await prisma.college.upsert({
    where: {
      slug: "guru-nanak-dev-university",
    },
    update: {
      name: "Guru Nanak Dev University",
      shortName: "GNDU",
      collegeType: "GOVERNMENT",
      status: "ACTIVE",
      website: "https://www.gndu.ac.in/",
      stateId: punjab.id,
      cityId: amritsar.id,
      verified: true,
    },
    create: {
      name: "Guru Nanak Dev University",
      slug: "guru-nanak-dev-university",
      shortName: "GNDU",
      collegeType: "GOVERNMENT",
      status: "ACTIVE",
      description:
        "A public university located in Amritsar, Punjab offering undergraduate, postgraduate and research programs.",
      establishedYear: 1969,
      website: "https://www.gndu.ac.in/",
      address: "Amritsar, Punjab",
      stateId: punjab.id,
      cityId: amritsar.id,
      verified: true,
      seoTitle:
        "GNDU Amritsar - Courses, Fees, Admissions & College Information",
      seoDescription:
        "Explore Guru Nanak Dev University courses, admissions, fees and college information.",
    },
  });

  // ==========================================================
  // COLLEGE ↔ COURSE RELATIONSHIPS
  // ==========================================================

  console.log("🔗 Seeding college-course relationships...");

  const collegeCourses = [
    {
      collegeId: guruJambheshwar.id,
      courseId: btechCse.id,
      fees: 120000,
      seats: 120,
    },
    {
      collegeId: guruJambheshwar.id,
      courseId: btechEce.id,
      fees: 110000,
      seats: 60,
    },
    {
      collegeId: mdu.id,
      courseId: btechCse.id,
      fees: 100000,
      seats: 120,
    },
    {
      collegeId: mdu.id,
      courseId: bca.id,
      fees: 70000,
      seats: 60,
    },
    {
      collegeId: amity.id,
      courseId: btechCse.id,
      fees: 250000,
      seats: 240,
    },
    {
      collegeId: amity.id,
      courseId: bba.id,
      fees: 180000,
      seats: 120,
    },
    {
      collegeId: delhiUniversity.id,
      courseId: bca.id,
      fees: 50000,
      seats: 100,
    },
    {
      collegeId: delhiUniversity.id,
      courseId: bba.id,
      fees: 60000,
      seats: 120,
    },
    {
      collegeId: guruNanakDev.id,
      courseId: btechCse.id,
      fees: 95000,
      seats: 120,
    },
    {
      collegeId: guruNanakDev.id,
      courseId: bca.id,
      fees: 65000,
      seats: 60,
    },
  ];

  for (const item of collegeCourses) {
    await prisma.collegeCourse.upsert({
      where: {
        collegeId_courseId: {
          collegeId: item.collegeId,
          courseId: item.courseId,
        },
      },
      update: {
        fees: item.fees,
        seats: item.seats,
      },
      create: item,
    });
  }
// ==========================================================
// COLLEGE NAVIGATION ITEMS
// ==========================================================

console.log("🧭 Seeding college navigation items...");

const collegeNavigationItems = [
  {
    collegeId: mdu.id,
    label: "Overview",
    slug: "overview",
    sectionId: "overview",
    sortOrder: 1,
  },
  {
    collegeId: mdu.id,
    label: "Courses & Fees",
    slug: "courses-fees",
    sectionId: "courses-fees",
    sortOrder: 2,
  },
  {
    collegeId: mdu.id,
    label: "Admission",
    slug: "admission",
    sectionId: "admission",
    sortOrder: 3,
  },
  {
    collegeId: mdu.id,
    label: "Placements",
    slug: "placements",
    sectionId: "placements",
    sortOrder: 4,
  },
  {
    collegeId: mdu.id,
    label: "Cut-off",
    slug: "cutoff",
    sectionId: "cutoff",
    sortOrder: 5,
  },
  {
    collegeId: mdu.id,
    label: "Rankings",
    slug: "rankings",
    sectionId: "rankings",
    sortOrder: 6,
  },
  {
    collegeId: mdu.id,
    label: "Infrastructure",
    slug: "infrastructure",
    sectionId: "infrastructure",
    sortOrder: 7,
  },
  {
    collegeId: mdu.id,
    label: "Faculty",
    slug: "faculty",
    sectionId: "faculty",
    sortOrder: 8,
  },
  {
    collegeId: mdu.id,
    label: "Reviews",
    slug: "reviews",
    sectionId: "reviews",
    sortOrder: 9,
  },
  {
    collegeId: mdu.id,
    label: "Q&A",
    slug: "qna",
    sectionId: "qna",
    sortOrder: 10,
  },
];

for (const item of collegeNavigationItems) {
  await prisma.navigationItem.upsert({
    where: {
      collegeId_slug: {
        collegeId: item.collegeId,
        slug: item.slug,
      },
    },
    update: {
      label: item.label,
      sectionId: item.sectionId,
      sortOrder: item.sortOrder,
      isActive: true,
    },
    create: {
      collegeId: item.collegeId,
      label: item.label,
      slug: item.slug,
      sectionId: item.sectionId,
      sortOrder: item.sortOrder,
      isActive: true,
    },
  });
}
// ==========================================================
// COURSE NAVIGATION ITEMS
// ==========================================================

console.log("🧭 Seeding course navigation items...");

const courseNavigationItems = [
  {
    title: "Overview",
    slug: "overview",
    sortOrder: 1,
  },
  {
    title: "Why Study",
    slug: "why-study",
    sortOrder: 2,
  },
  {
    title: "Eligibility",
    slug: "eligibility",
    sortOrder: 3,
  },
  {
    title: "Admission",
    slug: "admission",
    sortOrder: 4,
  },
  {
    title: "Entrance Exams",
    slug: "entrance-exams",
    sortOrder: 5,
  },
  {
    title: "Fees",
    slug: "fees",
    sortOrder: 6,
  },
  {
    title: "Top Colleges",
    slug: "top-colleges",
    sortOrder: 7,
  },
  {
    title: "Syllabus",
    slug: "syllabus",
    sortOrder: 8,
  },
  {
    title: "Specializations",
    slug: "specializations",
    sortOrder: 9,
  },
  {
    title: "Careers",
    slug: "careers",
    sortOrder: 10,
  },
  {
    title: "Salary",
    slug: "salary",
    sortOrder: 11,
  },
  {
    title: "Skills",
    slug: "skills",
    sortOrder: 12,
  },
  {
    title: "Related Courses",
    slug: "related-courses",
    sortOrder: 13,
  },
  {
    title: "FAQs",
    slug: "faqs",
    sortOrder: 14,
  },
];

const activeCourses = await prisma.course.findMany({
  where: {
    status: "ACTIVE",
  },
  select: {
    id: true,
    name: true,
  },
});

for (const course of activeCourses) {
  for (const item of courseNavigationItems) {
    await prisma.courseNavigationItem.upsert({
  where: {
    courseId_slug: {
      courseId: course.id,
      slug: item.slug,
    },
  },
  update: {
    title: item.title,
    sortOrder: item.sortOrder,
    isActive: true,
  },
  create: {
    courseId: course.id,
    title: item.title,
    slug: item.slug,
    sortOrder: item.sortOrder,
    isActive: true,
  },
});
  }

  console.log(`   ✓ Course navigation: ${course.name}`);
}

  // ==========================================================
  // EXAMS
  // ==========================================================

  console.log("📝 Seeding entrance exams...");

  const jeeMain = await prisma.exam.upsert({
    where: {
      slug: "jee-main",
    },
    update: {
      name: "Joint Entrance Examination Main",
      shortName: "JEE Main",
      conductingBody: "National Testing Agency",
      website: "https://jeemain.nta.nic.in/",
    },
    create: {
      name: "Joint Entrance Examination Main",
      slug: "jee-main",
      shortName: "JEE Main",
      conductingBody: "National Testing Agency",
      description:
        "A national-level entrance examination primarily used for admission to undergraduate engineering programs.",
      eligibility:
        "Eligibility is subject to the examination and admission rules applicable for the relevant academic year.",
      website: "https://jeemain.nta.nic.in/",
    },
  });

  const cuetUg = await prisma.exam.upsert({
    where: {
      slug: "cuet-ug",
    },
    update: {
      name: "Common University Entrance Test Undergraduate",
      shortName: "CUET UG",
      conductingBody: "National Testing Agency",
      website: "https://cuet.nta.nic.in/",
    },
    create: {
      name: "Common University Entrance Test Undergraduate",
      slug: "cuet-ug",
      shortName: "CUET UG",
      conductingBody: "National Testing Agency",
      description:
        "A national-level entrance examination used for undergraduate admissions in participating universities.",
      eligibility:
        "Eligibility depends on the participating university and selected program.",
      website: "https://cuet.nta.nic.in/",
    },
  });

  const cat = await prisma.exam.upsert({
    where: {
      slug: "cat",
    },
    update: {
      name: "Common Admission Test",
      shortName: "CAT",
      conductingBody: "Indian Institutes of Management",
      website: "https://iimcat.ac.in/",
    },
    create: {
      name: "Common Admission Test",
      slug: "cat",
      shortName: "CAT",
      conductingBody: "Indian Institutes of Management",
      description:
        "A national-level management entrance examination used by IIMs and other participating institutions.",
      eligibility:
        "Candidates generally need a recognized bachelor's degree meeting the applicable eligibility requirements.",
      website: "https://iimcat.ac.in/",
    },
  });

  // Prevent unused variable warnings if the generated TypeScript
  // configuration treats these references strictly.
  void jeeMain;
  void cuetUg;
  void cat;

  // ==========================================================
  // COLLEGE RANKINGS
  // ==========================================================

  console.log("🏆 Seeding college rankings...");

  const rankingBody = "College Aadhar Ranking";

  const rankings = [
    {
      collegeId: guruNanakDev.id,
      year: 2026,
      rank: 1,
      category: "Overall",
      rankingBody,
      score: 92.4,
      totalColleges: 100,
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
    {
      collegeId: delhiUniversity.id,
      year: 2026,
      rank: 2,
      category: "Overall",
      rankingBody,
      score: 90.8,
      totalColleges: 100,
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
    {
      collegeId: mdu.id,
      year: 2026,
      rank: 3,
      category: "Overall",
      rankingBody,
      score: 87.6,
      totalColleges: 100,
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
    {
      collegeId: guruJambheshwar.id,
      year: 2026,
      rank: 4,
      category: "Overall",
      rankingBody,
      score: 85.9,
      totalColleges: 100,
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
    {
      collegeId: amity.id,
      year: 2026,
      rank: 5,
      category: "Overall",
      rankingBody,
      score: 83.7,
      totalColleges: 100,
      status: "PUBLISHED" as const,
      publishedAt: new Date(),
    },
  ];

  for (const ranking of rankings) {
    await prisma.collegeRanking.upsert({
      where: {
        collegeId_year_rankingBody_category: {
          collegeId: ranking.collegeId,
          year: ranking.year,
          rankingBody: ranking.rankingBody,
          category: ranking.category,
        },
      },
      update: {
        rank: ranking.rank,
        score: ranking.score,
        totalColleges: ranking.totalColleges,
        status: ranking.status,
        publishedAt: ranking.publishedAt,
      },
      create: ranking,
    });
  }

  // ==========================================================
  // BOARD EXAMS
  // ==========================================================

  console.log("📖 Seeding board exams...");

  await prisma.boardExam.upsert({
    where: {
      slug: "cbse-class-12-board-exam-2026",
    },
    update: {
      status: "PUBLISHED",
      name: "CBSE Class XII Board Examination",
      board: "CBSE",
      className: "Class XII",
      examYear: 2026,
      description:
        "CBSE Class XII Board Examination information including examination schedule, registration, results and official updates.",
      examDate: new Date("2026-02-17"),
      resultDate: null,
      officialUrl: "https://www.cbse.gov.in/",
    },
    create: {
      name: "CBSE Class XII Board Examination",
      slug: "cbse-class-12-board-exam-2026",
      board: "CBSE",
      className: "Class XII",
      examYear: 2026,
      description:
        "CBSE Class XII Board Examination information including examination schedule, registration, results and official updates.",
      examDate: new Date("2026-02-17"),
      resultDate: null,
      officialUrl: "https://www.cbse.gov.in/",
      status: "PUBLISHED",
    },
  });

  // ==========================================================
  // FINISH
  // ==========================================================

  console.log("");
  console.log("✅ Database seed completed successfully.");
  console.log("");
  console.log("Seeded:");
  console.log("   • 3 states");
  console.log("   • 5 cities");
  console.log("   • 3 course categories");
  console.log("   • 4 courses");
  console.log("   • 5 colleges");
  console.log("   • 10 college-course relationships");
  console.log("   • 3 entrance exams");
  console.log("   • 5 college rankings");
  console.log("   • 1 board exam");
  console.log("");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:");
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });