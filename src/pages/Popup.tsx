import JSZip from "jszip";
import "./Popup.css";
import { useEffect, useState } from "react";

function normalizeFilename(filename: string) {
  return filename.replace(/[/ ?&:]+/g, "-");
}

async function addFileToZip(zip: JSZip, url: string, filename: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}`);
    }

    const blob = await response.blob();
    zip.file(filename, blob);
  } catch {
    const retry = confirm(`Failed to add ${filename} to zip, try again?`);
    if (!retry) {
      return;
    }
    return addFileToZip(zip, url, filename);
  }
}

async function getPage(playlistId: string, page: number) {
  return await fetch(
    `https://studio-api.prod.suno.com/api/playlist/${playlistId}?page=${page}`,
  ).then((res) => res.json());
}

let downloading = false;

async function downloadAllSongs(playlistId: string, firstPage: any) {
  if (!playlistId) {
    alert("No playlist ID found");
  }

  const zip = new JSZip();

  let { name, user_handle, num_total_results, playlist_clips } = firstPage;

  if (!num_total_results) {
    alert("No playlist found");
    return;
  }

  let page = 1;
  let totalDownloaded = 0;

  while (totalDownloaded < num_total_results) {
    let nextPage;
    if (totalDownloaded + playlist_clips.length < num_total_results) {
      nextPage = getPage(playlistId, ++page);
    }
    for (const {
      clip: { audio_url, handle, title },
    } of playlist_clips) {
      await addFileToZip(
        zip,
        audio_url,
        `${normalizeFilename(handle)}-${normalizeFilename(title)}.mp3`,
      );
      totalDownloaded++;
      document.documentElement.style.setProperty(
        "--progress-percent",
        `${(totalDownloaded / num_total_results) * 100}%`,
      );
      document.documentElement.style.setProperty(
        "--progress-text",
        `"${totalDownloaded} / ${num_total_results}"`,
      );
    }

    try {
      playlist_clips = nextPage && (await nextPage).playlist_clips;
    } catch {
      const retry = confirm(
        "Error fetching next page, try to download the rest of the playlist?",
      );
      if (!retry) {
        break;
      }
      playlist_clips = [];
      page--;
    }
  }

  const zipBlob = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(zipBlob);

  chrome.downloads.download({
    url,
    filename: `${normalizeFilename(name)}-${normalizeFilename(user_handle)}.zip`,
    saveAs: true,
  });

  downloading = false;
}

const playlistRegExp = /^https:\/\/suno\.com\/playlist\/([a-f0-9-]+)/;

export default function Popup() {
  // return <div className="progress"></div>;
  const [num_total_results, setNumTotalResults] = useState(0);

  useEffect(() => {
    if (downloading) {
      return;
    }

    downloading = true;

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const playlistId = tabs[0].url?.match(playlistRegExp)?.[1];

      if (!playlistId) {
        setNumTotalResults(-1);
        return;
      }

      getPage(playlistId, 1)
        .then((page) => {
          setNumTotalResults(page.num_total_results);
          return downloadAllSongs(playlistId, page);
        })
        .then(() => {
          chrome.runtime.sendMessage({ type: "close-popup" });
        });
    });
  }, []);

  if (!num_total_results) {
    return <div className="loading">Loading...</div>;
  }

  if (num_total_results === -1) {
    return null;
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          :root {
            --progress-percent: 0;
            --progress-text: '0 / ${num_total_results}';
          }
        `,
        }}
      />
      <div className="progress"></div>
    </>
  );
}
