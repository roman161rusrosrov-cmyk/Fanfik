(() => {
  "use strict";

  const STORAGE = {
    chapter: "seven-minutes:last-chapter",
    scrolls: "seven-minutes:scroll-positions",
    bookmarks: "seven-minutes:bookmarks",
    fontSize: "seven-minutes:font-size",
    theme: "seven-minutes:theme"
  };

  const els = {
    html: document.documentElement,
    body: document.body,
    header: document.getElementById("siteHeader"),
    pageProgress: document.getElementById("pageProgress"),
    themeToggle: document.getElementById("themeToggle"),
    continueReading: document.getElementById("continueReading"),
    continueLabel: document.getElementById("continueLabel"),
    reader: document.getElementById("reader"),
    readerShell: document.getElementById("readerShell"),
    readerPanel: document.getElementById("readerPanel"),
    sidebar: document.getElementById("readerSidebar"),
    sidebarClose: document.getElementById("sidebarClose"),
    backdrop: document.getElementById("readerBackdrop"),
    menuButton: document.getElementById("menuButton"),
    chapterSearch: document.getElementById("chapterSearch"),
    chapterList: document.getElementById("chapterList"),
    bookmarkFilter: document.getElementById("bookmarkFilter"),
    bookmarkButton: document.getElementById("bookmarkButton"),
    fontDecrease: document.getElementById("fontDecrease"),
    fontIncrease: document.getElementById("fontIncrease"),
    focusButton: document.getElementById("focusButton"),
    readingProgress: document.getElementById("readingProgress"),
    toolbarChapter: document.getElementById("toolbarChapter"),
    chapterOverline: document.getElementById("chapterOverline"),
    chapterTitle: document.getElementById("chapterTitle"),
    chapterReadTime: document.getElementById("chapterReadTime"),
    chapterWordCount: document.getElementById("chapterWordCount"),
    chapterContent: document.getElementById("chapterContent"),
    previousChapter: document.getElementById("previousChapter"),
    nextChapter: document.getElementById("nextChapter"),
    previousLabel: document.getElementById("previousLabel"),
    nextLabel: document.getElementById("nextLabel"),
    savedStatus: document.getElementById("savedStatus"),
    sceneLightbox: document.getElementById("sceneLightbox"),
    sceneLightboxImage: document.getElementById("sceneLightboxImage"),
    sceneLightboxCaption: document.getElementById("sceneLightboxCaption"),
    sceneLightboxMeta: document.getElementById("sceneLightboxMeta"),
    sceneLightboxClose: document.getElementById("sceneLightboxClose"),
    toast: document.getElementById("toast"),
    footerYear: document.getElementById("footerYear")
  };

  const state = {
    chapters: [],
    current: clamp(Number(localStorage.getItem(STORAGE.chapter)) || 1, 1, 60),
    bookmarks: readJSON(STORAGE.bookmarks, []),
    scrolls: readJSON(STORAGE.scrolls, {}),
    fontSize: clamp(Number(localStorage.getItem(STORAGE.fontSize)) || 19, 16, 24),
    onlyBookmarks: false,
    search: "",
    toastTimer: null,
    scrollSaveTimer: null,
    ready: false
  };

  const SCENE_CAPTIONS = [
    ["Арчи у Амириной кровати", "Первый разговор в автобусе"],
    ["Сообщение по дороге в школу", "Арчи ждёт у библиотеки"],
    ["Семейный вечер Ромы", "Чат, который стал важным"],
    ["Коробки перед переездом", "Семья решает за столом"],
    ["Двор, который придётся оставить", "Последняя коробка Армавира"],
    ["Арчи среди вещей", "Дорога в новый город"],
    ["Арчи осваивает Ростов", "Скамейка старого двора"],
    ["Первая встреча у книжного", "Арчи принимает Рому"],
    ["Молчание в переписке", "Разговор взрослых за столом"],
    ["Дождливый маршрут вдвоём", "Первое семейное знакомство"],
    ["Окно, которое осталось", "Арчи у новой двери"],
    ["Руки в зимних перчатках", "Книжный свет под дождём"],
    ["Утреннее обещание", "Арсен задаёт вопросы"],
    ["Новогодний семейный стол", "Арчи и новый дом"],
    ["Две минуты без телефонов", "Город после полуночи"],
    ["Слово в телефоне", "Серьёзный разговор о границах"],
    ["Арчи остаётся рядом", "Помощь без лишних слов"],
    ["Семья замечает ревность", "Дорога после честного разговора"],
    ["Обязанности за общим столом", "Арчи слышит очередную ссору"],
    ["Февральские руки", "Правила, которые общие для всех"],
    ["Старый двор Армавира", "Решение о Бердянске"],
    ["Возвращение к старому окну", "Семейная дорога"],
    ["Вечер у УАЗа", "Сообщение перед ремонтом"],
    ["Друзья у книжного", "Арсен снова проверяет"],
    ["Красная лента и два берега", "Семейный спор о поездке"],
    ["Чемодан снова открыт", "Разговор, который стал громче"],
    ["Последняя зимняя прогулка", "Два разных маршрута"],
    ["Камера у тётиного окна", "Первый кадр Бердянска"],
    ["Два берега в одном дневнике", "Тётя оставляет семь минут"],
    ["Бердянск без любви", "Красная лента на столе"],
    ["Встреча после двух дорог", "Семьи рядом"],
    ["Плёнка и летние находки", "УАЗ на старом снимке"],
    ["Домашний график", "Арчи под общим столом"],
    ["Автобус возвращается", "Арчи узнаёт Рому"],
    ["Первая выставка", "Кадр из Бердянска"],
    ["Жёсткий разговор Арсена", "Сообщение о новой школе"],
    ["Фонарь у УАЗа", "Ожидание вступительного теста"],
    ["Семейное поздравление", "УАЗ снова во дворе"],
    ["Шестнадцатилетие Амиры", "Арчи под праздничным столом"],
    ["Четырнадцатилетие Ромы", "Первый семейный показ"],
    ["Кадр первой встречи", "Год спустя — те же руки"],
    ["Обычный вечер у УАЗа", "Первый день новой школы"],
    ["Последний ремонт до дождя", "Свет скорой во дворе"],
    ["Упавшая лестница", "Больничный коридор до рассвета"],
    ["Телефон в больнице", "Пустое место на выставке"],
    ["Семь минут правды", "Книжный магазин после ссоры"],
    ["Семья держится вместе", "Дежурство в больнице"],
    ["Фотография «Семь минут»", "Восстановление дома"],
    ["Каталог на стене", "Две семьи в одном зале"],
    ["Красная лента проекта", "Идея из больничных минут"],
    ["Поезд в Армавир", "Скамейка старого двора"],
    ["Окно прошлого", "Тётины руки в Бердянске"],
    ["Встреча на платформе", "Арчи связывает их поводком"],
    ["Школьный чат", "Семья защищает, не отбирая голос"],
    ["Новогодний снег", "Общий стол двух семей"],
    ["Городской финал", "УАЗ после восстановления"],
    ["Собеседование Амиры", "Снимок из нелюбимого города"],
    ["Пять дней пути", "Два города на одном столе"],
    ["Утренний поезд домой", "Руки, которые дождались"],
    ["Финальная выставка", "Дорога к главе шестьдесят первой"]
  ];

  const sceneState = { chapter: 1, slot: 0 };

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function readJSON(key, fallback) {
    try {
      const parsed = JSON.parse(localStorage.getItem(key));
      return parsed ?? fallback;
    } catch {
      return fallback;
    }
  }

  function escapeHTML(value) {
    return value.replace(/[&<>'"]/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;"
    }[character]));
  }

  function getPart(chapter) {
    if (chapter <= 12) return "Часть I · Армавир → Ростов";
    if (chapter <= 24) return "Часть II · Первая зима";
    if (chapter <= 36) return "Часть III · Весна и лето";
    if (chapter <= 48) return "Часть IV · Новый год";
    return "Часть V · После семи минут";
  }

  function showToast(message) {
    clearTimeout(state.toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("show");
    state.toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }

  function setTheme(theme, persist = true) {
    const normalized = theme === "light" ? "light" : "dark";
    els.html.dataset.theme = normalized;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", normalized === "dark" ? "#0b0e13" : "#eee9e0");
    els.themeToggle.setAttribute("aria-label", normalized === "dark" ? "Включить светлую тему" : "Включить тёмную тему");
    if (persist) localStorage.setItem(STORAGE.theme, normalized);
  }

  function setFontSize(size, notify = false) {
    state.fontSize = clamp(size, 16, 24);
    els.html.style.setProperty("--reader-font-size", `${state.fontSize}px`);
    localStorage.setItem(STORAGE.fontSize, String(state.fontSize));
    if (notify) showToast(`Размер текста: ${state.fontSize}px`);
  }

  function getHashChapter() {
    const match = window.location.hash.match(/^#chapter-(\d{1,2})$/);
    if (!match) return null;
    return clamp(Number(match[1]), 1, 60);
  }

  async function loadStory() {
    try {
      const response = await fetch("story.html", { cache: "force-cache" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const source = await response.text();
      const doc = new DOMParser().parseFromString(source, "text/html");
      const headings = [...doc.querySelectorAll("h1")];

      state.chapters = headings.map((heading, index) => {
        const holder = document.createElement("div");
        let node = heading.nextSibling;
        while (node && !(node.nodeType === Node.ELEMENT_NODE && node.tagName === "H1")) {
          holder.appendChild(node.cloneNode(true));
          node = node.nextSibling;
        }

        const text = holder.textContent.replace(/\s+/g, " ").trim();
        const words = text ? text.split(/\s+/u).length : 0;
        return {
          number: index + 1,
          title: heading.textContent.trim() || `Глава ${index + 1}`,
          html: holder.innerHTML,
          text,
          searchText: `${heading.textContent} ${text}`.toLocaleLowerCase("ru"),
          words,
          minutes: Math.max(1, Math.ceil(words / 190))
        };
      });

      if (state.chapters.length !== 60) {
        throw new Error(`Ожидалось 60 глав, найдено ${state.chapters.length}`);
      }

      state.ready = true;
      const directChapter = getHashChapter();
      state.current = directChapter || state.current;
      renderChapterList();
      selectChapter(state.current, {
        restore: !directChapter,
        updateHash: Boolean(directChapter),
        animate: false
      });
      updateContinueButton();

      if (directChapter) {
        requestAnimationFrame(() => els.reader.scrollIntoView({ behavior: "smooth", block: "start" }));
      }
    } catch (error) {
      console.error(error);
      els.chapterContent.innerHTML = `<div class="story-error"><strong>Не удалось открыть текст.</strong><br>Обновите страницу или откройте <a href="story.html">полную версию книги</a>.</div>`;
      els.chapterTitle.textContent = "История недоступна";
      els.chapterList.innerHTML = '<p class="chapter-list-empty">Не удалось загрузить содержание.</p>';
    }
  }

  function updateContinueButton() {
    els.continueLabel.textContent = state.current > 1 ? `Продолжить с главы ${state.current}` : "Начать читать";
  }

  function filteredChapters() {
    const query = state.search.trim().toLocaleLowerCase("ru");
    return state.chapters.filter(chapter => {
      if (state.onlyBookmarks && !state.bookmarks.includes(chapter.number)) return false;
      if (!query) return true;
      if (/^\d{1,2}$/.test(query)) return String(chapter.number).includes(query);
      return chapter.searchText.includes(query);
    });
  }

  function excerptFor(chapter, query) {
    if (!query || /^\d{1,2}$/.test(query)) return `${chapter.minutes} мин · ${chapter.words.toLocaleString("ru-RU")} слов`;
    const lowerText = chapter.text.toLocaleLowerCase("ru");
    const position = lowerText.indexOf(query.toLocaleLowerCase("ru"));
    if (position < 0) return `${chapter.minutes} мин чтения`;
    const start = Math.max(0, position - 36);
    const end = Math.min(chapter.text.length, position + query.length + 48);
    return `${start ? "…" : ""}${chapter.text.slice(start, end).trim()}${end < chapter.text.length ? "…" : ""}`;
  }

  function renderChapterList() {
    const chapters = filteredChapters();
    if (!chapters.length) {
      els.chapterList.innerHTML = '<p class="chapter-list-empty">Ничего не найдено. Попробуйте другое слово или отключите фильтр закладок.</p>';
      return;
    }

    const query = state.search.trim();
    els.chapterList.innerHTML = chapters.map(chapter => {
      const isActive = chapter.number === state.current;
      const isBookmarked = state.bookmarks.includes(chapter.number);
      return `
        <button class="chapter-item${isActive ? " active" : ""}${isBookmarked ? " bookmarked" : ""}" type="button" data-chapter="${chapter.number}">
          <span class="chapter-number">${String(chapter.number).padStart(2, "0")}</span>
          <span class="chapter-item-copy">
            <strong>${escapeHTML(chapter.title)}</strong>
            <small>${escapeHTML(excerptFor(chapter, query))}</small>
          </span>
          <span class="chapter-star" aria-label="В закладках">◆</span>
        </button>`;
    }).join("");
  }

  function saveCurrentPosition() {
    if (!state.ready) return;
    state.scrolls[state.current] = Math.round(els.readerPanel.scrollTop);
    localStorage.setItem(STORAGE.scrolls, JSON.stringify(state.scrolls));
    els.savedStatus.textContent = `Глава ${state.current} сохранена`;
  }

  function decorateChapter() {
    const paragraphs = [...els.chapterContent.querySelectorAll(":scope > p")];
    paragraphs.forEach(paragraph => {
      const text = paragraph.textContent.trim();
      if (text.startsWith("Котик:")) paragraph.classList.add("chat-line", "cat-message");
      if (text.startsWith("Лисёнок:")) paragraph.classList.add("chat-line", "fox-message");
    });

    if (paragraphs[0]?.classList.contains("chat-line")) {
      paragraphs[0].style.setProperty("clear", "both");
    }

    insertChapterScenes(paragraphs);
  }

  function scenePath(chapter, slot) {
    const chapterId = String(chapter).padStart(2, "0");
    return `assets/scenes/ch${chapterId}-${slot === 0 ? "a" : "b"}.webp`;
  }

  function createSceneFigure(chapter, slot) {
    const caption = SCENE_CAPTIONS[chapter - 1]?.[slot] || `Кадр главы ${chapter}`;
    const figure = document.createElement("figure");
    figure.className = `chapter-scene chapter-scene-${slot === 0 ? "wide" : "inset"}`;

    const button = document.createElement("button");
    button.className = "chapter-scene-button";
    button.type = "button";
    button.dataset.sceneChapter = String(chapter);
    button.dataset.sceneSlot = String(slot);
    button.setAttribute("aria-label", `Открыть кадр: ${caption}`);

    const image = document.createElement("img");
    image.src = scenePath(chapter, slot);
    image.alt = `${caption}. Лица людей не показаны.`;
    image.loading = "lazy";
    image.decoding = "async";
    image.width = 960;
    image.height = 540;

    const icon = document.createElement("span");
    icon.className = "chapter-scene-expand";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "↗";

    button.append(image, icon);

    const figcaption = document.createElement("figcaption");
    figcaption.innerHTML = `<span>Кадр ${String(slot + 1).padStart(2, "0")}</span><strong>${escapeHTML(caption)}</strong>`;
    figure.append(button, figcaption);
    return figure;
  }

  function insertChapterScenes(paragraphs) {
    if (!paragraphs.length) return;
    const firstScene = createSceneFigure(state.current, 0);
    const secondScene = createSceneFigure(state.current, 1);
    const firstAnchor = paragraphs[Math.min(5, Math.max(1, Math.floor(paragraphs.length * .12)))];
    const secondAnchor = paragraphs[Math.min(paragraphs.length - 1, Math.max(4, Math.floor(paragraphs.length * .62)))];
    firstAnchor.after(firstScene);
    secondAnchor.after(secondScene);
  }

  function openSceneLightbox(chapter, slot) {
    const normalizedSlot = slot === 1 ? 1 : 0;
    const caption = SCENE_CAPTIONS[chapter - 1]?.[normalizedSlot] || `Кадр главы ${chapter}`;
    sceneState.chapter = chapter;
    sceneState.slot = normalizedSlot;
    els.sceneLightboxImage.src = scenePath(chapter, normalizedSlot);
    els.sceneLightboxImage.alt = `${caption}. Лица людей не показаны.`;
    els.sceneLightboxCaption.textContent = caption;
    els.sceneLightboxMeta.textContent = `Глава ${chapter} · кадр ${normalizedSlot + 1} из 2`;
    els.sceneLightbox.classList.add("open");
    els.sceneLightbox.setAttribute("aria-hidden", "false");
    els.sceneLightboxClose.focus();
  }

  function closeSceneLightbox() {
    els.sceneLightbox.classList.remove("open");
    els.sceneLightbox.setAttribute("aria-hidden", "true");
  }

  function updateBookmarkButton() {
    const bookmarked = state.bookmarks.includes(state.current);
    els.bookmarkButton.classList.toggle("active", bookmarked);
    els.bookmarkButton.setAttribute("aria-label", bookmarked ? "Убрать главу из закладок" : "Добавить главу в закладки");
  }

  function updateChapterNav() {
    const previous = state.current - 1;
    const next = state.current + 1;

    els.previousChapter.disabled = state.current === 1;
    els.nextChapter.disabled = state.current === state.chapters.length;
    els.previousLabel.textContent = state.current === 1 ? "Начало книги" : `Глава ${previous}`;
    els.nextLabel.textContent = state.current === state.chapters.length ? "Конец первой части" : `Глава ${next}`;
  }

  function selectChapter(number, options = {}) {
    if (!state.ready) return;
    const chapterNumber = clamp(Number(number), 1, state.chapters.length);
    const chapter = state.chapters[chapterNumber - 1];

    if (chapterNumber !== state.current) saveCurrentPosition();
    state.current = chapterNumber;
    localStorage.setItem(STORAGE.chapter, String(chapterNumber));

    els.chapterTitle.textContent = chapter.title;
    els.chapterOverline.textContent = getPart(chapterNumber);
    els.chapterReadTime.textContent = `${chapter.minutes} ${plural(chapter.minutes, "минута", "минуты", "минут")} чтения`;
    els.chapterWordCount.textContent = `${chapter.words.toLocaleString("ru-RU")} слов`;
    els.toolbarChapter.textContent = `Глава ${chapterNumber} из ${state.chapters.length}`;
    els.chapterContent.innerHTML = chapter.html;
    decorateChapter();
    updateChapterNav();
    updateBookmarkButton();
    updateContinueButton();
    renderChapterList();

    const restorePosition = options.restore ? Number(state.scrolls[chapterNumber]) || 0 : 0;
    requestAnimationFrame(() => {
      els.readerPanel.scrollTop = restorePosition;
      updateReadingProgress();
      els.chapterList.querySelector(".chapter-item.active")?.scrollIntoView({ block: "nearest" });
    });

    if (options.animate !== false && els.chapterContent.animate) {
      els.chapterContent.animate([
        { opacity: 0, transform: "translateY(10px)" },
        { opacity: 1, transform: "translateY(0)" }
      ], { duration: 360, easing: "cubic-bezier(.22,1,.36,1)" });
    }

    if (options.updateHash !== false) {
      history.replaceState(null, "", `#chapter-${chapterNumber}`);
    }

    document.title = `${chapter.title} — Семь минут`;
    closeSidebar();
  }

  function plural(value, one, few, many) {
    const mod10 = value % 10;
    const mod100 = value % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }

  function toggleBookmark() {
    const position = state.bookmarks.indexOf(state.current);
    if (position >= 0) {
      state.bookmarks.splice(position, 1);
      showToast(`Глава ${state.current} удалена из закладок`);
    } else {
      state.bookmarks.push(state.current);
      state.bookmarks.sort((a, b) => a - b);
      showToast(`Глава ${state.current} добавлена в закладки`);
    }
    localStorage.setItem(STORAGE.bookmarks, JSON.stringify(state.bookmarks));
    updateBookmarkButton();
    renderChapterList();
  }

  function updateReadingProgress() {
    const max = els.readerPanel.scrollHeight - els.readerPanel.clientHeight;
    const progress = max > 0 ? clamp((els.readerPanel.scrollTop / max) * 100, 0, 100) : 100;
    els.readingProgress.style.width = `${progress}%`;

    clearTimeout(state.scrollSaveTimer);
    state.scrollSaveTimer = setTimeout(saveCurrentPosition, 220);
  }

  function updatePageProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const progress = max > 0 ? clamp((window.scrollY / max) * 100, 0, 100) : 0;
    els.pageProgress.style.width = `${progress}%`;
    els.header.classList.toggle("scrolled", window.scrollY > 28);
  }

  function openSidebar() {
    els.body.classList.add("sidebar-open");
    setTimeout(() => els.chapterSearch.focus(), 250);
  }

  function closeSidebar() {
    els.body.classList.remove("sidebar-open");
  }

  function openReaderAt(chapter, restore = false) {
    selectChapter(chapter, { restore, updateHash: true });
    requestAnimationFrame(() => els.reader.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function toggleFocusMode() {
    const active = els.body.classList.toggle("focus-mode");
    els.focusButton.classList.toggle("active", active);
    els.focusButton.setAttribute("aria-label", active ? "Выйти из режима без отвлечений" : "Режим без отвлечений");
    showToast(active ? "Режим без отвлечений включён" : "Обычный режим включён");
  }

  function bindEvents() {
    els.themeToggle.addEventListener("click", () => {
      const next = els.html.dataset.theme === "dark" ? "light" : "dark";
      setTheme(next);
      showToast(next === "dark" ? "Тёмная тема" : "Светлая тема");
    });

    els.continueReading.addEventListener("click", event => {
      event.preventDefault();
      openReaderAt(state.current, true);
    });

    document.querySelectorAll("[data-open-chapter]").forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        openReaderAt(Number(link.dataset.openChapter), false);
      });
    });

    els.chapterList.addEventListener("click", event => {
      const button = event.target.closest("[data-chapter]");
      if (button) selectChapter(Number(button.dataset.chapter));
    });

    els.chapterContent.addEventListener("click", event => {
      const button = event.target.closest("[data-scene-chapter]");
      if (!button) return;
      openSceneLightbox(Number(button.dataset.sceneChapter), Number(button.dataset.sceneSlot));
    });

    els.sceneLightboxClose.addEventListener("click", closeSceneLightbox);
    els.sceneLightbox.addEventListener("click", event => {
      if (event.target === els.sceneLightbox) closeSceneLightbox();
    });

    els.chapterSearch.addEventListener("input", event => {
      state.search = event.target.value;
      renderChapterList();
    });

    els.bookmarkFilter.addEventListener("click", () => {
      state.onlyBookmarks = !state.onlyBookmarks;
      els.bookmarkFilter.classList.toggle("active", state.onlyBookmarks);
      els.bookmarkFilter.textContent = state.onlyBookmarks ? "Показать все главы" : "Только закладки";
      renderChapterList();
    });

    els.bookmarkButton.addEventListener("click", toggleBookmark);
    els.fontDecrease.addEventListener("click", () => setFontSize(state.fontSize - 1, true));
    els.fontIncrease.addEventListener("click", () => setFontSize(state.fontSize + 1, true));
    els.focusButton.addEventListener("click", toggleFocusMode);
    els.previousChapter.addEventListener("click", () => selectChapter(state.current - 1));
    els.nextChapter.addEventListener("click", () => selectChapter(state.current + 1));
    els.menuButton.addEventListener("click", openSidebar);
    els.sidebarClose.addEventListener("click", closeSidebar);
    els.backdrop.addEventListener("click", closeSidebar);

    els.readerPanel.addEventListener("scroll", updateReadingProgress, { passive: true });
    window.addEventListener("scroll", updatePageProgress, { passive: true });
    window.addEventListener("resize", () => {
      if (window.innerWidth > 800) closeSidebar();
      updatePageProgress();
      updateReadingProgress();
    });

    window.addEventListener("hashchange", () => {
      const chapter = getHashChapter();
      if (chapter && state.ready && chapter !== state.current) selectChapter(chapter, { updateHash: false });
    });

    window.addEventListener("beforeunload", saveCurrentPosition);

    document.addEventListener("keydown", event => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName || "");
      if (event.key === "/" && !typing) {
        event.preventDefault();
        openSidebar();
        els.chapterSearch.focus();
      }
      if (event.key === "Escape") {
        if (els.sceneLightbox.classList.contains("open")) closeSceneLightbox();
        else if (els.body.classList.contains("sidebar-open")) closeSidebar();
        else if (els.body.classList.contains("focus-mode")) toggleFocusMode();
      }
      if (!typing && state.ready && els.body.classList.contains("focus-mode")) {
        if (event.key === "ArrowLeft" && state.current > 1) selectChapter(state.current - 1);
        if (event.key === "ArrowRight" && state.current < state.chapters.length) selectChapter(state.current + 1);
      }
    });
  }

  function init() {
    const savedTheme = localStorage.getItem(STORAGE.theme);
    setTheme(savedTheme || "dark", false);
    setFontSize(state.fontSize);
    updateContinueButton();
    updatePageProgress();
    els.footerYear.textContent = `© ${new Date().getFullYear()}`;
    bindEvents();
    loadStory();

    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
    }
  }

  init();
})();
