// background.js
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed – adding context menu...");
  chrome.contextMenus.create({
    id: "addToPPT",
    title: "Add image to PPT",
    contexts: ["image"]
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  const image = { image: info.srcUrl, page: info.pageUrl };

  chrome.storage.local.get("savedImages", (result) => {
    const existing = result.savedImages || [];
    existing.push(image);
    chrome.storage.local.set({ savedImages: existing }, () => {
      console.log("Image saved:", image);
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadPPT") {
    chrome.storage.local.get("savedImages", (result) => {
      const images = result.savedImages || [];
      console.log("Images being sent to backend:", images);

      if (images.length === 0) {
        sendResponse({ success: false, error: "No images selected." });
        // sendResponse({ success: false });
        return;
      }

      fetch("https://altossa-ppt-extension.onrender.com/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(images)
      })
        .then((res) => res.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            const dataUrl = reader.result;

            chrome.downloads.download({
              url: dataUrl,
              filename: "Selected_Images.pptx"
            });

            setTimeout(() => {
              chrome.storage.local.set({ savedImages: [] }, () => {
                console.log("Cleared saved images after 10s.");
              });
            }, 10000);

            sendResponse({ success: true });
          };

          reader.onerror = (err) => {
            console.error("Fetch failed. Details:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
            sendResponse({ success: false });
          };

          reader.readAsDataURL(blob);
        })
        .catch((err) => {
          console.error("Fetch failed. Details:", JSON.stringify(err, Object.getOwnPropertyNames(err)));
          sendResponse({ success: false });
        });
    });
    return true; // Needed to keep message port open
  }
});





