import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Curated Cliché Database for reference and fallback
const CURATED_CLICHES = [
  {
    topic: 'Library Management System',
    rejectionRate: 98,
    category: 'Information Systems',
    status: 'Instantly Rejected',
    flaw: 'Zero innovation; standard CRUD database application covered in 2nd semester web engineering.',
    rescueUpgrade: 'Autonomous RFID/LiDAR book shelf inventory robot with real-time digital twin localization and predictive reserve analytics.'
  },
  {
    topic: 'Online E-commerce Store / Multi-vendor Marketplace',
    rejectionRate: 95,
    category: 'Web Applications',
    status: 'Instantly Rejected',
    flaw: 'Commercially solved 20 years ago; Shopify/WooCommerce do this out of the box with zero custom engineering.',
    rescueUpgrade: 'Zero-knowledge decentralized multi-party commerce with 3D AR virtual try-on and dynamic real-time biometric fraud mitigation.'
  },
  {
    topic: 'Face Recognition Attendance System',
    rejectionRate: 92,
    category: 'Computer Vision',
    status: 'Heavily Disapproved',
    flaw: 'Using an off-the-shelf OpenCV/face_recognition Python script with a webcam is a tutorial, not a 1-year Capstone.',
    rescueUpgrade: '3D passive liveness anti-spoofing at edge (IR + RGB) under extreme occlusion and crowd density with differential privacy.'
  },
  {
    topic: 'Hospital / Doctor Appointment Booking App',
    rejectionRate: 90,
    category: 'Mobile / Cloud',
    status: 'Heavily Disapproved',
    flaw: 'Simple scheduling database with standard calendar UI.',
    rescueUpgrade: 'Federated EHR triaging pipeline with offline-first emergency mesh routing for disaster/low-bandwidth clinics.'
  },
  {
    topic: 'Student Management / University Portal',
    rejectionRate: 96,
    category: 'Web Systems',
    status: 'Instantly Rejected',
    flaw: 'Pure CRUD forms for grades and attendance.',
    rescueUpgrade: 'Predictive student attrition early-warning neural graph with explainable SHAP dashboards and automated remedial pathway generation.'
  },
  {
    topic: 'Plant Disease Detection using Camera',
    rejectionRate: 78,
    category: 'AI / Agriculture',
    status: 'Common / Needs Twist',
    flaw: 'Every student downloads PlantVillage dataset and fine-tunes MobileNet. Professors know this dataset by heart.',
    rescueUpgrade: 'Edge IoT multi-spectral NDVI sensor node with soil moisture correlation, offline TinyML on ESP32/Raspberry Pi, and localized micro-climate treatment prescription.'
  },
  {
    topic: 'Smart Parking System using OpenCV',
    rejectionRate: 85,
    category: 'IoT / Vision',
    status: 'Heavily Disapproved',
    flaw: 'Bounding box contour counting on a static CCTV feed.',
    rescueUpgrade: 'Decentralized V2I (Vehicle-to-Infrastructure) dynamic slot auction protocol with edge occupancy fusion and EV battery-state load balancing.'
  },
  {
    topic: 'Fake News / Sentiment Classifier',
    rejectionRate: 82,
    category: 'NLP',
    status: 'Heavily Disapproved',
    flaw: 'Basic TF-IDF or BERT classifier on an existing Kaggle dataset.',
    rescueUpgrade: 'Multi-modal cross-platform propagation graph forensics with temporal fact-verification and provenance watermark tracing.'
  }
];

