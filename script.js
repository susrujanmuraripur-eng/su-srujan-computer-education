const tutor = document.getElementById("tutor");
const chat = document.getElementById("chat");

function openTutor() {
  tutor.style.display = "flex";
  tutor.setAttribute("aria-hidden", "false");

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

  // Check if student details are already saved
  let tutorUser = JSON.parse(localStorage.getItem("tutorUser"));

  // If details are not saved, ask for them
  if (!tutorUser) {

    const name = prompt("Please enter your Name:");

    if (!name) return;

    const phone = prompt("Please enter your Phone Number:");

    if (!phone) return;

    const email = prompt("Please enter your Email:");

    if (!email) return;

    tutorUser = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim()
    };

    // Save details in browser
    localStorage.setItem(
      "tutorUser",
      JSON.stringify(tutorUser)
    );
  }

  const input = document.getElementById("question");
  const question = input.value.trim();

  if (!question) return;


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

        name: tutorUser.name,

        phone: tutorUser.phone,

        email: tutorUser.email

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


    // ===============================
    // WHATSAPP ADMISSION BUTTON
    // ===============================

    const q = question.toLowerCase();


    if (
      q.includes("admission") ||
      q.includes("join") ||
      q.includes("enroll") ||
      q.includes("admission lena") ||
      q.includes("join karna") ||
      q.includes("join kariba") ||
      q.includes("join karibi") ||
      q.includes("join karibaku") ||
      q.includes("admission nebaku") ||
      q.includes("admission nebi") ||
      q.includes("admission naba") ||
      q.includes("course re padhibi") ||
      q.includes("course re padh")
    ) {

      chat.insertAdjacentHTML(
        "beforeend",
        `
        <div class="msg bot">

          <button
            onclick="openAdmissionWhatsApp()"
            style="
              background:#25D366;
              color:white;
              border:0;
              padding:12px 16px;
              border-radius:10px;
              font-weight:bold;
              cursor:pointer;
              width:100%;
            "
          >
            📲 WhatsApp Admission Enquiry
          </button>

        </div>
        `
      );
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


    if (thinkingMessage) {

      thinkingMessage.textContent =
        "⚠️ AI Tutor se connection nahi ho pa raha. Please try again.";

    }
  }


  chat.scrollTop =
    chat.scrollHeight;
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

function sendWhatsApp(event) {

  event.preventDefault();


  const name =
    document.getElementById("name").value;

  const phone =
    document.getElementById("phone").value;

  const course =
    document.getElementById("course").value;

  const message =
    document.getElementById("message").value;


  const text =
    `Admission Enquiry - Su-Srujan Computer Education\n` +
    `Name: ${name}\n` +
    `Phone: ${phone}\n` +
    `Course: ${course}\n` +
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

      console.log(
        "No YouTube videos found."
      );

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
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
