const tutor = document.getElementById("tutor");
const chat = document.getElementById("chat");

function updateTutorUserName() {
  const welcomeName = document.getElementById("tutor-user-name");
  const displayName = document.getElementById("tutor-user-name-display");
  const emailText = document.getElementById("tutor-user-email-text");
  const userCard = document.querySelector(".tutor-user-card");
  if (!welcomeName && !displayName && !emailText) return;

  const savedUser = localStorage.getItem("tutorUser");
  let tutorUser = null;

  if (savedUser) {
    try {
      tutorUser = JSON.parse(savedUser);
    } catch (error) {
      tutorUser = null;
    }
  }

  const name = tutorUser?.name || "Student";
  const email = tutorUser?.email || "";

  if (welcomeName) welcomeName.textContent = name;
  if (displayName) displayName.textContent = name;
  if (emailText) emailText.textContent = email;
  if (userCard) userCard.style.display = tutorUser ? "block" : "none";
}

function openTutor() {
  tutor.style.display = "flex";
  tutor.setAttribute("aria-hidden", "false");
  updateTutorUserName();

  const savedUser = localStorage.getItem("tutorUser");

  if (savedUser) {
    document.getElementById("question").focus();
  }
}

function closeTutor() {
  tutor.style.display = "none";
  tutor.setAttribute("aria-hidden", "true");
}


// ===============================
// AI TUTOR CHAT
// ===============================

async function askTutor() {
  const input = document.getElementById("question");
  const question = input.value.trim();

  if (!question) return;

  // Get saved student details
  const savedUser = localStorage.getItem("tutorUser");
  let tutorUser = null;

  if (savedUser) {
    try {
      tutorUser = JSON.parse(savedUser);
    } catch (error) {
      localStorage.removeItem("tutorUser");
    }
  }

  // Show student's question
  chat.insertAdjacentHTML(
    "beforeend",
    `<div class="msg user">${escapeHtml(question)}</div>`
  );

  input.value = "";

  // Show thinking message
  chat.insertAdjacentHTML(
    "beforeend",
    `<div class="msg bot">🤔 Thinking...</div>`
  );

  chat.scrollTop = chat.scrollHeight;

  try {

    const response = await fetch("/api/chat", {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        message: question,

        name: tutorUser?.name || null,

        phone: tutorUser?.phone || null,

        email: tutorUser?.email || null
      })
    });


    const data = await response.json();

    const messages =
      chat.querySelectorAll(".msg.bot");

    const thinkingMessage =
      messages[messages.length - 1];


    if (data.reply) {

      thinkingMessage.textContent =
        data.reply;

    } else {

      thinkingMessage.textContent =
        "Sorry, I could not answer right now.";

    }


    // ---------------------------------
    // Show optional contact form
    // ---------------------------------

    const q =
      question.toLowerCase();


    const interested =
      q.includes("admission") ||
      q.includes("join") ||
      q.includes("enroll") ||
      q.includes("fee") ||
      q.includes("fees") ||
      q.includes("course") ||
      q.includes("course lena") ||
      q.includes("course karna") ||
      q.includes("join karna") ||
      q.includes("admission lena") ||
      q.includes("admission nebaku") ||
      q.includes("admission nebi") ||
      q.includes("admission naba") ||
      q.includes("course re padhibi");


    // Only show form if details are not already saved
    if (interested && !tutorUser) {

      const contactForm =
        document.getElementById(
          "tutorContactForm"
        );

      if (contactForm) {

        contactForm.style.display =
          "block";

        contactForm.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });

      }

    }


  } catch (error) {

    console.error(
      "AI Tutor Error:",
      error
    );


    const messages =
      chat.querySelectorAll(".msg.bot");

    const thinkingMessage =
      messages[messages.length - 1];


    thinkingMessage.textContent =
      "⚠️ AI Tutor se connection nahi ho pa raha. Please try again.";

  }


  chat.scrollTop =
    chat.scrollHeight;
}


// =================================
// SAVE TUTOR DETAILS
// =================================

