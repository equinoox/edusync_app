export type HomeNewsArticle = {
  id: number;
  title: string;
  description: string;
  image: string;
  body: string;
};

//  STATIC DATA FORN NOW 
export const homeNewsArticles: HomeNewsArticle[] = [
  {
    id: 1,
    title: "Why education matters for every student",
    description: "Education helps students build knowledge, confidence, discipline, and future opportunities.",
    image: "/news/news_img_1.jpg",
    body: "Education plays an important role in every student’s personal and professional growth. It helps students understand the world around them, develop critical thinking, and build the skills they need for the future. Good education is not only about memorizing facts, but also about learning how to solve problems, communicate ideas, stay organized, and become more independent. For students, every lesson, assignment, and challenge is a step toward stronger confidence and better opportunities.",
  },
  {
    id: 2,
    title: "How students can study smarter with AI",
    description: "Use AI to simplify notes, understand hard topics, and prepare faster for exams.",
    image: "/news/news_img_2.jpg",
    body: "Students often spend too much time rereading notes without knowing what they actually understand. AI can help by turning long PDFs, lessons, and study materials into clear summaries, simple explanations, and practice questions. Instead of memorizing everything at once, students can focus on the most important ideas, test themselves, and quickly discover which topics need more revision. With EduSync, studying becomes more organized, active, and easier to follow step by step.",
  },
  {
    id: 3,
    title: "Why universities shape student success",
    description: "Universities help students gain knowledge, independence, and real career direction.",
    image: "/news/news_img_3.jpg",
    body: "Universities play an important role in helping students grow both academically and personally. They are not only places where students attend lectures and pass exams, but also environments where they learn discipline, responsibility, communication, and problem-solving. Through projects, teamwork, research, and practical assignments, students begin to connect theory with real-world situations. A good university experience can help students discover their interests, build confidence, and prepare for future careers.",
  },
  {
    id: 4,
    title: "How technology is changing education",
    description: "Rapid technological development is transforming how students learn, communicate, and prepare for the future.",
    image: "/news/news_img_4.jpg",
    body: "Technology is developing faster than ever, and education is changing with it. Students now have access to online resources, digital classrooms, AI tools, interactive lessons, and learning platforms that make knowledge easier to reach. This rapid progress helps students learn in more flexible and personalized ways, but it also requires them to adapt, think critically, and use technology responsibly. In modern education, digital skills are becoming just as important as traditional knowledge.",
  },
  {
    id: 5,
    title: "Why programmers are shaping the future",
    description: "Programmers build the digital tools, platforms, and systems that modern life depends on.",
    image: "/news/news_img_5.jpg",
    body: "Programmers play an important role in today’s world because technology is part of almost every industry. They create applications, websites, software systems, and digital solutions that help people learn, work, communicate, and solve problems more efficiently. Being a programmer is not only about writing code, but also about logical thinking, creativity, patience, and continuous learning. As technology keeps developing, programmers will continue to shape the future through innovation and problem-solving.",
  },
  {
    id: 6,
    title: "EduSync and NotebookLM: smarter learning together",
    description: "A powerful collaboration that helps students organize materials, understand topics, and learn more efficiently.",
    image: "/news/news_img_6.png",
    body: "EduSync and NotebookLM together represent a modern way of learning where students can keep their study materials organized and use AI to understand them more deeply. EduSync helps students manage subjects, classrooms, quizzes, progress, and documents in one place, while NotebookLM-style learning support can help transform notes into explanations, summaries, and useful study insights. This kind of collaboration makes education more interactive, personalized, and easier to follow, especially for students who want to study smarter and stay consistent.",
  },
  {
    id: 7,
    title: "Turn notes into practice questions",
    description: "Use your documents to create checks for real understanding.",
    image: "/news/news_img_7.jpg",
    body: "Practice questions reveal whether you can use an idea, not just recognize it. After uploading notes, generate questions from the most important sections and answer before looking back. If you miss one, write a correction in plain language and try a similar question soon after.",
  },
  {
    id: 8,
    title: "Plan a calmer exam week",
    description: "Break large subjects into small review blocks that fit your calendar.",
    image: "/news/news_img_8.jpg",
    body: "A calm exam week starts before the final night. Split each subject into manageable blocks, place the hardest topics earlier, and leave space for rest. Use quizzes to check retention, then use the results to adjust the next block instead of rereading everything from the beginning.",
  },
  {
    id: 9,
    title: "Use classrooms to stay aligned",
    description: "Keep shared materials, quizzes, and updates in one focused workspace.",
    image: "/news/news_img_9.jpg",
    body: "Classrooms help everyone work from the same materials. Professors can publish resources and quizzes in one place, while students can review exactly what belongs to each course. When learning tasks are grouped clearly, fewer details get lost between tools.",
  },
  {
    id: 10,
    title: "Make feedback part of every session",
    description: "Review mistakes quickly so each study block ends with a next step.",
    image: "/news/news_img_10.jpg",
    body: "Feedback works best when it is immediate and specific. After a quiz or practice session, look for one mistake pattern and decide what to do next: reread a section, ask for another explanation, or solve a similar problem. Small feedback loops compound into stronger understanding.",
  },
];
