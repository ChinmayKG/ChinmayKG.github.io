export type Category =
  "ROBOTICS" | "MECHANICAL" | "EMBEDDED" | "AI / ML" | "SIMULATION";
export interface Project {
  id: string;
  title: string;
  category: string;
  filters: Category[];
  description: string;
  tags: string[];
  image: string;
  status: string;
  context?: string;
  date?: string;
  guide?: string;
  details: string[];
  metrics?: string[];
  featured?: boolean;
}
export interface Experience {
  company: string;
  role: string;
  date: string;
  project: string;
  association?: string;
  points: string[];
  tags: string[];
}
export const profile = {
  name: "Chinmay KG",
  email: "kgchinmay2006@gmail.com",
  github: "https://github.com/ChinmayKG",
  linkedin: "https://www.linkedin.com/in/chinmay-kg-6114b8314/",
  description:
    "I'm Chinmay KG, a Mechanical Engineering undergraduate at IIT Bombay. My interests lie at the intersection of mechanical systems, robotics, automation, embedded systems and machine learning. I enjoy building physical systems, understanding how they work, modelling their behaviour and integrating computation and intelligence into engineering applications.",
};
export const projects: Project[] = [
  {
    id: "01",
    title: "6-DOF Robotic Manipulator",
    category: "ROBOTICS / AUTOMATION",
    filters: ["ROBOTICS", "MECHANICAL", "EMBEDDED"],
    description:
      "A complete six-axis robotic manipulator. From mechanical design and actuator selection to control electronics and embedded motion control.",
    tags: [
      "Arduino Mega",
      "NEMA 11",
      "NEMA 17",
      "NEMA 23",
      "CAD",
      "Embedded Control",
      "Actuation",
    ],
    image: "robotic-arm.webp",
    status: "PROTOTYPE DEVELOPED",
    context: "NILATECH",
    date: "Jun – Jul 2026",
    featured: true,
    details: [
      "Designed and developed a six-degree-of-freedom robotic manipulator from scratch.",
      "Built CAD models and completed actuator selection, mechanical assembly and prototype development.",
      "Integrated NEMA 11, NEMA 17 and NEMA 23 motors with drivers and control electronics.",
      "Developed an Arduino Mega 2560 control unit for joint-wise angular control and synchronized actuator motion.",
    ],
    metrics: ["06 axes", "03 motor classes", "01 integrated system"],
  },
  {
    id: "02",
    title: "Electrically Assisted Turbocharger",
    category: "AUTOMOTIVE / CONTROL",
    filters: ["MECHANICAL", "SIMULATION"],
    description:
      "An electrically assisted turbocharger concept designed to reduce turbo lag and improve vehicle performance.",
    tags: [
      "MATLAB",
      "Simulink",
      "Powertrain",
      "Control Systems",
      "Turbocharger",
      "Mechanical Design",
    ],
    image: "turbocharger.webp",
    status: "CONCEPT ANALYSED",
    context: "Team TorqueX",
    date: "Jul – Nov 2025",
    details: [
      "Studied existing turbocharger technologies and established performance benchmarks.",
      "Modelled the powertrain in MATLAB Simulink and studied its dynamic behaviour.",
      "Developed foundational control logic for electrical assistance.",
    ],
  },
  {
    id: "03",
    title: "IMU Controlled Vehicle",
    category: "ROBOTICS / EMBEDDED",
    filters: ["ROBOTICS", "EMBEDDED"],
    description:
      "A robotic vehicle translating MPU6050 inertial input into motion through a Raspberry Pi Pico.",
    tags: [
      "Raspberry Pi Pico",
      "MPU6050",
      "Embedded C",
      "L298N",
      "Motor Control",
      "Sensor Calibration",
    ],
    image: "imu-vehicle.webp",
    status: "PROTOTYPE DEVELOPED",
    context: "XLR8",
    date: "Aug – Sep 2024",
    details: [
      "Developed an IMU-controlled robotic vehicle with a Raspberry Pi Pico.",
      "Integrated an MPU6050 sensor and L298N motor driver.",
      "Worked on embedded C, sensor calibration and motor control.",
    ],
  },
  {
    id: "04",
    title: "Watt’s Linkage Mechanism",
    category: "MECHANICAL / SIMULATION",
    filters: ["MECHANICAL", "SIMULATION"],
    description:
      "A multibody dynamic model of Watt’s linkage, simulating steam-engine piston motion in MSC Adams.",
    tags: [
      "MSC Adams",
      "Mechanism Design",
      "Multibody Dynamics",
      "Kinematics",
      "Simulation",
    ],
    image: "watts-linkage.webp",
    status: "SIMULATION COMPLETED",
    context: "ME444",
    date: "May – Jul 2025",
    guide: "Prof. P. Sheshu",
    details: [
      "Designed a 14-joint mechanism using revolute, translational and fixed joints.",
      "Integrated a flywheel and applied time-dependent SFORCE.",
      "Analysed piston displacement and velocity.",
      "Validated reciprocating-to-rotational motion conversion.",
    ],
    metrics: ["14 joints", "Multibody dynamics"],
  },
  {
    id: "05",
    title: "Wireless Drone Controller",
    category: "EMBEDDED SYSTEMS",
    filters: ["EMBEDDED"],
    description:
      "A complete wireless drone controller, from PCB design and fabrication to ESP32 firmware and calibration.",
    tags: [
      "ESP32",
      "Arduino IDE",
      "PCB",
      "Fusion 360",
      "3D Printing",
      "Laser Cutting",
      "Embedded Systems",
    ],
    image: "drone-controller.webp",
    status: "PROTOTYPE DEVELOPED",
    context: "Makerspace / MS101",
    date: "Aug – Nov 2024",
    guide: "Prof. Joseph John",
    details: [
      "Designed the PCB, soldered components and assembled the controller.",
      "Programmed an ESP32 for dual-joystick input and wireless communication.",
      "Implemented safety protocols and controller calibration.",
      "Used Fusion 360, 3D printing and laser cutting for fabrication.",
    ],
  },
  {
    id: "06",
    title: "Epidemic Spread Prediction",
    category: "AI / MACHINE LEARNING",
    filters: ["AI / ML"],
    description:
      "An XGBoost forecasting system built on global epidemiological time-series data. CodeCure AI Hackathon finalist.",
    tags: ["Python", "XGBoost", "Pandas", "NumPy", "Scikit-learn", "Streamlit"],
    image: "epidemic-ai.webp",
    status: "HACKATHON FINALIST",
    context: "CodeCure AI Hackathon · IIT BHU",
    date: "Apr 2026",
    details: [
      "Processed 285K+ records across 197 countries and 73 provinces.",
      "Engineered features from daily cases, vaccination progress, ICU occupancy and mobility trends.",
      "Evaluated forecasts using MAE, RMSE and MAPE.",
      "Built an interactive Streamlit interface.",
    ],
    metrics: ["285K+ records", "197 countries", "73 provinces"],
  },
  {
    id: "07",
    title: "SolarSense",
    category: "MACHINE LEARNING / ENERGY",
    filters: ["AI / ML"],
    description:
      "Solar plant feasibility and output forecasting using weather and historical plant data.",
    tags: [
      "Python",
      "Machine Learning",
      "XGBoost",
      "Weather API",
      "Data Processing",
    ],
    image: "solarsense.webp",
    status: "MODELS DEVELOPED",
    context: "ME228",
    date: "Jan – Apr 2026",
    guide: "Prof. Neeraj Kumbhakarna",
    details: [
      "Integrated weather data with 34K+ historical solar-plant data points.",
      "Used irradiance, temperature and temporal features with Logistic Regression and XGBoost.",
      "Produced GO / NO-GO feasibility decisions, AC power predictions and potential profit/loss estimates.",
    ],
    metrics: ["34K+ data points", "02 model families"],
  },
  {
    id: "08",
    title: "High-Temperature Inconel Alloys",
    category: "MATERIALS / MECHANICAL",
    filters: ["MECHANICAL"],
    description:
      "A study of Inconel alloys in gas turbines, focusing on high-temperature strength and thermal stability.",
    tags: [
      "Materials Engineering",
      "Gas Turbines",
      "High-temperature Alloys",
      "Inconel",
    ],
    image: "inconel.webp",
    status: "STUDY COMPLETED",
    date: "Aug – Nov 2025",
    details: [
      "Studied the properties and high-temperature applications of Inconel alloys.",
      "Examined strength and thermal stability in gas-turbine applications.",
    ],
  },
];
export const experiences: Experience[] = [
  {
    company: "NILATECH",
    role: "Robotics and Automation Intern",
    date: "Jun 2026 – Jul 2026",
    project:
      "Design and Development of a 6-DOF Robotic Manipulator System with Motion Control and Actuation Integration",
    points: [
      "Designed and developed a 6-DOF robotic manipulator from scratch.",
      "Worked on CAD modelling, actuator selection, 3D mechanical design, assembly and prototype development.",
      "Integrated NEMA 11, NEMA 17 and NEMA 23 motors, motor drivers and control electronics.",
      "Developed an Arduino Mega 2560-based control unit.",
      "Implemented joint-wise angular control and synchronized actuator motion.",
    ],
    tags: [
      "CAD",
      "Arduino Mega",
      "NEMA Motors",
      "Motor Drivers",
      "Embedded Control",
      "Mechanical Design",
    ],
  },
  {
    company: "Strategic ERP",
    role: "Applied Machine Learning Intern",
    date: "May 2025 – Jun 2025",
    association:
      "Associated with Robert Bosch Centre for Cyber-Physical Systems (RBCCPS), IISc Bangalore",
    project: "Personal Health Assistant Chatbot",
    points: [
      "Developed a machine-learning based Personal Health Assistant Chatbot.",
      "Built a Retrieval-Augmented Generation pipeline.",
      "Used a specialized knowledge base containing medical articles from PubMed.",
      "Worked on context-aware information retrieval and response generation.",
    ],
    tags: ["RAG", "Machine Learning", "PubMed", "LLMs", "Knowledge Retrieval"],
  },
];
export const skills = [
  {
    id: "M01",
    title: "Mechanical Systems",
    subtitle: "STRUCTURE & MOTION",
    items: [
      "MSC Adams",
      "Fusion 360",
      "Mechanical Design",
      "Mechanisms",
      "Manufacturing",
      "G-code",
    ],
  },
  {
    id: "C02",
    title: "Control & Embedded",
    subtitle: "SENSE & ACTUATE",
    items: [
      "Arduino",
      "ESP32",
      "Raspberry Pi Pico",
      "Motor Control",
      "Sensors",
      "Actuators",
      "Embedded C",
    ],
  },
  {
    id: "A03",
    title: "AI & Data",
    subtitle: "PERCEPTION & INTELLIGENCE",
    items: [
      "Python",
      "PyTorch",
      "TensorFlow",
      "Scikit-learn",
      "NumPy",
      "Pandas",
      "OpenCV",
      "XGBoost",
      "LangChain",
      "LangGraph",
      "ChromaDB",
    ],
  },
  {
    id: "S04",
    title: "Engineering Software",
    subtitle: "MODEL & DEVELOP",
    items: [
      "MATLAB",
      "Simulink",
      "Docker",
      "Git",
      "GitHub",
      "VS Code",
      "Jupyter",
      "Google Colab",
      "Anaconda",
    ],
  },
];
export const education = [
  {
    date: "2024 – 2028",
    institution: "IIT Bombay",
    qualification: "B.Tech · Mechanical Engineering",
    result: "CPI 7.5",
  },
  {
    date: "2024",
    institution: "JNV Bagalur",
    qualification: "Higher Secondary Certificate",
    result: "93%",
  },
  {
    date: "2022",
    institution: "JNV Gajnur",
    qualification: "Secondary School Certificate",
    result: "94.2%",
  },
];
export const courses = [
  {
    title: "Mechanical Engineering",
    items: [
      "Thermodynamics",
      "Engineering Mechanics",
      "Solid Mechanics",
      "Structural Materials",
      "Fluid Mechanics",
      "Mechanical Processing of Materials",
      "Analysis & Design of Mechanical Systems",
    ],
  },
  {
    title: "Mathematics",
    items: ["Calculus", "Linear Algebra", "Ordinary Differential Equations"],
  },
  {
    title: "Computational",
    items: [
      "Applied Data Science & Machine Learning",
      "Computer Programming",
      "Design Thinking",
    ],
  },
];
export const extracurricular = [
  "State-level and district-level chess participation",
  "Art in Education Workshop",
  "50+ hours of flute training at IIT Bombay",
  "SOF Olympiads participation",
  "State-level Abacus competition",
  "Data Structures and Algorithms workshop",
];
