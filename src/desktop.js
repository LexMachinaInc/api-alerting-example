const { app, BrowserWindow } = require("electron");
const path = require("path");
const { getCasesFirmForDefendant, sortByFilingDate } = require("./ingest");
const getAllLinks = require("./links");
const templates = require("./template");

function createWindow () {
    let [win] = BrowserWindow.getAllWindows();

    if (win === undefined) {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            autoHideMenuBar: true,
            webPreferences: {
                devTools: true,
            }
        });
        // win.loadFile(path.join(__dirname, "../assets/index.html"));
    }
    return win;
}

app
  .whenReady()
  .then(getCasesFirmForDefendant)
  .then((cases) => {
    const content = cases
      .sort(sortByFilingDate)
      .map((districtCase) => ({
        ...districtCase,
        links: getAllLinks(districtCase),
        contact: districtCase.defendantAttorney,
      }))
      .reduce((content, next) => `${content}\n${templates.caseItem(next)}`, "");
    return templates.base(content);
  })
  .then((content) => {
    let browserWindow = createWindow();

    browserWindow.openDevTools();
    browserWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(content)}`);

    app.on("activate", () => {
      console.log("activate");
      browserWindow = createWindow();
    });
  });

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
