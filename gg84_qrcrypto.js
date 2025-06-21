
async function gg84encrypt(plaintext, password) {
  const enc = new TextEncoder();
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const keyMaterial = await window.crypto.subtle.importKey(
    "raw", enc.encode(password), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]
  );
  const key = await window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt"]
  );
  const encrypted = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(plaintext)
  );
  const combined = new Uint8Array(salt.byteLength + iv.byteLength + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.byteLength);
  combined.set(new Uint8Array(encrypted), salt.byteLength + iv.byteLength);
  return btoa(String.fromCharCode(...combined));
}

async function encryptAndGenerateQR() {
  const text = document.getElementById("textToEncrypt").value;
  const pass = document.getElementById("passwordEncrypt").value;
  if (!text.trim()) {
    alert("Inserisci un messaggio.");
    return;
  }
  const signature = "@91GgMc48*";
  const encrypted = await gg84encrypt(text + signature, pass);
  document.getElementById("qrcode").innerHTML = "";
  document.getElementById("decryptedOutput").innerText = "✅ QR generato correttamente!";
  new QRCode(document.getElementById("qrcode"), {
    text: encrypted,
    width: 256,
    height: 256
});

setTimeout(() => {
  const canvas = document.querySelector("#qrcode canvas");
  const link = document.getElementById("downloadQR");
  if (canvas && link) {
    try {
      const dataURL = canvas.toDataURL("image/png");
      link.href = dataURL;
      link.download = "gg84_qrcode.png";
      link.style.display = "inline-block";
    } catch (e) {
      console.error("Errore nel generare il QR da scaricare:", e);
    }
  }
}, 500);

}