async function saveTutorDetails() {

  const name =
    document.getElementById("tutorName")
      .value.trim();

  const phone =
    document.getElementById("tutorPhone")
      .value.trim();

  const email =
    document.getElementById("tutorEmail")
      .value.trim();


  // Name and phone are required only
  // when student chooses Continue

  if (!name) {

    alert("Please enter your name.");

    return;
  }


  if (!phone) {

    alert("Please enter your phone number.");

    return;
  }


  const tutorUser = {
    name: name,
    phone: phone,
    email: email
  };


  // Save in browser
  localStorage.setItem(
    "tutorUser",
    JSON.stringify(tutorUser)
  );


  // Hide contact form
  hideTutorContactForm();


  // Send details to backend
  try {

    await fetch("/api/chat", {

      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({

        message:
          "Student shared contact details.",

        name: name,

        phone: phone,

        email: email

      })

    });

  } catch (error) {

    console.error(
      "Could not save tutor details:",
      error
    );

  }


  // Focus chat box
  document
    .getElementById("question")
    .focus();
}


// =================================
// MAYBE LATER
// =================================

function hideTutorContactForm() {

  const contactForm =
    document.getElementById(
      "tutorContactForm"
    );


  if (contactForm) {

    contactForm.style.display =
      "none";

  }


  document
    .getElementById("question")
    .focus();
}



// ===============================
// WHATSAPP ADMISSION
// ===============================

function openAdmissionWhatsApp() {

  const message =
    "Hello Su-Srujan Computer Education,%0A%0A" +
    "I want to enquire about admission.%0A" +
    "Please provide course details, fees and admission information.";

  window.open(
    "https://wa.me/918527426527?text=" +
    message,
    "_blank"
  );
}



// ===============================
// SECURITY
// ===============================

