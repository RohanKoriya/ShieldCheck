// const API_BASE = "http://localhost:8080/api/password";
const API_BASE = "/api/password";
/* ── Helpers ──────────────────────────────────────────────── */

function showToast(iconClass, msg) {
  const toast = document.getElementById('toast');
  toast.querySelector('i').className = iconClass;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ── Toggle Password Visibility ── */
function togglePassword() {
  const input = document.getElementById("password");
  const icon = document.getElementById("toggleIcon");
  if (input.type === "password") {
    input.type = "text";
    icon.classList.replace("fa-eye-slash", "fa-eye");
  } else {
    input.type = "password";
    icon.classList.replace("fa-eye", "fa-eye-slash");
  }
}

/* ── Copy Password to Clipboard ── */
function copyPassword() {
  const pass = document.getElementById("password");
  if (!pass.value) return;

  navigator.clipboard.writeText(pass.value).then(() => {
    const copyIcon = document.getElementById('copyIcon');
    copyIcon.classList.replace('fa-copy', 'fa-check');
    copyIcon.style.color = '#3fb950';
    showToast('fa-solid fa-check', 'Copied to clipboard!');
    setTimeout(() => {
      copyIcon.classList.replace('fa-check', 'fa-copy');
      copyIcon.style.color = '';
    }, 2000);
  }).catch(() => {
    showToast('fa-solid fa-xmark', 'Clipboard access denied');
  });
}

/* ── Charset Detection (FIX #1) ──
   Returns { size, label } based on which character classes are present.
   Original used fixed 94 regardless of content. */
function getCharsetInfo(password) {
  let size = 0;
  const parts = [];
  if (/[a-z]/.test(password)) { size += 26; parts.push("a-z"); }
  if (/[A-Z]/.test(password)) { size += 26; parts.push("A-Z"); }
  if (/[0-9]/.test(password)) { size += 10; parts.push("0-9"); }
  if (/[^a-zA-Z0-9]/.test(password)) { size += 32; parts.push("symbols"); }
  return {
    size: size || 1,
    label: size ? `${size} chars (${parts.join(", ")})` : "1"
  };
}

/* ── Compute Entropy ── */
function computeEntropy(password) {
  const { size } = getCharsetInfo(password);
  return password.length > 0
    ? parseFloat((password.length * Math.log2(size)).toFixed(2))
    : 0;
}

/* ── Crack Time Estimation ── */
function estimateCrackTime(entropy) {
  if (entropy <= 0) return "Instantly";
  const seconds = Math.pow(2, entropy) / 1_000_000_000; // 1B guesses/sec
  if (seconds < 1) return "Instantly";
  if (seconds < 60) return `${Math.floor(seconds)} seconds`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours`;
  if (seconds < 2592000) return `${Math.floor(seconds / 86400)} days`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months`;
  const years = seconds / 31536000;
  if (years < 1e3) return `${Math.floor(years)} years`;
  if (years < 1e6) return `${(years / 1e3).toFixed(0)}K years`;
  if (years < 1e9) return `${(years / 1e6).toFixed(0)}M years`;
  return "Billions of years";
}

/* ── Score (frontend preview, matches backend logic) ── */
function computeScore(password) {
  let score = 0;
  if (password.length >= 8) score += 2;
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 2;
  if (/[^a-zA-Z0-9]/.test(password)) score += 2;
  return Math.min(score, 10);
}

function getStrengthLabel(score) {
  if (score <= 3) return "Weak";
  if (score <= 5) return "Fair";
  if (score <= 7) return "Moderate";
  if (score <= 9) return "Strong";
  return "Very Strong";
}

/* ── Apply Strength Bar Color ── */
function applyStrengthColor(score) {
  const bar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  const scorePercent = document.getElementById("scorePercent");
  const pct = score * 10;

  bar.style.width = pct + "%";
  scorePercent.innerText = pct + "%";
  strengthText.innerText = "Strength: " + getStrengthLabel(score);

  let color, shadow;
  if (score <= 3) {
    color = "#f85149"; shadow = "rgba(248,81,73,0.4)";
  } else if (score <= 6) {
    color = "#d29922"; shadow = "rgba(210,153,34,0.4)";
  } else {
    color = "#3fb950"; shadow = "rgba(63,185,80,0.4)";
  }
  bar.style.background = color;
  bar.style.boxShadow = `0 0 8px ${shadow}`;
  strengthText.style.color = color;
  scorePercent.style.color = color;
}

/* ── Live Analysis (FIX #2: now updates strength bar live) ── */
function liveAnalyze() {
  const password = document.getElementById("password").value;

  if (!password) {
    document.getElementById("entropy").innerText = "— bits";
    document.getElementById("crackTime").innerText = "—";
    document.getElementById("scoreVal").innerText = "— / 10";
    document.getElementById("charsetSize").innerText = "—";
    document.getElementById("strengthBar").style.width = "0%";
    document.getElementById("strengthText").innerText = "Strength: —";
    document.getElementById("scorePercent").innerText = "0%";
    return;
  }

  const entropy = computeEntropy(password);
  const score = computeScore(password);
  const { size, label } = getCharsetInfo(password);

  document.getElementById("entropy").innerText = entropy + " bits";
  document.getElementById("crackTime").innerText = estimateCrackTime(entropy);
  document.getElementById("scoreVal").innerText = score + " / 10";
  document.getElementById("charsetSize").innerText = label;

  // FIX #2: update strength bar live, not just on button click
  applyStrengthColor(score);

  // Live suggestions
  updateSuggestions(password);
}

/* ── Generate Secure Password (FIX #5: respects length slider) ── */
function generatePassword() {
  const length = parseInt(document.getElementById("lengthSlider").value) || 16;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  const password = Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map(x => chars[x % chars.length])
    .join('');

  const input = document.getElementById("password");
  input.value = password;
  input.type = "text";
  document.getElementById("toggleIcon").className = "fa-solid fa-eye";

  liveAnalyze();
  showToast('fa-solid fa-wand-magic-sparkles', `${length}-char password generated!`);
}

/* ── Update Suggestions List ── */
function updateSuggestions(password) {
  const list = document.getElementById("suggestionsList");
  list.innerHTML = "";

  const rules = [
    { test: password.length >= 8, msg: "Minimum 8 characters" },
    { test: password.length >= 12, msg: "Recommended 12+ characters" },
    { test: /[A-Z]/.test(password), msg: "Contains uppercase letters" },
    { test: /[a-z]/.test(password), msg: "Contains lowercase letters" },
    { test: /[0-9]/.test(password), msg: "Contains numbers" },
    { test: /[^a-zA-Z0-9]/.test(password), msg: "Contains special characters" },
  ];

  rules.forEach(rule => {
    const color = rule.test ? '#3fb950' : '#f85149';
    const icon = rule.test ? 'fa-circle-check' : 'fa-circle-exclamation';
    list.innerHTML += `
      <li style="color:${color}; font-size:14px">
        <i class="fa-solid ${icon}" style="color:${color}"></i>
        ${rule.msg}
      </li>`;
  });
}

/* ── Full Analysis + Breach Check ── */
async function checkPassword() {
  const password = document.getElementById("password").value;
  if (!password) {
    showToast('fa-solid fa-triangle-exclamation', 'Please enter a password first');
    return;
  }

  // Show loading state
  const btn = document.getElementById("analyzeBtn");
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
  btn.disabled = true;

  try {
    // Call backend API
    const response = await fetch(`${API_BASE}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      const data = await response.json();

      // Use backend values for official results
      document.getElementById("entropy").innerText = data.entropy + " bits";
      document.getElementById("crackTime").innerText = data.crackTime;
      document.getElementById("scoreVal").innerText = data.score + " / 10";
      applyStrengthColor(data.score);
      document.getElementById("report").innerText = data.report;
      updateSuggestions(password);

      // Breach result from backend (simulated DB check)
      updateBreachUI(data.breached, "Backend DB");

    } else {
      throw new Error("Backend error");
    }

  } catch (err) {
    // Backend unavailable — fall back to frontend-only analysis
    console.warn("Backend unavailable, using frontend analysis:", err);
    const score = computeScore(password);
    const entropy = computeEntropy(password);
    applyStrengthColor(score);
    document.getElementById("entropy").innerText = entropy + " bits";
    document.getElementById("crackTime").innerText = estimateCrackTime(entropy);
    document.getElementById("scoreVal").innerText = score + " / 10";
    updateSuggestions(password);
    document.getElementById("report").innerText =
      buildFrontendReport(password, score, entropy);
  }

  // Always run HIBP real-time breach check
  await checkBreach(password);

  btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Analyze';
  btn.disabled = false;
  showToast('fa-solid fa-magnifying-glass', 'Analysis complete');
}

/* ── HaveIBeenPwned Breach Check (FIX #3: correct suffix matching) ── */
async function checkBreach(password) {
  const breachBox = document.getElementById("breachStatus");
  breachBox.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color:var(--accent)"></i> Checking HIBP breach database...`;
  breachBox.style.borderColor = 'var(--border)';
  breachBox.style.background = 'var(--surface)';

  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();

    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();

    // FIX #3: split lines and compare prefix before the colon (prevents false-positive substring matches)
    const found = text.split('\n').some(line => line.trim().split(':')[0] === suffix);

    updateBreachUI(found, "HIBP API");

  } catch (e) {
    breachBox.style.borderColor = 'var(--border)';
    breachBox.innerHTML = `<i class="fa-solid fa-wifi" style="color:var(--muted)"></i> Breach check unavailable (network error)`;
  }
}

function updateBreachUI(found, source) {
  const breachBox = document.getElementById("breachStatus");
  if (found) {
    breachBox.style.borderColor = 'rgba(248,81,73,0.3)';
    breachBox.style.background = 'rgba(248,81,73,0.05)';
    breachBox.innerHTML = `
      <i class="fa-solid fa-triangle-exclamation" style="color:#f85149"></i>
      <span style="color:#f85149; font-size:14px;">
        <strong>BREACH FOUND</strong> — This password has been leaked (${source}). Change it immediately.
      </span>`;
  } else {
    breachBox.style.borderColor = 'rgba(63,185,80,0.3)';
    breachBox.style.background = 'rgba(63,185,80,0.05)';
    breachBox.innerHTML = `
      <i class="fa-solid fa-circle-check" style="color:#3fb950"></i>
      <span style="color:#3fb950; font-size:14px;">Safe — No known breaches found (${source})</span>`;
  }
}

/* ── Frontend Fallback Report (used when backend is unavailable) ── */
function buildFrontendReport(password, score, entropy) {
  const label = getStrengthLabel(score);
  const crack = estimateCrackTime(entropy);
  const lines = [
    "=== ShieldCheck Security Report (Frontend Analysis) ===\n",
    `Strength Level : ${label}`,
    `Score          : ${score} / 10`,
    `Entropy        : ${entropy} bits`,
    `Est. Crack Time: ${crack}`,
    `\n--- Checklist ---`,
    `${password.length >= 8 ? "[PASS]" : "[FAIL]"} Minimum 8 characters (length: ${password.length})`,
    `${password.length >= 12 ? "[PASS]" : "[FAIL]"} Recommended 12+ characters`,
    `${/[A-Z]/.test(password) ? "[PASS]" : "[FAIL]"} Contains uppercase letters`,
    `${/[a-z]/.test(password) ? "[PASS]" : "[FAIL]"} Contains lowercase letters`,
    `${/[0-9]/.test(password) ? "[PASS]" : "[FAIL]"} Contains numbers`,
    `${/[^a-zA-Z0-9]/.test(password) ? "[PASS]" : "[FAIL]"} Contains special characters`,
  ];
  return lines.join('\n');
}

/* ── Download Security Report (FIX #4: password is masked) ── */
// function downloadReport() {
//   const password = document.getElementById("password").value;
//   const entropy = document.getElementById("entropy").innerText;
//   const crackTime = document.getElementById("crackTime").innerText;
//   const strength = document.getElementById("strengthText").innerText;
//   const breach = document.getElementById("breachStatus").innerText.trim();
//   const reportText = document.getElementById("report").innerText;

//   // FIX #4: mask the password so it doesn't appear in the saved file
//   const maskedPassword = password.length > 0
//     ? "*".repeat(password.length) + ` (${password.length} characters)`
//     : "N/A";

//   const suggestions = [...document.querySelectorAll("#suggestionsList li")]
//     .map(li => "  " + li.innerText.trim())
//     .join("\n");

//   const fullContent = `ShieldCheck Password Security Report
// =====================================
// Generated On : ${new Date().toLocaleString()}

// Password Information
// --------------------------------------
// Password     : ${maskedPassword}
// ${strength}
// Entropy      : ${entropy}
// Crack Time   : ${crackTime}

// Breach Detection
// --------------------------------------
// ${breach}

// Security Checklist
// --------------------------------------
// ${suggestions}

// Full Audit Log
// --------------------------------------
// ${reportText}

// --------------------------------------
// Report generated by ShieldCheck v2.0
// `;

//   const blob = new Blob([fullContent], { type: "text/plain" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = `ShieldCheck_Report_${Date.now()}.txt`;
//   a.click();
//   URL.revokeObjectURL(url);
//   showToast('fa-solid fa-download', 'Report downloaded!');
// }


function downloadReport() {
  const { jsPDF } = window.jspdf;

  const password = document.getElementById("password").value;
  const entropy = document.getElementById("entropy").innerText;
  const crackTime = document.getElementById("crackTime").innerText;
  const strength = document.getElementById("strengthText").innerText;
  const breach = document.getElementById("breachStatus").innerText.trim();
  const reportText = document.getElementById("report").innerText;

  // Mask password (same as your logic ✅)
  const maskedPassword = password.length > 0
    ? "*".repeat(password.length) + ` (${password.length} characters)`
    : "N/A";

  const suggestions = [...document.querySelectorAll("#suggestionsList li")]
    .map(li => "• " + li.innerText.trim())
    .join("\n");

  const fullContent = `
ShieldCheck Password Security Report
=====================================

Generated On : ${new Date().toLocaleString()}

Password Information
--------------------------------------
Password     : ${maskedPassword}
${strength}
Entropy      : ${entropy}
Crack Time   : ${crackTime}

Breach Detection
--------------------------------------
${breach}

Security Checklist
--------------------------------------
${suggestions}

Full Audit Log
--------------------------------------
${reportText}

--------------------------------------
Report generated by ShieldCheck v2.0
`;

  // 🧾 Create PDF
  const doc = new jsPDF();

  doc.setFont("courier"); // looks like report style
  doc.setFontSize(11);

  const lines = doc.splitTextToSize(fullContent, 180);
  doc.text(lines, 10, 10);

  // Save PDF
  doc.save(`ShieldCheck_Report_${Date.now()}.pdf`);

  showToast('fa-solid fa-file-pdf', 'PDF downloaded!');
}