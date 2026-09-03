const tutor = document.getElementById("tutor");
const chat = document.getElementById("chat");

function openTutor() {
  tutor.style.display = "flex";
  tutor.setAttribute("aria-hidden", "false");
  document.getElementById("question").focus();
}

function closeTutor() {
  tutor.style.display = "none";
  tutor.setAttribute("aria-hidden", "true");
}

async function askTutor() {
  const input = document.getElementById("question");
  const question = input.value.trim();

  if (!question) return;

  chat.insertAdjacentHTML(
    "beforeend",
    `<div class="msg user">${escapeHtml(question)}</div>`
  );

  input.value = "";

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
        message: question
      })
    });

    const data = await response.json();

    const messages = chat.querySelectorAll(".msg.bot");
    const thinkingMessage = messages[messages.length - 1];

    if (data.reply) {
      thinkingMessage.textContent = data.reply;
    } else {
      thinkingMessage.textContent =
        "Sorry, I could not answer right now.";
    }

    // Show WhatsApp admission button when student wants to join
    const q = question.toLowerCase();

    if (
      q.includes("admission") ||
      q.includes("join") ||
      q.includes("enroll") ||
      q.includes("admission lena") ||
      q.includes("join karna")
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
    console.error("AI Tutor Error:", error);

    const messages = chat.querySelectorAll(".msg.bot");
    const thinkingMessage = messages[messages.length - 1];

    thinkingMessage.textContent =
      "⚠️ AI Tutor se connection nahi ho pa raha. Please try again.";
  }

  chat.scrollTop = chat.scrollHeight;
}

function openAdmissionWhatsApp() {
  const message =
    "Hello Su-Srujan Computer Education,%0A%0A" +
    "I want to enquire about admission.%0A" +
    "Please provide course details, fees and admission information.";

  window.open(
    "https://wa.me/918527426527?text=" + message,
    "_blank"
  );
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, function (character) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[character];
  });
}

function sendWhatsApp(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const course = document.getElementById("course").value;
  const message = document.getElementById("message").value;

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
function applyForCourse(courseName) {
  const message =
    "Hello Su-Srujan Computer Education,\n\n" +
    "I am interested in joining: " + courseName + "\n" +
    "Please provide admission details, fees and batch timings.";

  window.open(
    "https://wa.me/918527426527?text=" +
      encodeURIComponent(message),
    "_blank"
  );
}