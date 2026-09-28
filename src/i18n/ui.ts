import type { Lang } from "./languages";

export type UiKey =
  | "nav.home"
  | "nav.projects"
  | "nav.beyond"
  | "nav.about"
  | "nav.resume"
  | "nav.connect"
  | "hero.quote"
  | "hero.cta"
  | "hero.dob"
  | "about.educationMain"
  | "about.educationEm"
  | "about.experienceMain"
  | "about.experienceEm"
  | "projects.titleMain"
  | "projects.titleEm"
  | "projects.intro"
  | "projects.viewDetails"
  | "projects.empty"
  | "projects.notFound"
  | "projects.backHome"
  | "projects.loading"
  | "projects.detailsLabel"
  | "projects.quote"
  | "beyond.titleMain"
  | "beyond.titleEm"
  | "beyond.subtitle"
  | "beyond.otherActivities"
  | "beyond.sportIntro"
  | "beyond.lifeInMotion"
  | "beyond.lifeInMotionDesc"
  | "contact.titleMain"
  | "contact.titleEm"
  | "contact.intro"
  | "contact.formTitle"
  | "contact.name"
  | "contact.email"
  | "contact.message"
  | "contact.send"
  | "footer.copy"
  | "lang.label"
  | "chat.greeting"
  | "chat.placeholder";

