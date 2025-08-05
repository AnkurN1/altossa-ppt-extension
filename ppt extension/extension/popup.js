document.addEventListener("DOMContentLoaded", function () {
  // 🔘 Download PPT
  document.getElementById("download").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "downloadPPT" }, (response) => {
      if (chrome.runtime.lastError) {
        alert("⚠️ Extension error: " + chrome.runtime.lastError.message);
      } else if (response && response.success) {
        alert("✅ Your PowerPoint is being downloaded.");
      } else {
        const errorMsg = response?.error || "Unknown error occurred.";
        alert("❌ Download failed: " + errorMsg);
      }
    });
  });

  // 🔁 Clear saved selections
  document.getElementById("reset").addEventListener("click", () => {
    chrome.storage.local.set({ savedImages: [] }, () => {
      alert("🧹 Image selection has been cleared.");
    });
  });
});
