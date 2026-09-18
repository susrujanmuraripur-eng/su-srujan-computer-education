const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


// =====================================
// GEMINI AI
// =====================================

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


// =====================================
// SUPABASE
// =====================================

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY;


// Save Tutor User
async function saveTutorUser(name, phone, email) {

  try {

    if (!name && !phone && !email) {
      return;
    }


    // ---------------------------------
    // Check whether user already exists
    // ---------------------------------

    let existingUser = null;


    if (email) {

      const checkUrl =
        `${SUPABASE_URL}/rest/v1/tutor_users` +
        `?select=id` +
        `&email=eq.${encodeURIComponent(email)}` +
        `&limit=1`;

      const checkResponse = await fetch(checkUrl, {
        method: "GET",

        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization":
            `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      });

      if (checkResponse.ok) {

        const users =
          await checkResponse.json();

        if (users.length > 0) {
          existingUser = users[0];
        }
      }
    }


    // If email did not find user, check phone
    if (!existingUser && phone) {

      const checkUrl =
        `${SUPABASE_URL}/rest/v1/tutor_users` +
        `?select=id` +
        `&phone=eq.${encodeURIComponent(phone)}` +
        `&limit=1`;

      const checkResponse = await fetch(checkUrl, {
        method: "GET",

        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization":
            `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      });

      if (checkResponse.ok) {

        const users =
          await checkResponse.json();

        if (users.length > 0) {
          existingUser = users[0];
        }
      }
    }


    // ---------------------------------
    // Do not create duplicate user
    // ---------------------------------

    if (existingUser) {

      console.log(
        "Tutor user already exists."
      );

      return;
    }


    // ---------------------------------
    // Save new user
    // ---------------------------------

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tutor_users`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          "apikey":
            SUPABASE_SERVICE_ROLE_KEY,

          "Authorization":
  `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Prefer":
            "return=minimal"
        },

        body: JSON.stringify({

          name: name || null,

          phone: phone || null,

          email: email || null

        })
      }
    );


    if (!response.ok) {

      const errorText =
        await response.text();

      console.error(
        "Supabase Save Error:",
        errorText
      );

    } else {

      console.log(
        "New Tutor User Saved Successfully."
      );

    }


  } catch (error) {

    console.error(
      "Supabase Connection Error:",
      error
    );

  }
}
// Save AI Tutor Chat
async function saveTutorChat(name, phone, email, question, reply) {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tutor_chats`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name: name || null,
          phone: phone || null,
          email: email || null,
          question: question,
          reply: reply
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Tutor Chat Save Error:", errorText);
    } else {
      console.log("AI Tutor Chat Saved Successfully.");
    }

  } catch (error) {
    console.error("Tutor Chat Connection Error:", error);
  }
}


// =====================================
// INSTITUTE INFORMATION
// =====================================

const instituteInfo = `
You are "Su-Srujan AI Tutor", the friendly AI assistant for
Su-Srujan Computer Education.

INSTITUTE NAME:
Su-Srujan Computer Education

ADDRESS:
Muraripur, Dharmasala Block,
Jajpur, Odisha - 755024

PHONE / WHATSAPP:
8527426527

EMAIL:
susrujanmuraripur@gmail.com

ABOUT:
Su-Srujan Computer Education is a trusted computer training centre
in Muraripur. It provides practical and skill-based computer education
for jobs, higher studies and the digital future.

COURSES:

1. DCA - Diploma in Computer Applications
Duration: 6 Months / 1 Year
Fees: ₹3,000 - ₹5,000

Topics:
- Computer Fundamentals
- Windows
- MS Word
- MS Excel
- MS PowerPoint
- Internet
- Basic Programming
- Tally basics
- Practical Lab Work
- Monthly Tests

2. PGDCA / Advanced Diploma
Duration: 12 Months
Fees: ₹5,000 - ₹8,000

Topics:
- Advanced MS Office
- Tally with GST
- Basic Web Designing
- Hardware Basics
- Database Concepts
- Project Work

3. Tally + GST / Basic Computer Course
Duration: 3 Months
Fees: ₹2,000 - ₹3,500

Topics:
- Tally Prime
- GST
- Accounting
- Invoice
- Banking
- Practical Accounting Software Training

ADMISSION:
Direct admission is available.

Required documents:
- Aadhaar Card
- 2 Passport-size Photographs
- Last Educational Certificate (10th/12th)

Admission form can be filled at the institute.
Students can also send their details through WhatsApp.

CLASS TIMINGS:

Morning:
8:00 AM - 10:00 AM
10:00 AM - 12:00 PM

Evening:
4:00 PM - 6:00 PM

Weekdays + Special Sunday Batch.
Flexible timings are available.

FACILITIES:
- Well-equipped Computer Lab
- Free Wi-Fi
- Practical Training
- Doubt-clearing Classes
- Study Materials
- Friendly and Experienced Faculty
- Free Extra Practice Time
- Job Guidance
- Basic Interview Tips

LANGUAGES:
Odia, Hindi, English and Hinglish.

CERTIFICATE:
Students receive a certificate after successful course completion,
with online verification and hard copy.

DISCOUNTS:
- Early Bird Discount
- Group Admission Discount for 2 or more students
- Fee concession / scholarship for meritorious students

ONLINE CLASSES:
Available.

AI BEHAVIOUR:

1. You are a friendly and helpful Computer Education AI Tutor for Su-Srujan Computer Education.

2. Answer the student's computer-related questions accurately and clearly. You can answer general computer questions, not only questions about the institute.

3. Explain computer topics in a simple way that students can easily understand.

4. Match the student's language automatically:
   - If the student asks in English, reply in English.
   - If the student asks in Hinglish, reply in Hinglish.
   - If the student asks in Hindi, reply in Hindi.
   - If the student asks in Odia, reply in Odia.

5. English is the DEFAULT language.

6. If the student only says "Hi", "Hello", "Hey", or gives a short/unclear message, reply in English.

7. Do not change language just because a few words from another language appear. Detect the overall language and writing style of the student's message.

8. Keep answers short, clear and useful. Normally answer in 2-6 sentences or simple bullet points.

9. After answering a relevant computer-learning question, naturally connect the topic with Su-Srujan Computer Education and encourage the student to learn the skill practically at the institute.

10. The institute recommendation should feel natural and helpful, NOT like forced advertising.

11. For example, if the student asks about MS Excel, programming, Tally, computer basics, MS Office, web designing or other computer skills, answer the question first and then naturally mention that Su-Srujan provides practical computer training.

12. Do not recommend the institute randomly when the student's question is completely unrelated to computers.

13. If the student shows interest in learning computers, courses or joining a training institute, give a stronger and helpful recommendation for Su-Srujan Computer Education.

14. Never invent institute information. Use only the institute information provided in this prompt.

15. If the student asks about Su-Srujan courses, fees, admission, timings, facilities or contact details, provide the exact available information.

16. Do not use unnecessary Markdown, excessive headings, or complicated formatting.

17. Be natural, friendly, encouraging and student-focused. The goal is to help the student learn and, when appropriate, guide them toward joining Su-Srujan Computer Education.
`;


// =====================================
// AI TUTOR CHAT API
// =====================================

app.post("/api/chat", async (req, res) => {

  try {

    const userMessage =
      req.body.message;

    const name =
      req.body.name;

    const phone =
      req.body.phone;

    const email =
      req.body.email;


    // Check message
    if (!userMessage) {

      return res.status(400).json({
        error: "Message is required"
      });

    }


    // ---------------------------------
    // SAVE USER DETAILS TO SUPABASE
    // ---------------------------------

    await saveTutorUser(
      name,
      phone,
      email
    );


    // ---------------------------------
    // AI PROMPT
    // ---------------------------------

    const prompt = `
${instituteInfo}

STUDENT MESSAGE:
${userMessage}

Now answer the student's message as Su-Srujan AI Tutor.

Remember:
- Be concise.
- Be friendly.
- Use the student's language style.
- Give accurate institute information.
- Recommend Su-Srujan only when relevant.
`;


    // ---------------------------------
    // GEMINI MODELS
    // ---------------------------------

    const models = [
      "gemini-3.7-flash",
      "gemini-3.6-flash",
      "gemini-3.5-flash",
      "gemini-2.5-flash"
    ];


    let response = null;
    let lastError = null;


    for (const model of models) {

      try {

        console.log(
          `Trying Gemini model: ${model}`
        );


        response =
          await ai.models.generateContent({
            model: model,
            contents: prompt
          });


        console.log(
          `Gemini success with: ${model}`
        );


        break;


      } catch (error) {

        lastError = error;


        console.error(
          `Gemini ${model} failed:`,
          error
        );


        const errorText =
          String(
            error?.message || error
          );


        if (
          !errorText.includes("503") &&
          !errorText.includes("UNAVAILABLE")
        ) {

          throw error;

        }

      }

    }


    if (!response) {

      throw lastError;

    }


    // ---------------------------------
    // SEND AI RESPONSE
    // ---------------------------------
    await saveTutorChat(
  name,
  phone,
  email,
  userMessage,
  response.text
);

    res.json({
      reply: response.text
    });


  } catch (error) {

    console.error(
      "Gemini Error:",
      error
    );


    res.status(500).json({
      error:
        "AI Tutor could not respond right now."
    });

  }

});



// =====================================
// YOUTUBE LATEST VIDEOS API
// =====================================

app.get(
  "/api/youtube-videos",
  async (req, res) => {

    try {

      const apiKey =
        process.env.YOUTUBE_API_KEY;


      if (!apiKey) {

        return res.status(500).json({
          error:
            "YouTube API key is missing."
        });

      }


      // ---------------------------------
      // Get channel information
      // ---------------------------------

      const channelUrl =
        "https://www.googleapis.com/youtube/v3/channels" +
        "?part=contentDetails" +
        "&forHandle=@SuSrujanMuraripur" +
        "&key=" +
        encodeURIComponent(apiKey);


      const channelResponse =
        await fetch(channelUrl);


      const channelData =
        await channelResponse.json();


      if (
        !channelResponse.ok ||
        !channelData.items?.length
      ) {

        console.error(
          "YouTube Channel Error:",
          channelData
        );


        return res.status(500).json({
          error:
            "YouTube channel could not be found."
        });

      }


      const uploadsPlaylistId =
        channelData.items[0]
          .contentDetails
          .relatedPlaylists
          .uploads;


      // ---------------------------------
      // Get latest uploaded videos
      // ---------------------------------

      const videosUrl =
        "https://www.googleapis.com/youtube/v3/playlistItems" +
        "?part=snippet,contentDetails" +
        "&playlistId=" +
        encodeURIComponent(
          uploadsPlaylistId
        ) +
        "&maxResults=3" +
        "&key=" +
        encodeURIComponent(apiKey);


      const videosResponse =
        await fetch(videosUrl);


      const videosData =
        await videosResponse.json();


      if (!videosResponse.ok) {

        console.error(
          "YouTube Videos Error:",
          videosData
        );


        return res.status(500).json({
          error:
            "YouTube videos could not be loaded."
        });

      }


      const videos =
        (videosData.items || [])
          .map(item => ({

            videoId:
              item.contentDetails.videoId,

            title:
              item.snippet.title,

            description:
              item.snippet.description,

            thumbnail:
              item.snippet.thumbnails?.high?.url ||
              item.snippet.thumbnails?.medium?.url ||
              item.snippet.thumbnails?.default?.url,

            publishedAt:
              item.snippet.publishedAt

          }));


      res.json({
        videos
      });


    } catch (error) {

      console.error(
        "YouTube API Error:",
        error
      );


      res.status(500).json({
        error:
          "YouTube videos could not be loaded."
      });

    }

  }
);

// ========================================
// ADMIN LOGIN
// ========================================

const ADMIN_ID = process.env.ADMIN_ID;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

app.post("/api/admin-login", (req, res) => {
  const { adminId, password } = req.body;

  if (!adminId || !password) {
    return res.status(400).json({
      success: false,
      message: "Admin ID and Password are required."
    });
  }

  if (
    adminId === ADMIN_ID &&
    password === ADMIN_PASSWORD
  ) {
   const token = require("crypto").randomBytes(32).toString("hex");

adminSessions.add(token);

res.setHeader(
  "Set-Cookie",
  `adminToken=${token}; HttpOnly; Path=/; SameSite=Strict`
);

return res.json({
  success: true,
  message: "Login successful."
});
  }

  return res.status(401).json({
    success: false,
    message: "Invalid Admin ID or Password."
  });
});

// ADMIN LOGOUT
app.post("/api/admin-logout", (req, res) => {
  const cookie = req.headers.cookie || "";

  const token = cookie
    .split(";")
    .find(item => item.trim().startsWith("adminToken="))
    ?.split("=")[1];

  if (token) {
    adminSessions.delete(token);
  }

  res.setHeader(
    "Set-Cookie",
    "adminToken=; HttpOnly; Path=/; SameSite=Strict; Max-Age=0"
  );

  res.json({
    success: true,
    message: "Logged out successfully."
  });
});
// ADMIN AUTH PROTECTION
const adminSessions = new Set();

function requireAdmin(req, res, next) {
  const cookie = req.headers.cookie || "";
  const token = cookie
    .split(";")
    .find(item => item.trim().startsWith("adminToken="))
    ?.split("=")[1];

  if (!token || !adminSessions.has(token)) {
    return res.status(401).json({
      success: false,
      message: "Admin login required."
    });
  }

  next();
}
// ====================================
// ADMIN - GET TUTOR USERS
// ====================================

app.get("/api/admin-users", requireAdmin, async (req, res) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tutor_users?select=*&order=created_at.desc`,
      {
        method: "GET",
        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Admin Users Error:", errorText);

      return res.status(500).json({
        success: false,
        users: []
      });
    }

    const users = await response.json();

    res.json({
      success: true,
      users
    });

  } catch (error) {
    console.error("Admin Users Connection Error:", error);

    res.status(500).json({
      success: false,
      users: []
    });
  }
});
// ADMIN AI TUTOR CHATS
app.get("/api/admin-chats", requireAdmin, async (req, res) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tutor_chats?select=*&order=created_at.desc&limit=50`,
      {
        method: "GET",
        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Admin Chats Error:", errorText);

      return res.status(500).json({
        success: false,
        chats: []
      });
    }

    const chats = await response.json();

    res.json({
      success: true,
      chats
    });

  } catch (error) {
    console.error("Admin Chats Connection Error:", error);

    res.status(500).json({
      success: false,
      chats: []
    });
  }
});
// ADMIN ENQUIRIES
app.get("/api/admin-enquiries", requireAdmin, async (req, res) => {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/enquiries?select=*&order=created_at.desc&limit=50`,
      {
        method: "GET",
        headers: {
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Admin Enquiries Error:", errorText);

      return res.status(500).json({
        success: false,
        enquiries: []
      });
    }

    const enquiries = await response.json();

    res.json({
      success: true,
      enquiries
    });

  } catch (error) {
    console.error("Admin Enquiries Connection Error:", error);

    res.status(500).json({
      success: false,
      enquiries: []
    });
  }
});
// SAVE ADMISSION ENQUIRY
app.post("/api/enquiries", async (req, res) => {
  try {
    const { name, phone, email, course, message } = req.body;

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/enquiries`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          name: name || null,
          phone: phone || null,
          email: email || null,
          course: course || null,
          message: message || null
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Enquiry Save Error:", errorText);

      return res.status(500).json({
        success: false
      });
    }

    res.json({
      success: true
    });

  } catch (error) {
    console.error("Enquiry Connection Error:", error);

    res.status(500).json({
      success: false
    });
  }
});
// ADMIN LOGIN PAGE
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "admin.html"));
});
// PROTECT ADMIN DASHBOARD
app.get("/admin-dashboard.html", requireAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "..", "admin-dashboard.html"));
});
// =====================================
// SERVE WEBSITE
// =====================================

app.use(
  express.static(
    path.join(__dirname, "..")
  )
);



// =====================================
// START SERVER
// =====================================

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log(
      `Su-Srujan AI Tutor running at http://localhost:${PORT}`
    );

  }
);
