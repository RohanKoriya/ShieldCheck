// const API_BASE = "http://localhost:8080/api/password";   //for Local use
const API_BASE = "/api/password";

let isBreached = false;

/* ================================================================
   UTILITIES
================================================================ */

function showToast(iconClass, msg) {
  const toast = document.getElementById('toast');
  toast.querySelector('i').className = iconClass;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

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

function copyPassword() {
  const pass = document.getElementById("password");
  if (!pass.value) return;
  navigator.clipboard.writeText(pass.value).then(() => {
    const icon = document.getElementById('copyIcon');
    icon.classList.replace('fa-copy', 'fa-check');
    icon.style.color = '#3fb950';
    showToast('fa-solid fa-check', 'Copied to clipboard!');
    setTimeout(() => {
      icon.classList.replace('fa-check', 'fa-copy');
      icon.style.color = '';
    }, 2000);
  }).catch(() => showToast('fa-solid fa-xmark', 'Clipboard access denied'));
}

/* ================================================================
   ANALYSIS HELPERS
================================================================ */

function getCharsetInfo(password) {
  let size = 0;
  const parts = [];
  if (/[a-z]/.test(password)) { size += 26; parts.push("a-z"); }
  if (/[A-Z]/.test(password)) { size += 26; parts.push("A-Z"); }
  if (/[0-9]/.test(password)) { size += 10; parts.push("0-9"); }
  if (/[^a-zA-Z0-9]/.test(password)) { size += 32; parts.push("symbols"); }
  return {
    size: size || 1,
    label: size ? `${size} (${parts.join(", ")})` : "1"
  };
}

function computeEntropy(password) {
  const { size } = getCharsetInfo(password);
  return password.length > 0
    ? parseFloat((password.length * Math.log2(size)).toFixed(2))
    : 0;
}

function estimateCrackTime(entropy) {
  if (entropy <= 0) return "Instantly";
  const seconds = Math.pow(2, entropy) / 1_000_000_000;
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

/* ================================================================
   UI UPDATES
================================================================ */

function applyStrengthColor(score) {
  const bar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");
  const scorePercent = document.getElementById("scorePercent");
  const pct = score * 10;

  bar.style.width = pct + "%";
  scorePercent.innerText = pct + "%";
  strengthText.innerText = "Strength: " + getStrengthLabel(score);

  let color, shadow;
  if (score <= 3) { color = "#f85149"; shadow = "rgba(248,81,73,0.4)"; }
  else if (score <= 6) { color = "#d29922"; shadow = "rgba(210,153,34,0.4)"; }
  else { color = "#3fb950"; shadow = "rgba(63,185,80,0.4)"; }

  bar.style.background = color;
  bar.style.boxShadow = `0 0 8px ${shadow}`;
  strengthText.style.color = color;
  scorePercent.style.color = color;
}

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

function updateBreachUI(found, source) {
  const box = document.getElementById("breachStatus");
  if (found) {
    box.style.borderColor = 'rgba(248,81,73,0.3)';
    box.style.background = 'rgba(248,81,73,0.05)';
    box.innerHTML = `
      <i class="fa-solid fa-triangle-exclamation" style="color:#f85149"></i>
      <span style="color:#f85149; font-size:14px;">
        <strong>BREACH FOUND</strong> — This password has been leaked (${source}). Change it immediately.
      </span>`;
  } else {
    box.style.borderColor = 'rgba(63,185,80,0.3)';
    box.style.background = 'rgba(63,185,80,0.05)';
    box.innerHTML = `
      <i class="fa-solid fa-circle-check" style="color:#3fb950"></i>
      <span style="color:#3fb950; font-size:14px;">Safe — No known breaches found (${source})</span>`;
  }
}

/* ================================================================
   LIVE ANALYSIS
================================================================ */

function liveAnalyze() {
  const password = document.getElementById("password").value;

  if (!password) {
    document.getElementById("entropy").innerText = "-- bits";
    document.getElementById("crackTime").innerText = "--";
    document.getElementById("scoreVal").innerText = "-- / 10";
    document.getElementById("charsetSize").innerText = "--";
    document.getElementById("strengthBar").style.width = "0%";
    document.getElementById("strengthText").innerText = "Strength: --";
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

  applyStrengthColor(score);
  updateSuggestions(password);
}

/* ================================================================
   PASSWORD GENERATOR
================================================================ */

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

/* ================================================================
   BREACH CHECK (HIBP k-anonymity)
================================================================ */

async function checkBreach(password) {
  const box = document.getElementById("breachStatus");
  box.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="color:var(--accent)"></i> Checking breach database...`;
  box.style.borderColor = 'var(--border)';
  box.style.background = 'var(--surface)';

  try {
    const encoded = new TextEncoder().encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-1', encoded);
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();

    const prefix = hashHex.substring(0, 5);
    const suffix = hashHex.substring(5);
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const text = await response.text();

    const found = text.split('\n').some(line => line.trim().split(':')[0] === suffix);
    isBreached = found;
    updateBreachUI(found, "HIBP API");

  } catch (e) {
    box.style.borderColor = 'var(--border)';
    box.innerHTML = `<i class="fa-solid fa-wifi" style="color:var(--muted)"></i> Breach check unavailable (network error)`;
  }
}

/* ================================================================
   MAIN ANALYSIS FLOW
================================================================ */

async function checkPassword() {
  const password = document.getElementById("password").value;
  if (!password) {
    showToast('fa-solid fa-triangle-exclamation', 'Please enter a password first');
    return;
  }

  const btn = document.getElementById("analyzeBtn");
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analyzing...';
  btn.disabled = true;

  let score = computeScore(password);
  let entropy = computeEntropy(password);

  try {
    const response = await fetch(`${API_BASE}/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      const data = await response.json();
      score = data.score;
      entropy = data.entropy;

      document.getElementById("entropy").innerText = data.entropy + " bits";
      document.getElementById("crackTime").innerText = data.crackTime;
      document.getElementById("scoreVal").innerText = data.score + " / 10";
      applyStrengthColor(data.score);
      updateSuggestions(password);
    } else {
      throw new Error("Backend error");
    }

  } catch (err) {
    console.warn("Backend unavailable, using frontend analysis:", err);
    document.getElementById("entropy").innerText = entropy + " bits";
    document.getElementById("crackTime").innerText = estimateCrackTime(entropy);
    document.getElementById("scoreVal").innerText = score + " / 10";
    applyStrengthColor(score);
    updateSuggestions(password);
  }

  // HIBP must finish before report is built so isBreached is correct
  await checkBreach(password);

  document.getElementById("report").innerText = buildFinalReport(password, score, entropy);

  btn.innerHTML = '<i class="fa-solid fa-magnifying-glass"></i> Analyze';
  btn.disabled = false;
  showToast('fa-solid fa-magnifying-glass', 'Analysis complete');
}

/* ================================================================
   REPORT BUILDER
   - Single source of truth for both UI audit log and PDF
   - ASCII only (no Unicode) for full jsPDF compatibility
   - No duplicate sections, no repeated data
================================================================ */

function buildFinalReport(password, score, entropy) {
  const label = getStrengthLabel(score);
  const crack = estimateCrackTime(entropy);
  const { size, label: charLabel } = getCharsetInfo(password);
  const masked = "*".repeat(password.length) + ` (${password.length} chars)`;
  const now = new Date().toLocaleString();

  // Risk level
  let risk, riskNote;
  if (isBreached || score <= 3) { risk = "CRITICAL"; riskNote = "Do not use this password. Change it immediately."; }
  else if (score <= 5) { risk = "HIGH"; riskNote = "Weak password. Should be changed soon."; }
  else if (score <= 7) { risk = "MODERATE"; riskNote = "Acceptable, but can be made stronger."; }
  else { risk = "LOW"; riskNote = "Strong password. Store it in a password manager."; }

  // Breach status
  const breachStatus = isBreached
    ? "BREACH FOUND - This password has appeared in a public data breach."
    : "SAFE - Not found in any known breach database (HIBP API).";

  // Checklist
  const p = (b) => b ? "[PASS]" : "[FAIL]";
  const checklist = [
    `${p(password.length >= 8)}  Minimum 8 characters          (length: ${password.length})`,
    `${p(password.length >= 12)} Recommended 12+ characters`,
    `${p(password.length >= 16)} Excellent 16+ characters`,
    `${p(/[A-Z]/.test(password))}  Contains uppercase letters`,
    `${p(/[a-z]/.test(password))}  Contains lowercase letters`,
    `${p(/[0-9]/.test(password))}  Contains numbers`,
    `${p(/[^a-zA-Z0-9]/.test(password))}  Contains special characters`,
    `${p(!isBreached)}  Not found in breach database`,
  ].join("\n  ");

  // Recommendations (only what applies)
  const recs = [];
  if (password.length < 12) recs.push("- Use at least 12 characters.");
  if (password.length < 16) recs.push("- Use 16+ characters for stronger security.");
  if (!/[A-Z]/.test(password)) recs.push("- Add uppercase letters (A-Z).");
  if (!/[a-z]/.test(password)) recs.push("- Add lowercase letters (a-z).");
  if (!/[0-9]/.test(password)) recs.push("- Add numbers (0-9).");
  if (!/[^a-zA-Z0-9]/.test(password)) recs.push("- Add special characters (e.g. !@#$%^&*).");
  if (isBreached) recs.push("- URGENT: Stop using this password on all accounts.");
  if (score <= 5) recs.push("- Avoid dictionary words, names, or simple patterns.");
  if (score <= 7) recs.push("- Try a passphrase e.g. Coffee-Lamp-River-42!");
  const recText = recs.length > 0
    ? recs.join("\n  ")
    : "No recommendations. Password meets all security criteria.";

  // Tips
  const tips = [
    "- Never reuse the same password across different accounts.",
    "- Use a password manager (Bitwarden, 1Password) to store passwords.",
    "- Enable Two-Factor Authentication (2FA) wherever available.",
    "- Never share passwords via email, SMS, or chat.",
    "- Change passwords immediately if a breach is suspected.",
  ].join("\n  ");

  const div = "--------------------------------------";
  const hdiv = "======================================";

  return [
    `ShieldCheck - Password Security Report`,
    hdiv,
    `Generated : ${now}`,
    `Version   : ShieldCheck v2.0`,
    ``,
    div,
    `PASSWORD SUMMARY`,
    div,
    `Password  : ${masked}`,
    `Length    : ${password.length} characters`,
    `Charset   : ${charLabel}`,
    `Entropy   : ${entropy} bits`,
    `Strength  : ${label} (${score}/10)`,
    `Crack Time: ${crack} (at 1 billion guesses/sec)`,
    ``,
    div,
    `RISK ASSESSMENT`,
    div,
    `Risk Level: ${risk}`,
    `Summary   : ${riskNote}`,
    ``,
    div,
    `BREACH STATUS`,
    div,
    breachStatus,
    ``,
    div,
    `SECURITY CHECKLIST`,
    div,
    `  ${checklist}`,
    ``,
    div,
    `RECOMMENDATIONS`,
    div,
    `  ${recText}`,
    ``,
    div,
    `SECURITY TIPS`,
    div,
    `  ${tips}`,
    ``,
    div,
    `DISCLAIMER`,
    div,
    `  This report is for educational purposes only.`,
    `  Breach data sourced from HaveIBeenPwned (HIBP).`,
    `  Only first 5 chars of SHA-1 hash sent to HIBP.`,
    `  No passwords are stored or transmitted.`,
    hdiv,
    `  Report generated by ShieldCheck v2.0`,
    hdiv,
  ].join("\n");
}

/* ================================================================
   PDF DOWNLOAD
   Uses buildFinalReport directly — no duplication
================================================================ */

function downloadReport() {
  const password = document.getElementById("password").value;
  if (!password) {
    showToast('fa-solid fa-triangle-exclamation', 'Analyze a password first');
    return;
  }

  const score = parseInt(document.getElementById("scoreVal").innerText) || computeScore(password);
  const entropy = parseFloat(document.getElementById("entropy").innerText) || computeEntropy(password);

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.setFont("courier");
  doc.setFontSize(10);

  const reportText = buildFinalReport(password, score, entropy);
  const lines = doc.splitTextToSize(reportText, 185);

  let y = 12;
  const lineHeight = 5.5;
  const pageHeight = doc.internal.pageSize.height;

  lines.forEach(line => {
    if (y + lineHeight > pageHeight - 12) {
      doc.addPage();
      y = 12;
    }
    doc.text(line, 10, y);
    y += lineHeight;
  });

  doc.save(`ShieldCheck_Report_${Date.now()}.pdf`);
  showToast('fa-solid fa-file-pdf', 'PDF report downloaded!');
}