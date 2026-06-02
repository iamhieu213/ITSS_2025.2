import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "..", "data");
const dataFile = path.join(dataDir, "studymates.json");

const initialData = {
  classroom: {
    id: 1,
    code: "SSH1151",
    name: "Tư tưởng Hồ Chí Minh",
    semester: "Học kỳ 2026.1",
    lecturer: "TS. Nguyễn Văn Hùng"
  },
  students: [
    {
      id: 1,
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
      id: 2,
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
      website: "yoursite.com",
      reviews: [
        {
          teamName: "Nhóm Marketing 2025.2",
          content: "Có trách nhiệm, hoàn thành task đúng hạn.",
          rating: 5
        },
        {
          teamName: "Nhóm Pháp luật đại cương",
          content: "Chủ động giao tiếp và hỗ trợ team rất tốt.",
          rating: 5
        }
      ]
    },
    {
      id: 3,
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
      id: 4,
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
      id: 5,
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
      id: 6,
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
  ],
  teams: [
    {
      id: 1,
      name: "Team A+ Warriors",
      leaderId: 1,
      description: "Nhóm hướng A+, học nghiêm túc, deadline-driven.",
      targetGrade: "A+",
      maxMembers: 5,
      status: "RECRUITING",
      skills: ["Trách nhiệm", "Chủ động"],
      commitments: ["Họp đúng giờ", "Hoàn thành task đúng hạn", "Chủ động trao đổi", "Tôn trọng thành viên"],
      memberIds: [1, 2, 3, 5]
    },
    {
      id: 2,
      name: "Tư Tưởng Pro",
      leaderId: 6,
      description: "Nhóm 4 người, mục tiêu thuyết trình xuất sắc.",
      targetGrade: "A+",
      maxMembers: 5,
      status: "RECRUITING",
      skills: ["Thuyết trình", "Giao tiếp"],
      commitments: ["Họp đúng giờ", "Hoàn thành task đúng hạn", "Chủ động trao đổi", "Tôn trọng thành viên"],
      memberIds: [6, 4, 3, 5]
    },
    {
      id: 3,
      name: "Học Vui Cùng Bác",
      leaderId: 4,
      description: "Nhóm vui vẻ nhưng làm việc nghiêm túc.",
      targetGrade: "A",
      maxMembers: 5,
      status: "RECRUITING",
      skills: ["Teamwork", "Tự học"],
      commitments: ["Họp đúng giờ", "Hoàn thành task đúng hạn", "Chủ động trao đổi", "Tôn trọng thành viên"],
      memberIds: [4, 1, 6, 5]
    }
  ],
  joinRequests: []
};

const generatedNames = [
  "Bui Minh Tam",
  "Dang Ha My",
  "Tran Quoc Bao",
  "Nguyen Hoai An",
  "Le Gia Huy",
  "Pham Minh Duc",
  "Do Nhat Linh",
  "Hoang Bao Chau",
  "Vu Tien Dat",
  "Nguyen Khanh Vy",
  "Tran Hai Long",
  "Le Thanh Tung",
  "Pham Ngoc Anh",
  "Do Minh Quan",
  "Hoang Phuong Thao",
  "Bui Anh Kiet",
  "Nguyen Duc Anh",
  "Tran Mai Linh",
  "Le Quang Hieu",
  "Pham Gia Bao",
  "Do Thu Trang",
  "Hoang Minh Khoi",
  "Vu Ngoc Mai",
  "Nguyen Tuan Minh",
  "Tran Bao Ngoc",
  "Le Nhat Minh",
  "Pham Hoang Yen",
  "Do Gia Han",
  "Hoang Anh Tuan",
  "Bui Quang Minh",
  "Nguyen Minh Khang",
  "Tran Thanh Lam",
  "Le Hoang Phuc",
  "Pham Khanh An",
  "Do Bao Nam",
  "Hoang Thuy Linh",
  "Vu Minh Tri",
  "Nguyen Anh Thu",
  "Tran Duc Huy",
  "Le Phuong Anh",
  "Pham Tien Dung",
  "Do Hai Yen",
  "Hoang Nam Khanh",
  "Bui Bao Tram",
  "Nguyen Thanh Dat",
  "Tran Gia Linh",
  "Le Minh Chau",
  "Pham Nhat Long",
  "Do Quang Vinh",
  "Hoang Ngoc Han",
  "Vu Anh Quan",
  "Nguyen Bao Linh",
  "Tran Minh Nhat",
  "Le Ha Phuong"
];

const skillSets = [
  ["Giao tiep", "Teamwork", "Chu dong"],
  ["Trach nhiem", "Quan ly thoi gian", "Ho tro nhom"],
  ["Thuyet trinh", "Leadership", "Giai quyet van de"],
  ["Tu duy phan bien", "Chu dong", "Tu hoc"],
  ["Tong hop tai lieu", "Giao tiep", "Dung deadline"]
];

const majors = ["Ky thuat phan mem", "Khoa hoc may tinh", "He thong thong tin", "Tri tue nhan tao"];
const goals = ["A+", "A", "B+"];

function createGeneratedStudents() {
  return generatedNames.map((name, index) => {
    const id = index + 7;
    const slug = name.toLowerCase().replaceAll(" ", ".");
    return {
      id,
      studentCode: String(20211000 + id * 13),
      name,
      email: `${slug}@hust.edu.vn`,
      major: majors[index % majors.length],
      avatar: `https://i.pravatar.cc/120?img=${(index % 60) + 1}`,
      targetGrade: goals[index % goals.length],
      commitmentHours: `${8 + (index % 7) * 2}h/tuần`,
      status: index < 45 ? "IN_TEAM" : "LOOKING",
      rating: Number((4 + (index % 10) / 10).toFixed(1)),
      ratingCount: 2 + (index % 8),
      skills: skillSets[index % skillSets.length],
      bio: "Muon tim nhom hoc tap phu hop, co muc tieu ro rang va lam viec nghiem tuc."
    };
  });
}

initialData.students = [...initialData.students, ...createGeneratedStudents()];

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true });
  try {
    await readFile(dataFile, "utf8");
  } catch {
    await writeFile(dataFile, JSON.stringify(initialData, null, 2), "utf8");
  }
}

export async function readStore() {
  await ensureDataFile();
  return JSON.parse(await readFile(dataFile, "utf8"));
}

export async function writeStore(data) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(dataFile, JSON.stringify(data, null, 2), "utf8");
  return data;
}

export function serializeTeam(team, students) {
  const leader = students.find((student) => student.id === team.leaderId);
  const members = team.memberIds
    .map((id) => students.find((student) => student.id === id))
    .filter(Boolean);

  return {
    ...team,
    leader,
    members,
    memberCount: members.length,
    capacity: `${members.length}/${team.maxMembers}`,
    isNearlyFull: team.maxMembers - members.length <= 1
  };
}