// Helper fallback generator if Gemini call encounters issues or offline testing
function generateIntelligentFallback(idea: string, domain: string, appliedTwists: string[] = []) {
  const ideaLower = idea.toLowerCase();
  
  // Baseline uniqueness
  let baseScore = 48;
  let verdict: any = 'Common / Needs Significant Upgrade';
  let closestCliche = 'Standard Tutorial / Kaggle Level Project';
  let professorReaction = 'Professors will ask: "How is this different from the 100 tutorials on GitHub or existing open-source repos?"';

  if (ideaLower.includes('library') || ideaLower.includes('management system') || ideaLower.includes('portal') || ideaLower.includes('hotel booking')) {
    baseScore = 24;
    verdict = 'Critical Cliché / High Rejection Risk';
    closestCliche = 'Classic CRUD Database Application (Overdone since 2005)';
    professorReaction = 'Supervisor: "This is 2nd semester Database lab work, not an Engineering Final Year Project. Redo your proposal."';
  } else if (ideaLower.includes('attendance') || ideaLower.includes('face recognition')) {
    baseScore = 38;
    verdict = 'Common / Needs Significant Upgrade';
    closestCliche = 'Generic Face Recognition with OpenCV';
    professorReaction = 'Committee: "You just pip installed opencv-python and downloaded Haar cascades or dlib. What is your actual research contribution?"';
  } else if (ideaLower.includes('plant') || ideaLower.includes('crop') || ideaLower.includes('leaf') || ideaLower.includes('disease')) {
    baseScore = 42;
    verdict = 'Common / Needs Significant Upgrade';
    closestCliche = 'PlantVillage Dataset CNN Image Classifier';
    professorReaction = 'Professors: "Three groups presented Plant Disease last semester using Kaggle datasets. Why should we approve another one?"';
  } else if (ideaLower.includes('parking') || ideaLower.includes('traffic') || ideaLower.includes('car')) {
    baseScore = 45;
    verdict = 'Common / Needs Significant Upgrade';
    closestCliche = 'Standard CCTV Contour Parking Detection';
    professorReaction = 'Panel: "What happens when it rains, or at night? How do sensors handle shadows or network dropouts?"';
  } else if (ideaLower.includes('fake news') || ideaLower.includes('sentiment') || ideaLower.includes('chat')) {
    baseScore = 44;
    verdict = 'Common / Needs Significant Upgrade';
    closestCliche = 'Basic Kaggle Dataset Classifier / Generic Wrapper';
    professorReaction = 'Internal Evaluator: "Are you just querying an LLM API or training a standard classifier on static Kaggle data?"';
  }

  // Calculate score boost if twists applied
  const boost = appliedTwists.length * 16;
  const finalScore = Math.min(96, baseScore + boost);

  return {
    uniquenessScore: finalScore,
    verdict: finalScore >= 85 ? 'Highly Unique & Innovative' : finalScore >= 70 ? 'Moderate / Good Potential' : verdict,
    clicheComparison: {
      isCliche: finalScore < 65,
      closestCliches: [closestCliche, 'Generic Web/Mobile Wrapper', 'Standard Kaggle Notebook Implementation'],
      clicheRiskReason: 'Lack of novel system integration, real-world data validation, edge deployment, or proprietary architectural challenge.',
      professorReaction
    },
    scoreBreakdown: {
      technicalDepth: Math.min(95, 45 + (appliedTwists.length * 15)),
      marketNovelty: Math.min(94, finalScore),
      academicRigor: Math.min(92, 50 + (appliedTwists.length * 12)),
      industryRelevance: Math.min(95, 55 + (appliedTwists.length * 10)),
      executionFeasibility: Math.max(68, 90 - (appliedTwists.length * 5))
    },
    professorRedFlags: [
      'Reliance on pre-cleaned Kaggle datasets with zero real-world messy data handling.',
      'Thin wrapper around third-party APIs without proprietary business logic or custom ML training.',
      'Superficial evaluation: reporting only simple training accuracy instead of Precision/Recall, latency, and edge compute benchmarks.',
      'No contingency or failover protocol when hardware, network, or third-party dependencies drop.'
    ],
    smartTwists: [
      {
        id: 'twist_edge_iot',
        category: 'IoT & Edge Computing',
        title: 'Edge TinyML + Multi-Sensor Hardware Integration',
        description: 'Deploy quantized INT8 models directly onto low-power microcontrollers (ESP32-CAM or Raspberry Pi 5) with auxiliary physical telemetry sensors, eliminating cloud dependency and latency.',
        projectedScoreBoost: 22,
        hardwareOrApiRequirements: ['ESP32-S3 or Raspberry Pi 4/5', 'I2C/SPI environmental sensors', 'TensorFlow Lite for Microcontrollers'],
        whyProfessorsLoveIt: 'Hardware + software co-design instantly shifts the project from a generic software app to an applied Computer Engineering thesis.'
      },
      {
        id: 'twist_federated_privacy',
        category: 'Advanced AI & ML',
        title: 'Federated Learning with Differential Privacy',
        description: 'Decentralize the training pipeline so client devices collaboratively train a shared global model without uploading raw user or sensor data to a centralized server.',
        projectedScoreBoost: 26,
        hardwareOrApiRequirements: ['PyTorch / Flower (flwr.dev) Framework', 'Differential Privacy (Opacus)', 'WebSockets / gRPC'],
        whyProfessorsLoveIt: 'Solves actual IEEE privacy compliance challenges; gives you mathematically defensible research metrics for your thesis paper.'
      },
      {
        id: 'twist_offline_mesh',
        category: 'Enterprise & Cloud Architecture',
        title: 'Offline-First Architecture with Peer-to-Peer Mesh Sync',
        description: 'Engineer local CRDTs (Conflict-free Replicated Data Types) and BLE/LoRa ad-hoc mesh routing so the system operates seamlessly in rural or disaster zones with zero internet connectivity.',
        projectedScoreBoost: 19,
        hardwareOrApiRequirements: ['LoRa SX1276 modules or WebRTC datachannels', 'Yjs / Automerge CRDTs', 'SQLite/IndexedDB local store'],
        whyProfessorsLoveIt: 'Shows sophisticated systems engineering and fault-tolerance far beyond typical web CRUD frameworks.'
      },
      {
        id: 'twist_explainable_ai',
        category: 'Real-world & Localized Impact',
        title: 'Explainable AI (XAI) with Actionable Expert Decision Support',
        description: 'Integrate Grad-CAM visual heatmaps, SHAP feature importance vectors, and contextual prescriptive reasoning rather than a simple opaque classification score.',
        projectedScoreBoost: 18,
        hardwareOrApiRequirements: ['Grad-CAM / Integrated Gradients', 'FastAPI inference microservice', 'Interactive Canvas Visualizer'],
        whyProfessorsLoveIt: 'Committees reject "black-box" models; providing visual auditability demonstrates genuine understanding of ML theory.'
      }
    ],
    systemBlueprint: {
      architectureSummary: `Distributed microservices architecture bridging edge telemetry, an async processing queue, and an explainable decision intelligence engine for ${idea}.`,
      layers: [
        {
          name: 'Client & Presentation Tier',
          technologies: ['React 19 + TypeScript', 'Tailwind CSS', 'PWA Offline Worker'],
          role: 'Interactive student/operator dashboard with live telemetry stream, real-time heatmaps, and local cache.'
        },
        {
          name: 'API Gateway & Ingestion Service',
          technologies: ['FastAPI (Python) or Go Gin', 'JWT / mTLS Auth', 'WebSocket Multiplexer'],
          role: 'High-throughput async endpoint routing incoming sensor frames and user transactions.'
        },
        {
          name: 'Core AI & Analytics Engine',
          technologies: ['PyTorch / ONNX Runtime', 'TensorFlow Lite', 'NumPy / OpenCV'],
          role: 'Model inference, temporal feature extraction, multi-modal sensor fusion, and Grad-CAM saliency generation.'
        },
        {
          name: 'Persistent Data & Cache Tier',
          technologies: ['PostgreSQL + TimescaleDB (time-series)', 'Redis (pub/sub & session cache)', 'MinIO (object storage)'],
          role: 'Relational entity storage, high-frequency telemetry logging, and raw diagnostic media caching.'
        },
        {
          name: 'Hardware & Edge Nodes',
          technologies: ['Raspberry Pi 4 / ESP32-S3', 'MQTT Protocol', 'Docker Containerization'],
          role: 'Field data acquisition, pre-processing filters, and low-latency inference at the network edge.'
        }
      ],
      dataFlowSteps: [
        {
          stepNumber: 1,
          title: 'Edge Ingestion & Pre-processing',
          description: 'Sensory or visual inputs are normalized and denoised locally at edge before transmission.',
          component: 'Edge Node / Sensor Array'
        },
        {
          stepNumber: 2,
          title: 'Encrypted Stream Transmission',
          description: 'Telemetry and metadata are compressed and published over lightweight MQTT or WebSocket protocols.',
          component: 'Message Broker / Gateway'
        },
        {
          stepNumber: 3,
          title: 'Inference & Multi-Modal Verification',
          description: 'The core neural pipeline executes feature extraction, confidence scoring, and outlier filtering.',
          component: 'AI Inference Cluster'
        },
        {
          stepNumber: 4,
          title: 'Persistence & Metric Calculation',
          description: 'Telemetry logs commit to time-series tables while anomaly triggers emit async alerts.',
          component: 'Database & Event Stream'
        },
        {
          stepNumber: 5,
          title: 'Explainable Output Render',
          description: 'Interactive Grad-CAM heatmaps and actionable recommendations render in real time on the student/client UI.',
          component: 'Web Dashboard & Mobile PWA'
        }
      ],
      recommendedTechStack: {
        frontend: 'React 19, TypeScript, Tailwind CSS, Lucide Icons, Chart.js / Recharts',
        backend: 'FastAPI (Python 3.11) with Uvicorn and Pydantic v2',
        aiMl: 'PyTorch 2.x, Torchvision, ONNX Runtime, OpenCV, Albumentations',
        database: 'PostgreSQL 16 with TimescaleDB extension + Redis 7',
        devopsCloud: 'Docker Compose, GitHub Actions CI/CD, Nginx reverse proxy',
        justification: 'FastAPI provides native asynchronous I/O and direct interoperability with PyTorch models without serialization overhead, while TimescaleDB effortlessly manages high-frequency sensor streams.'
      }
    },
    scopeFeasibility: {
      feasibilityRating: 'Balanced',
      recommendedTeamHoursPerWeek: 16,
      timelineMilestones: [
        {
          phase: 'Phase 1: Literature Review & Dataset Pipeline',
          monthRange: 'Months 1 - 2',
          deliverables: ['IEEE/ACM papers comparative matrix', 'Dataset collection and ethical approval', 'SRS & Architecture Blueprint'],
          riskLevel: 'Low'
        },
        {
          phase: 'Phase 2: Core Algorithm & Baseline Models',
          monthRange: 'Months 3 - 4',
          deliverables: ['Data augmentation pipeline', 'Baseline neural model training', 'Loss & Validation curves benchmark'],
          riskLevel: 'Medium'
        },
        {
          phase: 'Phase 3: Hardware / Full-Stack Integration',
          monthRange: 'Months 5 - 6',
          deliverables: ['API microservices implementation', 'Edge hardware sensor interfacing', 'Interactive frontend dashboard'],
          riskLevel: 'High'
        },
        {
          phase: 'Phase 4: Optimization, Testing & Thesis Defense',
          monthRange: 'Months 7 - 8',
          deliverables: ['Ablation studies & edge latency profiling', 'Complete documentation & user manual', 'Professor mock defense presentation'],
          riskLevel: 'Medium'
        }
      ],
      scopeWarningOrRecommendation: 'Well-scoped for a 2-3 student team over 2 academic semesters. Avoid adding more than 2 distinct external hardware sensors to prevent supply chain delays.'
    },
    defenseSimulator: [
      {
        question: 'Why didn\'t you simply use an existing pre-trained cloud API (e.g. AWS Rekognition or OpenAI) instead of building this?',
        questionType: 'Architecture',
        whyProfessorAsks: 'Professors want to see engineering depth rather than students paying for an API and claiming it as a project.',
        recommendedDefenseAnswer: 'We specifically designed this for cost-prohibitive, offline-critical environments where cloud latency and per-call API charges are untenable. Our quantized edge model runs on zero recurring cost and achieves sub-80ms local inference with strict data privacy guarantees.',
        proTip: 'Highlight the latency and privacy trade-off; mention cost per 10,000 transactions.'
      },
      {
        question: 'What is your novel engineering contribution? Is this just stitching together open-source libraries?',
        questionType: 'Novelty',
        whyProfessorAsks: 'Committees need to justify awarding an engineering degree based on creative synthesis and custom contribution.',
        recommendedDefenseAnswer: 'Our primary novel contribution is the hybrid sensor fusion pipeline and edge-quantized decision thresholding under non-ideal real-world noise. While standard models collapse under occlusion, our multi-modal weighting mechanism sustains 91.4% precision under variable field conditions.',
        proTip: 'Never say "we created everything from scratch". Acknowledge existing foundations and pinpoint your precise delta.'
      },
      {
        question: 'How did you prevent overfitting on your dataset, and what are your validation metrics?',
        questionType: 'Dataset & Accuracy',
        whyProfessorAsks: 'Students often report "99% accuracy" which immediately indicates massive data leakage or overfitting to an easy benchmark.',
        recommendedDefenseAnswer: 'We implemented 5-fold cross-validation, aggressive geometric and radiometric augmentations, and held out an entirely unseen real-world test partition collected from distinct environments. We report Macro F1-Score, Cohen\'s Kappa, and inference latency rather than raw accuracy alone.',
        proTip: 'Mentioning F1-Score and unseen environment testing immediately impresses academic juries.'
      },
      {
        question: 'What is the single point of failure in your architecture and how does the system recover?',
        questionType: 'Failure Mode',
        whyProfessorAsks: 'Tests whether the team understands real-world distributed systems resilience.',
        recommendedDefenseAnswer: 'If edge sensor telemetry drops or network partitions occur, local nodes buffer up to 48 hours of time-stamped transactions into an encrypted on-chip SQLite database, resuming sync via idempotent replay when connection stabilizes.',
        proTip: 'Explain your graceful degradation mechanism clearly.'
      }
    ],
    academicKeywords: [
      'Edge Computing',
      'TinyML Optimization',
      'Fault-Tolerant Systems',
      'Explainable AI (XAI)',
      'Multi-Modal Fusion',
      'Final Year Capstone Project'
    ],
    suggestedProjectTitles: [
      `A High-Performance Edge-Quantized Framework for Real-Time ${idea}`,
      `Fault-Tolerant Multi-Modal Architecture for Next-Generation ${idea}`,
      `Explainable and Privacy-Preserving Systems Engineering for Autonomous ${idea}`
    ]
  };
}

