/**
 * THE VAULT — Google Apps Script backend
 *
 * 1. Put your permanent public Google Drive folder ID below.
 * 2. Deploy as Web App:
 *    Execute as: Me
 *    Who has access: Anyone
 * 3. Paste the Web App URL into API_URL in src/main.jsx.
 *
 * The folder should contain video files. The API returns metadata and
 * a browser-friendly Drive preview URL.
 */

const DRIVE_FOLDER_ID = "PASTE_YOUR_PERMANENT_FOLDER_ID_HERE";

function doGet() {
  const folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
  const files = folder.getFiles();
  const result = [];

  while (files.hasNext()) {
    const file = files.next();
    const mime = file.getMimeType();

    if (!mime.startsWith("video/")) continue;

    const id = file.getId();
    result.push({
      id: id,
      name: file.getName().replace(/\.[^/.]+$/, ""),
      category: inferCategory(file.getName()),
      description: "Selected work from the archive.",
      url: "https://drive.google.com/uc?export=download&id=" + id,
      previewUrl: "https://drive.google.com/file/d/" + id + "/preview",
      thumbnail: "https://drive.google.com/thumbnail?id=" + id + "&sz=w1600"
    });
  }

  result.sort((a, b) => a.name.localeCompare(b.name));

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function inferCategory(name) {
  const n = name.toLowerCase();
  if (n.includes("3d") || n.includes("cgi") || n.includes("blender")) return "3D / CGI";
  if (n.includes("motion") || n.includes("graphic")) return "MOTION";
  if (n.includes("film") || n.includes("documentary")) return "FILM";
  return "SELECTED WORK";
}