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
    const imageData16 = await loadImageData(
      chrome.runtime.getURL("icon/16.png"),
      16,
    );
    const imageData32 = await loadImageData(
      chrome.runtime.getURL("icon/32.png"),
      32,
    );
    const imageData48 = await loadImageData(
      chrome.runtime.getURL("icon/48.png"),
      48,
    );
    const imageData96 = await loadImageData(
      chrome.runtime.getURL("icon/96.png"),
      96,
    );
    const imageData128 = await loadImageData(
      chrome.runtime.getURL("icon/128.png"),
      128,
    );

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
              "16": await imageData16,
              "32": await imageData32,
              "48": await imageData48,
              "96": await imageData96,
              "128": await imageData128,
            },
          }),
        ],
      },
    ]);
  });
});