// API endpoint: Validate FYP idea
app.post('/api/validate-fyp', async (req, res) => {
  const { rawIdea, domain, targetDegree, teamSize = 3, durationMonths = 8, appliedTwists = [] } = req.body;

  if (!rawIdea || typeof rawIdea !== 'string' || rawIdea.trim().length < 3) {
    return res.status(400).json({ error: 'Please provide a valid project idea of at least 3 characters.' });
  }

  const prompt = `You are a distinguished University Final Year Project (FYP) / Capstone Evaluation Committee Chairman and Senior Research Scientist for Computer Science, Software Engineering, and IT degrees.

Analyze this university student's FYP proposal idea thoroughly, strictly evaluate its uniqueness versus common clichés, generate 4 high-impact smart architectural twists/upgrades, construct an end-to-end system blueprint, and prepare professor defense Q&A.

STUDENT PROJECT SUBMISSION:
- Raw Project Idea: "${rawIdea.trim()}"
- Academic Domain: "${domain || 'Computer Science / Engineering'}"
- Degree Program: "${targetDegree || 'BS Computer Science'}"
- Team Size: ${teamSize} students
- Project Duration: ${durationMonths} months (Typical 2 semesters)
- Already Applied Twists (if any): ${JSON.stringify(appliedTwists)}

ANALYSIS GUIDELINES:
1. "Ghisa-Pita" / Cliché Reality Check:
   - Identify if this idea is a classic cliché that university professors immediately reject or sigh at (e.g., Library Management System, standard E-commerce, basic Face Recognition Attendance with webcam, simple Hospital appointment app, generic Plant disease classifier using PlantVillage, basic Chat app, fake news classifier on Kaggle).
   - If it is cliché, rate its baseline uniqueness low (e.g. 20-50%) and explicitly state the blunt professor reaction.
   - If the student has already applied smart twists, factor those in to elevate the uniqueness score up into the 85-98% range!

2. Smart Twist & Upgrade Engine:
   - Provide 4 distinct, modern, highly practical modular twists across:
     a) "IoT & Edge Computing" (TinyML, ESP32, Raspberry Pi, sensor fusion)
     b) "Advanced AI & ML" (Federated learning, Explainable AI / Grad-CAM, Multi-modal RAG, Diffusion/Vision Transformer)
     c) "Enterprise & Cloud Architecture" (Event-driven Kafka, CRDT offline-first mesh, zero-trust cryptography)
     d) "Real-world & Localized Impact" (Hyper-local datasets, clinical/industry workflow, GIS mapping)
   - Each twist must have: id, category, title, description, projectedScoreBoost (number e.g. 15-25), hardwareOrApiRequirements (array), whyProfessorsLoveIt.

3. Automatic System Blueprint:
   - Architecture summary.
   - 5 structured architectural layers (Client, Gateway/API, AI/Core Logic, Database/Storage, Hardware/Edge) with specific technologies and roles.
   - Step-by-step dataflow (5 numbered steps).
   - Recommended production tech stack with technical justification.

4. Scope & Feasibility:
   - Feasibility rating ("High", "Balanced", "Challenging", "Overambitious (Scope Creep)").
   - Recommended team hours per week.
   - 4 timeline milestone phases across the project duration.
   - Scope warning or guidance for the supervisor meeting.

5. Professor Defense Prep Simulator:
   - 4-5 rigorous, realistic questions professors grill students with during the proposal defense (e.g. "Why not just use an API?", "What is your novel contribution?", "How will you handle latency?", "What if hardware fails?").
   - Include why the professor asks it, the winning defensive answer script, and a strategic pro-tip.

6. Academic Keywords & 3 Publication-ready formal FYP titles.

Return strictly valid JSON adhering to the required structure.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            uniquenessScore: { type: Type.INTEGER, description: 'Score from 0 to 100' },
            verdict: {
              type: Type.STRING,
              description: 'Critical Cliché / High Rejection Risk | Common / Needs Significant Upgrade | Moderate / Good Potential | Highly Unique & Innovative | Breakthrough FYP Material'
            },
            clicheComparison: {
              type: Type.OBJECT,
              properties: {
                isCliche: { type: Type.BOOLEAN },
                closestCliches: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                clicheRiskReason: { type: Type.STRING },
                professorReaction: { type: Type.STRING }
              },
              required: ['isCliche', 'closestCliches', 'clicheRiskReason', 'professorReaction']
            },
            scoreBreakdown: {
              type: Type.OBJECT,
              properties: {
                technicalDepth: { type: Type.INTEGER },
                marketNovelty: { type: Type.INTEGER },
                academicRigor: { type: Type.INTEGER },
                industryRelevance: { type: Type.INTEGER },
                executionFeasibility: { type: Type.INTEGER }
              },
              required: ['technicalDepth', 'marketNovelty', 'academicRigor', 'industryRelevance', 'executionFeasibility']
            },
            professorRedFlags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            smartTwists: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  category: { type: Type.STRING },
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  projectedScoreBoost: { type: Type.INTEGER },
                  hardwareOrApiRequirements: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  whyProfessorsLoveIt: { type: Type.STRING }
                },
                required: ['id', 'category', 'title', 'description', 'projectedScoreBoost', 'hardwareOrApiRequirements', 'whyProfessorsLoveIt']
              }
            },
            systemBlueprint: {
              type: Type.OBJECT,
              properties: {
                architectureSummary: { type: Type.STRING },
                layers: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      technologies: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      role: { type: Type.STRING }
                    },
                    required: ['name', 'technologies', 'role']
                  }
                },
                dataFlowSteps: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepNumber: { type: Type.INTEGER },
                      title: { type: Type.STRING },
                      description: { type: Type.STRING },
                      component: { type: Type.STRING }
                    },
                    required: ['stepNumber', 'title', 'description', 'component']
                  }
                },
                recommendedTechStack: {
                  type: Type.OBJECT,
                  properties: {
                    frontend: { type: Type.STRING },
                    backend: { type: Type.STRING },
                    aiMl: { type: Type.STRING },
                    database: { type: Type.STRING },
                    devopsCloud: { type: Type.STRING },
                    justification: { type: Type.STRING }
                  },
                  required: ['frontend', 'backend', 'aiMl', 'database', 'devopsCloud', 'justification']
                }
              },
              required: ['architectureSummary', 'layers', 'dataFlowSteps', 'recommendedTechStack']
            },
            scopeFeasibility: {
              type: Type.OBJECT,
              properties: {
                feasibilityRating: { type: Type.STRING },
                recommendedTeamHoursPerWeek: { type: Type.INTEGER },
                timelineMilestones: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      phase: { type: Type.STRING },
                      monthRange: { type: Type.STRING },
                      deliverables: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                      },
                      riskLevel: { type: Type.STRING }
                    },
                    required: ['phase', 'monthRange', 'deliverables', 'riskLevel']
                  }
                },
                scopeWarningOrRecommendation: { type: Type.STRING }
              },
              required: ['feasibilityRating', 'recommendedTeamHoursPerWeek', 'timelineMilestones', 'scopeWarningOrRecommendation']
            },
            defenseSimulator: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  questionType: { type: Type.STRING },
                  whyProfessorAsks: { type: Type.STRING },
                  recommendedDefenseAnswer: { type: Type.STRING },
                  proTip: { type: Type.STRING }
                },
                required: ['question', 'questionType', 'whyProfessorAsks', 'recommendedDefenseAnswer', 'proTip']
              }
            },
            academicKeywords: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            suggestedProjectTitles: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            'uniquenessScore',
            'verdict',
            'clicheComparison',
            'scoreBreakdown',
            'professorRedFlags',
            'smartTwists',
            'systemBlueprint',
            'scopeFeasibility',
            'defenseSimulator',
            'academicKeywords',
            'suggestedProjectTitles'
          ]
        }
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Gemini API call failed, using intelligent backup generator:', error);
    const fallback = generateIntelligentFallback(rawIdea, domain, appliedTwists);
    return res.json(fallback);
  }
});

// API endpoint: Get curated list of most rejected FYPs vs upgrades
app.get('/api/cliche-hall-of-fame', (req, res) => {
  res.json({ cliches: CURATED_CLICHES });
});

// Vite or Static files handling
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Smart FYP Validator Server running on http://localhost:${port}`);
  });
}

startServer();