export const UI: Record<UiKey, Record<Lang, string>> = {
  "nav.home": { vi: "Trang chủ", en: "Home", ko: "홈", ja: "ホーム", zh: "首页" },
  "nav.projects": { vi: "Dự án", en: "Projects", ko: "프로젝트", ja: "プロジェクト", zh: "项目" },
  "nav.beyond": { vi: "Beyond Workspace", en: "Beyond Workspace", ko: "워크스페이스 너머", ja: "ワークスペースの先へ", zh: "工作之外" },
  "nav.about": { vi: "Giới thiệu", en: "About", ko: "소개", ja: "紹介", zh: "关于" },
  "nav.resume": { vi: "Resume PDF", en: "Resume PDF", ko: "이력서 PDF", ja: "履歴書 PDF", zh: "简历 PDF" },
  "nav.connect": { vi: "Kết Nối", en: "Connect", ko: "연결", ja: "つながる", zh: "联系" },
  "hero.quote": {
    vi: "Là bản thể độc nhất, tôi chọn đầu tư vào sự phát triển cá nhân để tỏa sáng theo cách riêng. Thay vì so sánh, tôi trân trọng hành trình cá nhân và không ngừng hoàn thiện để trở thành phiên bản tốt đẹp nhất của chính mình.",
    en: "As a unique being, I choose to invest in personal growth and shine in my own way. Instead of comparing, I honor my own journey and keep becoming the best version of myself.",
    ko: "고유한 존재로서 저는 자기 성장에 투자하고 제 방식으로 빛나기로 선택합니다. 비교하기보다 제 여정을 소중히 여기며 더 나은 제가 되기 위해 나아갑니다.",
    ja: "唯一無二の存在として、私は自分らしい輝きのために成長へ投資します。比べるのではなく、自分の旅を大切にし、より良い自分であり続けます。",
    zh: "作为独一无二的个体，我选择投资自我成长、以自己的方式发光。与其比较，我更珍视自己的旅程，不断成为更好的自己。",
  },
  "hero.cta": {
    vi: "Khám phá hành trình",
    en: "Explore the journey",
    ko: "여정 살펴보기",
    ja: "旅を探る",
    zh: "探索旅程",
  },
  "hero.dob": { vi: "Ngày sinh", en: "Date of birth", ko: "생년월일", ja: "生年月日", zh: "出生日期" },
  "about.educationMain": { vi: "Học vấn &", en: "Education &", ko: "학력 &", ja: "学歴 &", zh: "学历与" },
  "about.educationEm": { vi: "Chuyên môn", en: "Expertise", ko: "전문성", ja: "専門性", zh: "专业" },
  "about.experienceMain": { vi: "Kinh nghiệm", en: "Hands-on", ko: "실무", ja: "実務", zh: "实践" },
  "about.experienceEm": { vi: "Thực thi", en: "Experience", ko: "경험", ja: "経験", zh: "经验" },
  "projects.titleMain": { vi: "Dự án", en: "Featured", ko: "주요", ja: "注目の", zh: "精选" },
  "projects.titleEm": { vi: "Nổi bật", en: "Projects", ko: "프로젝트", ja: "プロジェクト", zh: "项目" },
  "projects.intro": {
    vi: "Những cột mốc trên hành trình xây dựng hệ sinh thái đổi mới sáng tạo và kết nối tri thức.",
    en: "Milestones in building an innovation ecosystem and connecting knowledge.",
    ko: "혁신 생태계를 만들고 지식을 연결해 온 여정의 이정표입니다.",
    ja: "イノベーションの生態系を築き、知をつないできた軌跡です。",
    zh: "在构建创新生态、连接知识之路上的重要里程碑。",
  },
  "projects.viewDetails": {
    vi: "Xem chi tiết dự án",
    en: "View project details",
    ko: "프로젝트 상세 보기",
    ja: "プロジェクト詳細",
    zh: "查看项目详情",
  },
  "projects.empty": {
    vi: "Chưa có dự án hiển thị. Vào /admin để thêm.",
    en: "No projects to show yet. Add them in /admin.",
    ko: "표시할 프로젝트가 없습니다. /admin에서 추가하세요.",
    ja: "表示するプロジェクトがありません。/admin で追加してください。",
    zh: "暂无项目。请到 /admin 添加。",
  },
  "projects.notFound": { vi: "Dự án không tồn tại", en: "Project not found", ko: "프로젝트를 찾을 수 없습니다", ja: "プロジェクトが見つかりません", zh: "未找到项目" },
  "projects.backHome": { vi: "Quay lại trang chủ", en: "Back to home", ko: "홈으로 돌아가기", ja: "ホームへ戻る", zh: "返回首页" },
  "projects.loading": { vi: "Đang tải...", en: "Loading...", ko: "불러오는 중...", ja: "読み込み中...", zh: "加载中..." },
  "projects.detailsLabel": { vi: "Chi tiết dự án", en: "Project details", ko: "프로젝트 상세", ja: "プロジェクト詳細", zh: "项目详情" },
  "projects.quote": {
    vi: "Xây dựng hành trình từ những cảm xúc thực tế.",
    en: "Build the journey from real emotions.",
    ko: "실제 감정에서 여정을 만들어 갑니다.",
    ja: "本物の感情から旅を築く。",
    zh: "从真实感受出发，构建旅程。",
  },
  "beyond.titleMain": { vi: "Beyond the", en: "Beyond the", ko: "Beyond the", ja: "Beyond the", zh: "Beyond the" },
  "beyond.titleEm": { vi: "Workspace", en: "Workspace", ko: "Workspace", ja: "Workspace", zh: "Workspace" },
  "beyond.subtitle": {
    vi: "Những hoạt động phi lợi nhuận và phong cách sống - Nơi tôi rèn luyện sự bền bỉ, tinh thần kỷ luật và kết nối cộng đồng.",
    en: "Nonprofit work and lifestyle — where I train endurance, discipline, and community connection.",
    ko: "비영리 활동과 라이프스타일 — 지구력, 규율, 공동체와의 연결을 단련하는 공간입니다.",
    ja: "非営利活動とライフスタイル。持久力、規律、コミュニティとのつながりを鍛える場です。",
    zh: "公益与生活方式——在这里锤炼耐力、纪律与社群连接。",
  },
  "beyond.otherActivities": { vi: "Hoạt động khác", en: "Other activities", ko: "기타 활동", ja: "その他の活動", zh: "其他活动" },
  "beyond.sportIntro": {
    vi: "Chạy bộ, Trekking và Flag football không chỉ là thể thao - đó là cách tôi rèn luyện sự bền bỉ, tinh thần kỷ luật và tinh thần lãnh đạo",
    en: "Running, trekking and flag football are more than sports — they train endurance, discipline and leadership.",
    ko: "러닝, 트레킹, 플래그 풋볼은 스포츠를 넘어 지구력, 규율, 리더십을 단련하는 방식입니다.",
    ja: "ランニング、トレッキング、フラッグフットボールはスポーツ以上。持久力・規律・リーダーシップを鍛えます。",
    zh: "跑步、徒步与旗式橄榄球不只是运动——它们锤炼耐力、纪律与领导力。",
  },
  "beyond.lifeInMotion": { vi: "Life in Motion", en: "Life in Motion", ko: "Life in Motion", ja: "Life in Motion", zh: "Life in Motion" },
  "beyond.lifeInMotionDesc": {
    vi: "Chạy bộ, Trekking và Rugby không chỉ là thể thao - đó là cách tôi rèn luyện sự bền bỉ và tinh thần kỷ luật.",
    en: "Running, trekking and rugby are not just sports — they are how I train endurance and discipline.",
    ko: "러닝, 트레킹, 럭비는 단순한 스포츠가 아니라 지구력과 규율을 단련하는 방식입니다.",
    ja: "ランニング、トレッキング、ラグビーはスポーツ以上。持久力と規律を鍛える方法です。",
    zh: "跑步、徒步与橄榄球不只是运动——它们是我锻炼耐力与纪律的方式。",
  },
  "contact.titleMain": { vi: "Let's Build", en: "Let's Build", ko: "Let's Build", ja: "Let's Build", zh: "Let's Build" },
  "contact.titleEm": { vi: "Together.", en: "Together.", ko: "Together.", ja: "Together.", zh: "Together." },
  "contact.intro": {
    vi: "Luôn sẵn lòng cho những ý tưởng mới, những dự án đột phá và những cơ hội hợp tác ý nghĩa.",
    en: "Always open to new ideas, bold projects, and meaningful collaborations.",
    ko: "새로운 아이디어, 도전적인 프로젝트, 의미 있는 협업에 언제나 열려 있습니다.",
    ja: "新しいアイデア、大胆なプロジェクト、意味ある協働にいつでも開かれています。",
    zh: "随时欢迎新想法、突破性项目与有意义的合作。",
  },
  "contact.formTitle": { vi: "Gửi thông điệp", en: "Send a message", ko: "메시지 보내기", ja: "メッセージを送る", zh: "发送留言" },
  "contact.name": { vi: "Họ và tên", en: "Full name", ko: "이름", ja: "お名前", zh: "姓名" },
  "contact.email": { vi: "Email liên hệ", en: "Email", ko: "이메일", ja: "メール", zh: "邮箱" },
  "contact.message": { vi: "Nội dung", en: "Message", ko: "내용", ja: "内容", zh: "内容" },
  "contact.send": { vi: "Gửi ngay", en: "Send now", ko: "보내기", ja: "送信", zh: "立即发送" },
  "footer.copy": {
    vi: "© 2026 Xây dựng sự bền vững từ những hệ thống logic",
    en: "© 2026 Building sustainability from logical systems",
    ko: "© 2026 논리적인 시스템으로 지속가능성을 만듭니다",
    ja: "© 2026 論理的なシステムから持続可能性を築く",
    zh: "© 2026 用逻辑系统构建可持续性",
  },
  "lang.label": { vi: "Ngôn ngữ", en: "Language", ko: "언어", ja: "言語", zh: "语言" },
  "chat.greeting": {
    vi: "Xin chào! Tôi là trợ lý ảo của Nhật Quang. Tôi có thể giúp gì được cho bạn về các dự án và kinh nghiệm của anh ấy?",
    en: "Hi! I’m Nhat Quang’s assistant. Ask me about his projects and experience.",
    ko: "안녕하세요! 저는 녓꽝의 어시스턴트입니다. 프로젝트와 경험에 대해 물어보세요.",
    ja: "こんにちは。Nhật Quang のアシスタントです。プロジェクトや経験についてお聞きください。",
    zh: "你好！我是 Nhật Quang 的助手。欢迎询问他的项目与经历。",
  },
  "chat.placeholder": {
    vi: "Hỏi về dự án, kinh nghiệm...",
    en: "Ask about projects, experience...",
    ko: "프로젝트, 경험에 대해 물어보세요...",
    ja: "プロジェクトや経験について聞く...",
    zh: "询问项目、经历...",
  },
};

