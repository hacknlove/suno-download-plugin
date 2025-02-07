function loadImageData(url: string, size: number) {
  return fetch(url)
    .then((response) => response.blob())
    .then((blob) => createImageBitmap(blob))
    .then((bitmap) => {
      // Create an OffscreenCanvas for processing the image
      const canvas = new OffscreenCanvas(size, size);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Unable to get canvas context");
      }
      ctx.drawImage(bitmap, 0, 0, size, size);
      return ctx.getImageData(0, 0, size, size);
    });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.disable();

  chrome.declarativeContent.onPageChanged.removeRules(undefined, async () => {
    const [imageData16, imageData32, imageData48, imageData96, imageData128] =
      await Promise.all([
        loadImageData(chrome.runtime.getURL("icon/16.png"), 16),
        loadImageData(chrome.runtime.getURL("icon/32.png"), 32),
        loadImageData(chrome.runtime.getURL("icon/48.png"), 48),
        loadImageData(chrome.runtime.getURL("icon/96.png"), 96),
        loadImageData(chrome.runtime.getURL("icon/128.png"), 128),
      ]);

    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {
              hostEquals: "suno.com",
              schemes: ["https"],
              pathPrefix: "/playlist/",
            },
          }),
        ],
        actions: [
          new chrome.declarativeContent.ShowAction(),
          new chrome.declarativeContent.SetIcon({
            imageData: {
              "16": imageData16,
              "32": imageData32,
              "48": imageData48,
              "96": imageData96,
              "128": imageData128,
            },
          }),
        ],
      },
    ]);
  });
});
