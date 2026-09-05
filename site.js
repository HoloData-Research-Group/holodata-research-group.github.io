const contentPanels = document.querySelectorAll(".content-panel");
const contentPanelsContainer = document.querySelector(".content-panels");

if (contentPanels.length === 0) {
  const legacyPage = window.location.pathname.split("/").pop().replace(".html", "");
  const legacyPanels = ["mission", "projects", "publications", "internships", "team"];

  if (legacyPanels.includes(legacyPage)) {
    window.location.replace(`index.html#${legacyPage}`);
  }
}

function showPanel(panelId) {
  const requestedPanel = document.getElementById(panelId);
  const panelToShow = requestedPanel?.classList.contains("content-panel")
    ? requestedPanel
    : document.getElementById("welcome");

  contentPanels.forEach((panel) => {
    panel.classList.toggle("active", panel === panelToShow);
  });
}

function setStablePanelHeight() {
  if (!contentPanelsContainer) {
    return;
  }

  const previousDisplayValues = Array.from(contentPanels, (panel) => panel.style.display);
  contentPanels.forEach((panel) => {
    panel.style.display = "block";
  });
  const tallestPanel = Math.max(...Array.from(contentPanels, (panel) => panel.offsetHeight));
  contentPanels.forEach((panel, index) => {
    panel.style.display = previousDisplayValues[index];
  });
  contentPanelsContainer.style.setProperty("--content-panels-height", `${tallestPanel}px`);
}

function typeTerminalTitles() {
  const titles = document.querySelectorAll(".terminal-title");
  if (!titles.length) {
    return;
  }

  let titleIndex = 0;
  const initialTypingDelay = 2000;

  function typeNextTitle() {
    const title = titles[titleIndex];
    const text = title.dataset.text;
    let characterIndex = 0;
    const prompt = ">";

    title.textContent = prompt;
    title.classList.add("typing-cursor");

    const typeCharacter = () => {
      title.textContent = prompt + text.slice(0, characterIndex + 1);
      characterIndex += 1;

      if (characterIndex < text.length) {
        window.setTimeout(typeCharacter, 150);
      } else if (titleIndex < titles.length - 1) {
        title.textContent = text;
        title.classList.remove("typing-cursor");
        titleIndex += 1;
        window.setTimeout(typeNextTitle, 300);
      }
    };

    typeCharacter();
  }

  window.setTimeout(typeNextTitle, initialTypingDelay);
}

function createWelcomeSpinners() {
  const stage = document.querySelector(".welcome-animation-stage");
  if (!stage) {
    return;
  }

  const numberOfSpinners = 4;
  const imagePath = "images/logo_notext_square_centered_transparent.png";

  for (let index = 0; index < numberOfSpinners; index += 1) {
    const spinner = document.createElement("img");
    spinner.className = "generated-spinner";
    spinner.src = imagePath;
    spinner.alt = "";
    spinner.style.setProperty("--duration", `${4 + index * 0.2}s`);
    spinner.style.setProperty("--start-angle", "0deg");
    stage.appendChild(spinner);
  }
}

window.addEventListener("resize", setStablePanelHeight);

document.querySelectorAll(".contents-banner a").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const currentScrollPosition = window.scrollY;
    const panelId = link.getAttribute("href").slice(1);
    showPanel(panelId);
    history.pushState(null, "", `#${panelId}`);
    window.scrollTo(0, currentScrollPosition);
  });
});

window.addEventListener("popstate", () => {
  showPanel(window.location.hash.slice(1));
});

createWelcomeSpinners();
typeTerminalTitles();
setStablePanelHeight();
showPanel(window.location.hash.slice(1));