function escapeHtml(text) {

  return text.replace(
    /[&<>"']/g,
    function (character) {

      return {

        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"

      }[character];

    }
  );
}



// ===============================
// ADMISSION FORM → WHATSAPP
// ===============================

async function sendWhatsApp(event) {

  event.preventDefault();


  const name =
    document.getElementById("name").value;

  const phone =
    document.getElementById("phone").value;
  
  const email =
  document.getElementById("email").value;

  const course =
    document.getElementById("course").value;

  const message =
    document.getElementById("message").value;

  await fetch("/api/enquiries", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    name: name,
    phone: phone,
    email: email,
    course: course,
    message: message
  })
});

  const text =
    `Admission Enquiry - Su-Srujan Computer Education\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
   `Course: ${course}\n` +
`Email: ${email}\n` +
`Message: ${message}`;


  window.open(
    "https://wa.me/918527426527?text=" +
    encodeURIComponent(text),
    "_blank"
  );
}



// ===============================
// COURSE APPLICATION
// ===============================

function applyForCourse(courseName) {

  const message =
    "Hello Su-Srujan Computer Education,\n\n" +
    "I am interested in joining: " +
    courseName +
    "\n" +
    "Please provide admission details, fees and batch timings.";


  window.open(
    "https://wa.me/918527426527?text=" +
    encodeURIComponent(message),
    "_blank"
  );
}



// ===============================
// LATEST YOUTUBE VIDEOS
// ===============================

async function loadLatestYouTubeVideos() {

  try {

    const response =
      await fetch("/api/youtube-videos");

    const data =
      await response.json();


    if (
      !data.videos ||
      data.videos.length === 0
    ) {

      const youtubeVideoBox =
        document.querySelector(".youtube-video");

      if (youtubeVideoBox) {
        youtubeVideoBox.innerHTML = `
          <div class="youtube-video-empty">
            <div class="youtube-empty-icon">▶</div>
            <h3>Latest video is temporarily unavailable</h3>
            <p>Please visit our YouTube channel to watch the latest videos.</p>
            <a href="https://www.youtube.com/@SuSrujanMuraripur" target="_blank" class="youtube-watch-btn">
              ▶ Open YouTube Channel
            </a>
          </div>
        `;
      }

      console.log("No YouTube videos found.", data.error || "");
      return;
    }


    const youtubeVideoBox =
      document.querySelector(".youtube-video");


    if (!youtubeVideoBox) {

      console.log(
        "YouTube video container not found."
      );

      return;
    }


    youtubeVideoBox.innerHTML = "";


    // Show maximum 3 latest videos

    data.videos
      .slice(0, 3)
      .forEach(video => {

        const videoBox =
          document.createElement("div");


        videoBox.className =
          "youtube-latest-video";


        const uploadDate =
          video.publishedAt
            ? new Date(
                video.publishedAt
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                }
              )
            : "";


        videoBox.innerHTML = `

          <div class="youtube-iframe-wrapper">

            <iframe
              src="https://www.youtube.com/embed/${video.videoId}"
              title="${escapeHtml(video.title)}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen>
            </iframe>

          </div>


          <div class="youtube-video-info">

            <h3>
              ${escapeHtml(video.title)}
            </h3>


            <p class="youtube-date">
              📅 ${uploadDate}
            </p>


            <a
              href="https://www.youtube.com/watch?v=${video.videoId}"
              target="_blank"
              class="youtube-watch-btn">

              ▶ Watch on YouTube

            </a>

          </div>

        `;


        youtubeVideoBox.appendChild(
          videoBox
        );

      });


  } catch (error) {

    console.error(
      "Could not load YouTube videos:",
      error
    );

  }
}



// ===============================
// LOAD YOUTUBE WHEN WEBSITE OPENS
// ===============================

document.addEventListener(
  "DOMContentLoaded",
  loadLatestYouTubeVideos
);

// =================================
// GOOGLE SIGN-IN
// =================================

async function handleGoogleLogin(response) {
  try {
    const result = await fetch("/api/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential: response.credential })
    });

    const data = await result.json();

    if (!result.ok || !data.success) {
      alert(data.message || "Google login failed. Please try again.");
      return;
    }

    localStorage.setItem("tutorUser", JSON.stringify({
      name: data.name,
      email: data.email,
      googleId: data.googleId
    }));

    updateTutorUserName();

    // Close any Google Sign-In prompt/chooser that may still be visible.
    try {
      if (window.google?.accounts?.id) {
        google.accounts.id.cancel();
        google.accounts.id.disableAutoSelect();
      }
    } catch (googleUiError) {
      console.warn("Could not close Google Sign-In UI:", googleUiError);
    }

    const overlay = document.getElementById("welcome-login-overlay");
    if (overlay) {
      overlay.style.display = "none";
      overlay.setAttribute("aria-hidden", "true");
    }

    const contactForm = document.getElementById("tutorContactForm");
    if (contactForm) contactForm.style.display = "none";

  } catch (error) {
    console.error("Google Login Error:", error);
    alert("Unable to connect to Google login.");
  }
}

function closeWelcomeLogin() {
  // Google login is mandatory for now. The overlay can only be closed
  // after a successful Google sign-in.
  const overlay = document.getElementById("welcome-login-overlay");
  if (overlay && localStorage.getItem("tutorUser")) {
    overlay.style.display = "none";
  } else if (overlay) {
    overlay.style.display = "flex";
  }
}


window.addEventListener("load", function () {
  const savedUser = localStorage.getItem("tutorUser");
  if (savedUser) {
    updateTutorUserName();
    const overlay = document.getElementById("welcome-login-overlay");
    if (overlay) {
      overlay.style.display = "none";
      overlay.setAttribute("aria-hidden", "true");
    }
    return;
  }

  const overlay = document.getElementById("welcome-login-overlay");
  if (overlay) {
    overlay.style.display = "flex";
    overlay.setAttribute("aria-hidden", "false");
  }

  if (typeof google === "undefined") {
    console.error("Google Sign-In library could not load.");
    return;
  }

  const clientId = "696618585785-o5tdrmqeejl0m3dueulierlc21l48p2e.apps.googleusercontent.com";

  google.accounts.id.initialize({
    client_id: clientId,
    callback: handleGoogleLogin
  });

  const button = document.getElementById("welcomeGoogleSignInButton");
  if (button) {
    google.accounts.id.renderButton(button, {
      theme: "outline",
      size: "large",
      text: "continue_with",
      shape: "pill",
      width: 400
    });
  }
});