/** Phrase lookup for CMS/default Vietnamese copy. Falls back to original. */
export const PHRASES: Record<string, Partial<Record<Lang, string>>> = {
  "Quy mô quốc gia": { en: "National scale", ko: "국가 규모", ja: "国家規模", zh: "国家级" },
  "Hợp tác Chính phủ (Australia)": { en: "Government partnership (Australia)", ko: "정부 협력 (호주)", ja: "政府連携（オーストラリア）", zh: "政府合作（澳大利亚）" },
  "Hợp tác quốc tế": { en: "International cooperation", ko: "국제 협력", ja: "国際協力", zh: "国际合作" },
  "Kết nối đầu tư": { en: "Investment matching", ko: "투자 매칭", ja: "投資マッチング", zh: "投资对接" },
  "Lãnh đạo cộng đồng": { en: "Community leadership", ko: "커뮤니티 리더십", ja: "コミュニティ・リーダーシップ", zh: "社区领导" },
  "PROJECT COORDINATOR": { en: "PROJECT COORDINATOR", ko: "프로젝트 코디네이터", ja: "プロジェクトコーディネーター", zh: "项目协调" },
  "PROJECT MANAGER": { en: "PROJECT MANAGER", ko: "프로젝트 매니저", ja: "プロジェクトマネージャー", zh: "项目经理" },
  "CORE TEAM MEMBER": { en: "CORE TEAM MEMBER", ko: "코어 팀 멤버", ja: "コアチームメンバー", zh: "核心团队成员" },
  "Học vấn &": { en: "Education &", ko: "학력 &", ja: "学歴 &", zh: "学历与" },
  "Chuyên môn": { en: "Expertise", ko: "전문성", ja: "専門性", zh: "专业" },
  "Kinh nghiệm": { en: "Hands-on", ko: "실무", ja: "実務", zh: "实践" },
  "Thực thi": { en: "Experience", ko: "경험", ja: "経験", zh: "经验" },
  "Volunteer Leadership Programs": { en: "Volunteer Leadership Programs", ko: "자원봉사 리더십 프로그램", ja: "ボランティア・リーダーシップ", zh: "志愿领导力项目" },
  "Sứ mệnh & Mục tiêu": { en: "Mission & goals", ko: "미션 & 목표", ja: "ミッションと目標", zh: "使命与目标" },
  "Vai trò đóng góp (Tình nguyện viên Core Team)": {
    en: "Contribution (Volunteer Core Team)",
    ko: "기여 역할 (자원봉사 코어팀)",
    ja: "貢献（ボランティア・コアチーム）",
    zh: "贡献角色（志愿核心团队）",
  },
  "Các chương trình đặc sắc & Bài học đúc kết": {
    en: "Signature programs & takeaways",
    ko: "주요 프로그램과 배움",
    ja: "特徴的なプログラムと学び",
    zh: "特色项目与收获",
  },
  "Khoảnh khắc & Hoạt động": { en: "Moments & activities", ko: "순간과 활동", ja: "瞬間と活動", zh: "瞬间与活动" },
  "Hành Trình Về Nguồn & Tu Tập": { en: "Return to origin & practice", ko: "근원으로의 여정과 수행", ja: "根源への旅と修行", zh: "寻根与修行" },
  "Thầy Pháp Nhật tại Yên Tử": { en: "Thầy Pháp Nhật at Yên Tử", ko: "옌뜨의 팝녓 스님", ja: "イェンツーの法日師", zh: "法日师父于安子" },
  "Không gian & Khoảnh khắc Tu tập": { en: "Space & moments of practice", ko: "수행의 공간과 순간", ja: "修行の空間と瞬間", zh: "修行空间与瞬间" },
  "Curated Moments": { en: "Curated Moments", ko: "엄선된 순간", ja: "キュレーションされた瞬間", zh: "精选瞬间" },
  "Khoảnh khắc Đồng hành": { en: "Moments of companionship", ko: "동행의 순간", ja: "伴走の瞬間", zh: "同行瞬间" },
  "Bachelor of Software Engineering": { en: "Bachelor of Software Engineering", ko: "소프트웨어공학 학사", ja: "ソフトウェア工学学士", zh: "软件工程学士" },
  "Professional Certificate": { en: "Professional Certificate", ko: "전문 수료증", ja: "プロフェッショナル認定", zh: "专业证书" },
  "Project Management Project": { en: "Project Management Project", ko: "프로젝트 매니지먼트", ja: "プロジェクトマネジメント", zh: "项目管理" },
  "Introduction to UX Principles and Processes": {
    en: "Introduction to UX Principles and Processes",
    ko: "UX 원칙과 프로세스 입문",
    ja: "UX原則とプロセス入門",
    zh: "UX 原则与流程导论",
  },
  "2024 — Hiện tại": { en: "2024 — Present", ko: "2024 — 현재", ja: "2024 — 現在", zh: "2024 — 至今" },
  "Tham gia điều phối và quản trị các dự án đổi mới sáng tạo cấp quốc gia, kết nối hệ sinh thái khởi nghiệp Việt Nam với các nguồn lực quốc tế.": {
    en: "Coordinating and managing national innovation programs, connecting Vietnam’s startup ecosystem with international resources.",
    ko: "국가 혁신 프로젝트를 조율·운영하며 베트남 스타트업 생태계를 국제 자원과 연결합니다.",
    ja: "国家規模のイノベーション事業を調整・運営し、ベトナムのスタートアップ生態系を国際リソースとつなぎます。",
    zh: "协调并管理国家级创新项目，连接越南创业生态与国际资源。",
  },
};
