import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const courseData = {
  code: "SSH1151",
  name: "Tư tưởng Hồ Chí Minh",
  semester: "Học kỳ 2026.1",
  lecturer: "TS. Nguyễn Văn Hùng"
};

const students = [
  {
    studentCode: "20211000",
    name: "Nguyễn Minh Anh",
    email: "minhanh@hust.edu.vn",
    major: "Kỹ thuật phần mềm",
    avatar: "https://i.pravatar.cc/120?img=47",
    targetGrade: "A+",
    commitmentHours: "8h/tuần",
    status: "IN_TEAM",
    rating: 4.0,
    ratingCount: 3,
    skills: ["Giao tiếp", "Leadership", "Thuyết trình"],
    bio: "Thích lập kế hoạch rõ ràng và bám deadline."
  },
  {
    studentCode: "20211013",
    name: "Trần Thu Hà",
    email: "tranthuha@hust.edu.vn",
    major: "Kỹ thuật phần mềm",
    avatar: "https://i.pravatar.cc/120?img=5",
    targetGrade: "A+",
    commitmentHours: "10h/tuần",
    status: "LOOKING",
    rating: 4.7,
    ratingCount: 4,
    skills: ["Trách nhiệm", "Quản lý thời gian", "Hỗ trợ nhóm"],
    bio: "Sinh viên năm 3, thích làm project thực tế và học hỏi.",
    github: "github.com/username",
    linkedin: "linkedin.com/in/username",
    website: "yoursite.com"
  },
  {
    studentCode: "20211026",
    name: "Lê Hoàng Nam",
    email: "hoangnam@hust.edu.vn",
    major: "Khoa học máy tính",
    avatar: "https://i.pravatar.cc/120?img=12",
    targetGrade: "A",
    commitmentHours: "12h/tuần",
    status: "IN_TEAM",
    rating: 4.4,
    ratingCount: 5,
    skills: ["Chủ động", "Tư duy phản biện", "Giải quyết vấn đề"],
    bio: "Mạnh về phân tích và trình bày luận điểm."
  },
  {
    studentCode: "20211039",
    name: "Phạm Quỳnh Chi",
    email: "quynhchi@hust.edu.vn",
    major: "Hệ thống thông tin",
    avatar: "https://i.pravatar.cc/120?img=32",
    targetGrade: "A",
    commitmentHours: "15h/tuần",
    status: "IN_TEAM",
    rating: 4.1,
    ratingCount: 6,
    skills: ["Giao tiếp", "Teamwork"],
    bio: "Ưu tiên làm việc nhóm rõ vai trò."
  },
  {
    studentCode: "20211052",
    name: "Vũ Đức Mạnh",
    email: "ducmanh@hust.edu.vn",
    major: "Kỹ thuật phần mềm",
    avatar: "https://i.pravatar.cc/120?img=15",
    targetGrade: "A",
    commitmentHours: "18h/tuần",
    status: "IN_TEAM",
    rating: 4.8,
    ratingCount: 7,
    skills: ["Trách nhiệm", "Hỗ trợ nhóm", "Quản lý thời gian"],
    bio: "Có thể hỗ trợ tổng hợp tài liệu và nhắc deadline."
  },
  {
    studentCode: "20211065",
    name: "Đỗ Khánh Linh",
    email: "khanhlinh@hust.edu.vn",
    major: "Kỹ thuật phần mềm",
    avatar: "https://i.pravatar.cc/120?img=44",
    targetGrade: "B+",
    commitmentHours: "20h/tuần",
    status: "IN_TEAM",
    rating: 4.5,
    ratingCount: 8,
    skills: ["Chủ động", "Thuyết trình", "Giao tiếp"],
    bio: "Tự tin thuyết trình và điều phối nội dung."
  }
];

async function main() {
  await prisma.joinRequest.deleteMany();
  await prisma.teamMember.deleteMany();
  await prisma.review.deleteMany();
  await prisma.team.deleteMany();
  await prisma.student.deleteMany();
  await prisma.course.deleteMany();

  const course = await prisma.course.create({ data: courseData });

  const createdStudents = {};
  for (const student of students) {
    const created = await prisma.student.create({
      data: { ...student, courseId: course.id }
    });
    createdStudents[student.studentCode] = created;
  }

  const teamSeeds = [
    {
      name: "Team A+ Warriors",
      leaderCode: "20211000",
      description: "Nhóm hướng A+, học nghiêm túc, deadline-driven.",
      targetGrade: "A+",
      maxMembers: 5,
      skills: ["Trách nhiệm", "Chủ động"],
      commitments: ["Họp đúng giờ", "Hoàn thành task đúng hạn", "Chủ động trao đổi", "Tôn trọng thành viên"],
      memberCodes: ["20211000", "20211013", "20211026", "20211052"]
    },
    {
      name: "Tư Tưởng Pro",
      leaderCode: "20211065",
      description: "Nhóm 4 người, mục tiêu thuyết trình xuất sắc.",
      targetGrade: "A+",
      maxMembers: 5,
      skills: ["Thuyết trình", "Giao tiếp"],
      commitments: ["Họp đúng giờ", "Hoàn thành task đúng hạn", "Chủ động trao đổi", "Tôn trọng thành viên"],
      memberCodes: ["20211065", "20211039", "20211026", "20211052"]
    },
    {
      name: "Học Vui Cùng Bác",
      leaderCode: "20211039",
      description: "Nhóm vui vẻ nhưng làm việc nghiêm túc.",
      targetGrade: "A",
      maxMembers: 5,
      skills: ["Teamwork", "Tự học"],
      commitments: ["Họp đúng giờ", "Hoàn thành task đúng hạn", "Chủ động trao đổi", "Tôn trọng thành viên"],
      memberCodes: ["20211039", "20211000", "20211065", "20211052"]
    }
  ];

  for (const teamSeed of teamSeeds) {
    const team = await prisma.team.create({
      data: {
        name: teamSeed.name,
        description: teamSeed.description,
        targetGrade: teamSeed.targetGrade,
        maxMembers: teamSeed.maxMembers,
        skills: teamSeed.skills,
        commitments: teamSeed.commitments,
        courseId: course.id,
        leaderId: createdStudents[teamSeed.leaderCode].id
      }
    });

    for (const code of teamSeed.memberCodes) {
      await prisma.teamMember.create({
        data: {
          teamId: team.id,
          studentId: createdStudents[code].id,
          role: code === teamSeed.leaderCode ? "LEADER" : "MEMBER"
        }
      });
    }
  }

  await prisma.review.createMany({
    data: [
      {
        studentId: createdStudents["20211013"].id,
        teamName: "Nhóm Marketing 2025.2",
        content: "Có trách nhiệm, hoàn thành task đúng hạn.",
        rating: 5
      },
      {
        studentId: createdStudents["20211013"].id,
        teamName: "Nhóm Pháp luật đại cương",
        content: "Chủ động giao tiếp và hỗ trợ team rất tốt.",
        rating: 5
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
