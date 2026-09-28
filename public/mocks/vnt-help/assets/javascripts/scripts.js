(function () {
  var searchInput = document.getElementById("search-input");
  if (!searchInput) {
    document.getElementById("copyright_year").innerHTML =
      new Date().getFullYear();
    return;
  }

  var resultsContainer = document.getElementById("results-container");
  var searchData = [];
  var debounceTimer = null;

  // Load search data and build section index
  var jsonUrl = document.currentScript.src.replace(/assets\/javascripts\/scripts\.js.*$/, 'search.json');
  var xhr = new XMLHttpRequest();
  xhr.open("GET", jsonUrl, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      var pages = JSON.parse(xhr.responseText);
      searchData = buildIndex(pages);
    }
  };
  xhr.send();

  /**
   * Returns true when the URL points to the home page (or one of its anchors).
   * The home page URL ends in `/` (e.g. `index.html` or `index.html#section`), while
   * topic pages end in `.html` (e.g. `topics/page-01.html`).
   */
  function isHomePage(url) {
    if (!url) return false;
    var hashIdx = url.indexOf("#");
    var base = hashIdx === -1 ? url : url.substring(0, hashIdx);
    return base.charAt(base.length - 1) === "/";
  }

  /**
   * Builds the in-memory search index from the raw pages JSON, repairing bad
   * titles produced by Liquid heading extraction. Entries that belong to the
   * home page are skipped so the search never surfaces results from the page
   * the user is already on.
   */
  function buildIndex(pages) {
    var entries = [];
    for (var i = 0; i < pages.length; i++) {
      var page = pages[i];
      if (!page.title) continue;
      if (isHomePage(page.url)) continue;

      // Fix bad titles (e.g., "###" from Liquid extraction issues)
      var title = page.title;
      if (/^#+$/.test(title.trim()) || title.trim().length < 3) {
        // Use first meaningful words from content as title
        var words = (page.content || "").trim().split(/\s+/).slice(0, 5).join(" ");
        title = words || title;
      }
      page.title = title;

      // Add page-level entry
      entries.push({
        title: page.title,
        category: page.category || page.title,
        url: page.url,
        content: page.content || "",
        tags: page.tags || "",
        isPage: true,
      });
    }
    return entries;
  }

  /**
   * Scores an entry by where the full query phrase appears (title, tags,
   * content), with a small boost for page-level entries. Returns 0 when the
   * phrase doesn't appear at all — the words must occur together, in the
   * exact sequence typed.
   */
  function scoreResult(entry, phrase) {
    var titleLower = entry.title.toLowerCase();
    var contentLower = entry.content.toLowerCase();
    var tagsLower = (entry.tags || "").toLowerCase();

    var titleHit = titleLower.indexOf(phrase) !== -1;
    var tagsHit = tagsLower.indexOf(phrase) !== -1;
    var contentMatches = contentLower.indexOf(phrase) === -1
      ? 0
      : contentLower.split(phrase).length - 1;

    if (!titleHit && !tagsHit && contentMatches === 0) {
      return 0;
    }

    var score = 0;
    if (titleLower === phrase) {
      score += 100;
    } else if (titleHit) {
      score += 50;
    }

    if (tagsHit) {
      score += 30;
    }

    score += Math.min(contentMatches, 10) * 2;

    if (entry.isPage) {
      score += 5;
    }

    return score;
  }

  /**
   * Returns a content excerpt centered on the first occurrence of `phrase`,
   * with the page title trimmed off the start to avoid duplication.
   */
  function getSnippet(content, phrase, title, maxLen) {
    maxLen = maxLen || 300;

    // Remove title from the beginning of content to avoid repetition
    if (title) {
      var titleLower = title.toLowerCase();
      var contentTrimmed = content.trimStart();
      if (contentTrimmed.toLowerCase().indexOf(titleLower) === 0) {
        content = contentTrimmed.substring(title.length).trimStart();
      }
    }

    var bestPos = content.toLowerCase().indexOf(phrase);

    if (bestPos === -1) {
      return content.substring(0, maxLen) + (content.length > maxLen ? "…" : "");
    }

    var start = Math.max(0, bestPos - 40);
    var end = Math.min(content.length, start + maxLen);
    var snippet = content.substring(start, end);

    if (start > 0) snippet = "…" + snippet;
    if (end < content.length) snippet = snippet + "…";

    return snippet;
  }

  /** Wraps every occurrence of `phrase` in `<mark>` tags (case-insensitive). */
  function highlightPhrase(text, phrase) {
    if (!phrase) return text;
    var regex = new RegExp(
      "(" + phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")",
      "gi"
    );
    return text.replace(regex, "<mark>$1</mark>");
  }

  /**
   * Runs the search against the index and renders the top 8 results into the
   * results container. Clears results for queries shorter than 2 chars. The
   * query is treated as a single phrase — entries are only returned when they
   * contain the words together, in the exact sequence typed.
   */
  function search(query) {
    if (!query || query.trim().length < 2) {
      resultsContainer.innerHTML = "";
      return;
    }

    var phrase = query.toLowerCase().trim();
    var results = [];

    for (var i = 0; i < searchData.length; i++) {
      var entry = searchData[i];
      var score = scoreResult(entry, phrase);
      if (score > 0) {
        results.push({ entry: entry, score: score });
      }
    }

    // Sort by score descending
    results.sort(function (a, b) {
      return b.score - a.score;
    });

    // Limit results
    results = results.slice(0, 8);

    // Render
    if (results.length === 0) {
      resultsContainer.innerHTML =
        '<li class="no-results">No Results Found</li>';
      return;
    }

    var html = "";
    for (var i = 0; i < results.length; i++) {
      var r = results[i].entry;
      var snippet = getSnippet(r.content, phrase, r.title);
      var highlightedTitle = highlightPhrase(escapeHtml(r.title), phrase);
      var highlightedSnippet = highlightPhrase(escapeHtml(snippet), phrase);
      var category = r.category || "";

      html += '<li>';
      html += '<a href="' + withHighlightParam(r.url, phrase) + '">';
      html += '<span class="search-result-title">' + highlightedTitle + "</span>";
      html += '<span class="search-result-meta">';
      if (category) {
        html += '<span class="search-result-category">' + escapeHtml(category) + ': </span>';
      }
      html += '<span class="search-result-snippet">&ldquo;' + highlightedSnippet + '&rdquo;</span>';
      html += '</span>';
      html += "</a></li>";
    }

    resultsContainer.innerHTML = html;
  }

  /** Escapes HTML-special characters by leveraging the DOM. */
  function escapeHtml(text) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  /**
   * Inserts a `q` query param carrying the search phrase into `url`, ahead of
   * any `#anchor` (query strings must precede fragments). The target page's
   * sidebar search picks this up on load to highlight the matching text.
   */
  function withHighlightParam(url, phrase) {
    var hashIdx = url.indexOf("#");
    var base = hashIdx === -1 ? url : url.substring(0, hashIdx);
    var hash = hashIdx === -1 ? "" : url.substring(hashIdx);
    var sep = base.indexOf("?") === -1 ? "?" : "&";
    return base + sep + "q=" + encodeURIComponent(phrase) + hash;
  }

  // Clear button
  var clearBtn = document.getElementById("search-clear");

  /** Toggles the clear button's visibility based on current input value. */
  function updateClearButton() {
    if (clearBtn) {
      clearBtn.style.display = searchInput.value ? "block" : "none";
    }
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {
      searchInput.value = "";
      resultsContainer.innerHTML = "";
      updateClearButton();
      searchInput.focus();
    });
  }

  // Debounced input handler
  searchInput.addEventListener("input", function () {
    updateClearButton();
    clearTimeout(debounceTimer);
    var query = searchInput.value;
    debounceTimer = setTimeout(function () {
      search(query);
    }, 200);
  });

  // Close results on outside click
  document.addEventListener("click", function (e) {
    if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target) && (!clearBtn || !clearBtn.contains(e.target))) {
      resultsContainer.innerHTML = "";
    }
  });

  // Copyright year
  document.getElementById("copyright_year").innerHTML =
    new Date().getFullYear();
})();

// Auto-generated Table of Contents for side-bar layout
(function () {
  var sidebar = document.getElementById("auto-toc");
  if (!sidebar) return;

  var main = document.querySelector(".main");
  if (!main) return;

  var headings = main.querySelectorAll("h2, h3, h4, h5, h6");
  if (headings.length === 0) return;

  // While the page is smooth-scrolling to an anchor (TOC click, hashchange,
  // initial load), the IntersectionObserver below would clobber the
  // click-driven active item with whichever heading settles in the band.
  // Suppress it for the duration of the smooth-scroll animation.
  var scrollSpySuppressedUntil = 0;
  /** Pauses observer-driven `setActive` calls for ~1s (covers smooth scroll). */
  function suppressScrollSpy() {
    scrollSpySuppressedUntil = Date.now() + 1000;
  }

  /**
   * Resolves a heading's anchor from `<a name>`, then `id`, falling back to a
   * slug derived from the heading text (which is also assigned as `id`).
   */
  function getAnchor(h) {
    var a = h.querySelector('a[name]');
    if (a) return a.getAttribute("name");
    if (h.id) return h.id;
    var slug = h.textContent
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    h.id = slug;
    return slug;
  }

  /** Returns the heading's trimmed visible text. */
  function getText(h) {
    return h.textContent.trim();
  }

  // Build hierarchical tree from flat heading list
  var tree = [];
  var stack = [{ level: 1, children: tree }];

  Array.prototype.forEach.call(headings, function (h) {
    var level = parseInt(h.tagName.charAt(1), 10);
    var item = {
      level: level,
      text: getText(h),
      anchor: getAnchor(h),
      element: h,
      children: [],
    };

    while (stack.length > 1 && stack[stack.length - 1].level >= level) {
      stack.pop();
    }
    stack[stack.length - 1].children.push(item);
    stack.push(item);
  });

  /**
   * Recursively builds the nested `<ul>`/`<li>` tree for the TOC, wiring up
   * toggle/expand handlers and per-link scroll-spy suppression.
   */
  function renderList(items) {
    var ul = document.createElement("ul");
    ul.className = "tree-children";
    items.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "tree-node";
      li.dataset.anchor = item.anchor;
      li.dataset.level = item.level;

      var hasChildren = item.children.length > 0;

      var row = document.createElement("div");
      row.className = "tree-row";

      var toggle = document.createElement("span");
      toggle.className = "tree-toggle";
      if (hasChildren) {
        toggle.innerHTML = "&#9656;"; // ▸
        toggle.addEventListener("click", function (e) {
          e.stopPropagation();
          e.preventDefault();
          suppressScrollSpy();
          li.classList.toggle("expanded");
        });
      } else {
        toggle.classList.add("tree-toggle-leaf");
      }
      row.appendChild(toggle);

      var link = document.createElement("a");
      link.className = "tree-label";
      link.href = "#" + item.anchor;
      link.textContent = item.text;
      link.addEventListener("click", function () {
        suppressScrollSpy();
        if (hasChildren) li.classList.toggle("expanded");
      });
      row.appendChild(link);

      li.appendChild(row);

      if (hasChildren) {
        var childUl = renderList(item.children);
        li.appendChild(childUl);
      }

      ul.appendChild(li);
    });
    return ul;
  }

  sidebar.appendChild(renderList(tree));

  /** Adds the `expanded` class to every ancestor `<li>` up to the sidebar root. */
  function expandAncestors(li) {
    var parent = li.parentElement;
    while (parent && parent !== sidebar) {
      if (parent.tagName === "LI" && !parent.classList.contains("expanded")) {
        parent.classList.add("expanded");
      }
      parent = parent.parentElement;
    }
  }

  /**
   * Expands the active item's ancestor chain (and the active item itself if it
   * has children) and collapses every other branch, keeping the tree focused
   * on the currently active section.
   */
  function syncTreeExpansion(activeLi) {
    var keepExpanded = new Set();
    keepExpanded.add(activeLi);
    var parent = activeLi.parentElement;
    while (parent && parent !== sidebar) {
      if (parent.tagName === "LI") keepExpanded.add(parent);
      parent = parent.parentElement;
    }
    var allLis = sidebar.querySelectorAll("li.tree-node");
    Array.prototype.forEach.call(allLis, function (li) {
      if (keepExpanded.has(li)) {
        li.classList.add("expanded");
      } else {
        li.classList.remove("expanded");
      }
    });
  }

  /**
   * Marks the TOC `<li>` matching `anchor` as active. When `expand` is true,
   * also syncs the tree so the active item's ancestors are expanded and every
   * other branch is collapsed.
   */
  function setActive(anchor, expand) {
    var prev = sidebar.querySelectorAll("li.active");
    Array.prototype.forEach.call(prev, function (li) {
      li.classList.remove("active");
    });
    var safeAnchor = window.CSS && CSS.escape ? CSS.escape(anchor) : anchor.replace(/["\\]/g, "\\$&");
    var current = sidebar.querySelector('li[data-anchor="' + safeAnchor + '"]');
    if (current) {
      current.classList.add("active");
      if (expand) syncTreeExpansion(current);
    }
  }

  // Track active section on scroll (highlight + auto-expand active branch).
  // When the on-page search has a query, expansion is frozen so the tree
  // doesn't reshuffle while the user scans matches.
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        if (Date.now() < scrollSpySuppressedUntil) return;
        var searchEl = document.getElementById("toc-search");
        var freeze = !!(searchEl && searchEl.value);
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var h = entry.target;
            var a = h.querySelector("a[name]");
            var anchor = a ? a.getAttribute("name") : h.id;
            if (anchor) setActive(anchor, !freeze);
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    Array.prototype.forEach.call(headings, function (h) {
      observer.observe(h);
    });
  }

  /** Syncs the active TOC item with the current URL hash, suppressing scroll-spy. */
  function handleHashNavigation() {
    if (window.location.hash) {
      suppressScrollSpy();
      setActive(window.location.hash.slice(1), true);
    }
  }
  window.addEventListener("hashchange", handleHashNavigation);
  handleHashNavigation();

  // Search functionality
  var searchInput = document.getElementById("toc-search");
  var searchClear = document.getElementById("toc-search-clear");
  var searchPrev = document.getElementById("toc-search-prev");
  var searchNext = document.getElementById("toc-search-next");
  var searchCounter = document.getElementById("toc-search-counter");
  if (!searchInput) return;

  /** Escapes HTML-special characters by leveraging the DOM. */
  function escapeHtml(text) {
    var div = document.createElement("div");
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
  }

  /** Escapes regex meta-characters in a user-supplied query string. */
  function escapeRegExp(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  // Body content index for in-page text search.
  // Rebuilt before each filter so we always operate on fresh text-node refs
  // (wrapping matches in <mark> splits text nodes; unhighlightBody normalizes
  // them back, but the original references become stale).
  var bodyIndex = []; // [{ anchor, textNodes }]
  var bodyMarks = [];

  /**
   * Walks `main` in document order, splitting on h2-h6 boundaries, and
   * collects the text nodes belonging to each section. Skips text inside
   * scripts, styles, existing <mark> tags, and headings themselves.
   */
  function buildBodyIndex() {
    bodyIndex = [];
    if (!main) return;
    var walker = document.createTreeWalker(
      main,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      null,
      false
    );
    var current = null;
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 1) {
        if (/^H[2-6]$/.test(node.tagName)) {
          var anchor = getAnchor(node);
          if (anchor) {
            current = { anchor: anchor, textNodes: [] };
            bodyIndex.push(current);
          }
        }
      } else if (node.nodeType === 3 && current) {
        if (!node.nodeValue || !/\S/.test(node.nodeValue)) continue;
        var p = node.parentElement;
        var skip = false;
        while (p && p !== main) {
          var t = p.tagName;
          if (t === "SCRIPT" || t === "STYLE" || t === "MARK" || t === "NOSCRIPT" || /^H[1-6]$/.test(t)) {
            skip = true;
            break;
          }
          p = p.parentElement;
        }
        if (skip) continue;
        current.textNodes.push(node);
      }
    }
  }

  /** Unwraps every tracked <mark> in the body, merging adjacent text nodes back. */
  function unhighlightBody() {
    for (var i = 0; i < bodyMarks.length; i++) {
      var m = bodyMarks[i];
      if (m.parentNode) {
        var parent = m.parentNode;
        parent.replaceChild(document.createTextNode(m.textContent), m);
        parent.normalize();
      }
    }
    bodyMarks = [];
  }

  /**
   * Wraps every occurrence of `query` (case-insensitive) inside body text
   * nodes with <mark> elements, returns a per-section count map keyed by
   * heading anchor.
   */
  function highlightAndCountBody(query) {
    var q = query.toLowerCase();
    var counts = {};
    for (var s = 0; s < bodyIndex.length; s++) {
      var section = bodyIndex[s];
      var sectionCount = 0;
      var nodes = section.textNodes.slice();
      for (var i = 0; i < nodes.length; i++) {
        var tn = nodes[i];
        if (!tn.parentNode) continue;
        var text = tn.nodeValue;
        var lower = text.toLowerCase();
        if (lower.indexOf(q) === -1) continue;

        var frag = document.createDocumentFragment();
        var start = 0;
        var idx;
        while ((idx = lower.indexOf(q, start)) !== -1) {
          if (idx > start) frag.appendChild(document.createTextNode(text.slice(start, idx)));
          var mark = document.createElement("mark");
          mark.className = "body-search-match";
          mark.textContent = text.slice(idx, idx + q.length);
          frag.appendChild(mark);
          bodyMarks.push(mark);
          sectionCount++;
          start = idx + q.length;
        }
        if (start < text.length) frag.appendChild(document.createTextNode(text.slice(start)));
        tn.parentNode.replaceChild(frag, tn);
      }
      if (sectionCount > 0) counts[section.anchor] = sectionCount;
    }
    return counts;
  }

  /** Removes any `<mark>` highlights left in the TOC labels. */
  function clearHighlights() {
    var labels = sidebar.querySelectorAll(".tree-label");
    Array.prototype.forEach.call(labels, function (l) {
      l.innerHTML = escapeHtml(l.textContent);
    });
  }

  /** Restores the TOC and body to their un-filtered state. */
  function resetTree() {
    var nodes = sidebar.querySelectorAll(".tree-node");
    Array.prototype.forEach.call(nodes, function (n) {
      n.classList.remove("hidden", "match", "match-body", "expanded");
      n.removeAttribute("data-body-match-count");
    });
    clearHighlights();
    unhighlightBody();
  }

  /**
   * Filters the TOC by `query`, hiding non-matching nodes and revealing
   * ancestors plus descendants of any heading or body match. Highlights
   * matches in the body content and badges TOC nodes whose section has
   * body matches. Resets the tree for empty queries.
   */
  function filterTree(query) {
    if (!query || query.length < 2) {
      resetTree();
      updateClearBtn();
      return;
    }

    var q = query.toLowerCase();
    var nodes = sidebar.querySelectorAll(".tree-node");

    // Reset visibility/state and clear body marks before re-walking
    Array.prototype.forEach.call(nodes, function (n) {
      n.classList.add("hidden");
      n.classList.remove("match", "match-body", "expanded");
      n.removeAttribute("data-body-match-count");
    });
    unhighlightBody();
    buildBodyIndex();

    function reveal(li) {
      li.classList.remove("hidden");
      var parent = li.parentElement;
      while (parent && parent !== sidebar) {
        if (parent.tagName === "LI") {
          parent.classList.remove("hidden");
          parent.classList.add("expanded");
        }
        parent = parent.parentElement;
      }
      var descendants = li.querySelectorAll(".tree-node");
      Array.prototype.forEach.call(descendants, function (d) {
        d.classList.remove("hidden");
      });
    }

    // Pass 1: heading matches
    var headingMatched = {};
    Array.prototype.forEach.call(nodes, function (n) {
      var label = n.querySelector(".tree-label");
      var text = label.textContent;
      if (text.toLowerCase().indexOf(q) !== -1) {
        n.classList.add("match");
        var regex = new RegExp("(" + escapeRegExp(query) + ")", "gi");
        label.innerHTML = escapeHtml(text).replace(regex, "<mark>$1</mark>");
        reveal(n);
        if (n.dataset.anchor) headingMatched[n.dataset.anchor] = true;
      }
    });

    // Pass 2: body matches — highlight, count per section, reveal indirect TOC nodes
    var bodyCounts = highlightAndCountBody(query);
    Object.keys(bodyCounts).forEach(function (anchor) {
      var sel = '[data-anchor="' + anchor.replace(/"/g, '\\"') + '"]';
      var node = sidebar.querySelector(sel);
      if (!node) return;
      node.setAttribute("data-body-match-count", bodyCounts[anchor]);
      if (!headingMatched[anchor]) {
        node.classList.add("match-body");
        reveal(node);
      }
    });

    // Clear label highlights for non-heading-matches
    Array.prototype.forEach.call(nodes, function (n) {
      if (!n.classList.contains("match")) {
        var label = n.querySelector(".tree-label");
        label.innerHTML = escapeHtml(label.textContent);
      }
    });

    updateClearBtn();
  }

  /** Toggles the TOC clear button's visibility based on current input value. */
  function updateClearBtn() {
    var visible = !!searchInput.value;
    if (searchClear) searchClear.style.display = visible ? "block" : "none";
    if (searchPrev) searchPrev.style.display = visible ? "block" : "none";
    if (searchNext) searchNext.style.display = visible ? "block" : "none";
    updateCounter();
  }

  /** Updates the "N / total" match counter next to the navigation arrows. */
  function updateCounter() {
    if (!searchCounter) return;
    if (!searchInput.value || !bodyMarks.length) {
      searchCounter.textContent = "";
      searchCounter.style.display = "none";
      return;
    }
    var pos = currentMatchIdx >= 0 ? currentMatchIdx + 1 : 0;
    searchCounter.textContent = pos + "/" + bodyMarks.length;
    searchCounter.style.display = "inline-block";
  }

  // Body-match cursor for prev/next navigation
  var currentMatchIdx = -1;

  /** Removes the `current-match` class from every tracked body mark. */
  function clearCurrentMark() {
    for (var i = 0; i < bodyMarks.length; i++) {
      bodyMarks[i].classList.remove("current-match");
    }
  }

  /** Highlights the body mark at `idx` and scrolls it into view. */
  function focusMatch(idx) {
    if (!bodyMarks.length) return;
    if (idx < 0) idx = bodyMarks.length - 1;
    if (idx >= bodyMarks.length) idx = 0;
    clearCurrentMark();
    currentMatchIdx = idx;
    var target = bodyMarks[idx];
    target.classList.add("current-match");
    suppressScrollSpy();
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    updateCounter();
  }

  var debounceTimer = null;
  searchInput.addEventListener("input", function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(function () {
      filterTree(searchInput.value);
      currentMatchIdx = -1;
      updateCounter();
    }, 150);
  });

  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      e.preventDefault();
      focusMatch(e.shiftKey ? currentMatchIdx - 1 : currentMatchIdx + 1);
    }
  });

  if (searchPrev) {
    searchPrev.addEventListener("click", function () {
      focusMatch(currentMatchIdx - 1);
      searchInput.focus();
    });
  }

  if (searchNext) {
    searchNext.addEventListener("click", function () {
      focusMatch(currentMatchIdx + 1);
      searchInput.focus();
    });
  }

  if (searchClear) {
    searchClear.addEventListener("click", function () {
      searchInput.value = "";
      resetTree();
      currentMatchIdx = -1;
      updateClearBtn();
      searchInput.focus();
    });
  }
  updateClearBtn();

  /** Reads a query-string parameter's decoded value by name, or null if absent. */
  function getQueryParam(name) {
    var match = new RegExp("(?:^|[?&])" + name + "=([^&]*)").exec(window.location.search);
    return match ? decodeURIComponent(match[1].replace(/\+/g, " ")) : null;
  }

  /**
   * Wraps every occurrence of `query` in <mark> within `section`'s text nodes.
   * Mirrors highlightAndCountBody's wrapping, scoped to one section only.
   */
  function highlightSection(section, q) {
    var marks = [];
    var nodes = section.textNodes.slice();
    for (var i = 0; i < nodes.length; i++) {
      var tn = nodes[i];
      if (!tn.parentNode) continue;
      var text = tn.nodeValue;
      var lower = text.toLowerCase();
      if (lower.indexOf(q) === -1) continue;

      var frag = document.createDocumentFragment();
      var start = 0;
      var idx;
      while ((idx = lower.indexOf(q, start)) !== -1) {
        if (idx > start) frag.appendChild(document.createTextNode(text.slice(start, idx)));
        var mark = document.createElement("mark");
        mark.className = "body-search-match";
        mark.textContent = text.slice(idx, idx + q.length);
        frag.appendChild(mark);
        marks.push(mark);
        bodyMarks.push(mark);
        start = idx + q.length;
      }
      if (start < text.length) frag.appendChild(document.createTextNode(text.slice(start)));
      tn.parentNode.replaceChild(frag, tn);
    }
    return marks;
  }

  /**
   * Highlights just the specific answer the user picked from the home page
   * search results — the section named by `anchor`, or (lacking one) the
   * first section containing `query` — without touching the sidebar search
   * box, filtering the TOC, or highlighting matches elsewhere on the page.
   */
  function highlightIncomingResult(query, anchor) {
    buildBodyIndex();
    var q = query.toLowerCase();
    for (var s = 0; s < bodyIndex.length; s++) {
      var section = bodyIndex[s];
      if (anchor && section.anchor !== anchor) continue;
      var marks = highlightSection(section, q);
      if (marks.length) return marks;
      if (anchor) break;
    }
    return [];
  }

  // Carries over the term the user typed into the home page search bar: when
  // a result link includes a `q` param, highlight just that specific answer
  // and scroll to it, then strip the param from the address bar.
  var incomingQuery = getQueryParam("q");
  if (incomingQuery) {
    var incomingAnchor = window.location.hash ? window.location.hash.slice(1) : null;
    var incomingMarks = highlightIncomingResult(incomingQuery, incomingAnchor);
    bodyMarks.push.apply(bodyMarks, incomingMarks);
    if (incomingMarks.length) {
      incomingMarks[0].classList.add("current-match");
      suppressScrollSpy();
      incomingMarks[0].scrollIntoView({ behavior: "smooth", block: "center" });
    }
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, "", window.location.pathname + window.location.hash);
    }
  }
})();

// === TEST: home page feature trees ===
// Fetches each topic page client-side and builds its TOC tree using the same
// heading-extraction logic as the sidebar. Any new <h2>-<h6> added to a topic
// page automatically appears here on the next page load — no Liquid update
// needed. To revert: delete this entire IIFE block.
(function () {
  var containers = document.querySelectorAll(".home-feature-tree[data-source]");
  if (containers.length === 0) return;

  /**
   * Resolves a heading's anchor from `<a name>`, then `id`, falling back to a
   * slug derived from the heading text. Mirrors the sidebar's getAnchor.
   */
  function getAnchor(h) {
    var a = h.querySelector("a[name]");
    if (a) return a.getAttribute("name");
    if (h.id) return h.id;
    return h.textContent
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  /** Builds the hierarchical tree data structure from a flat heading list. */
  function buildTreeData(headings) {
    var tree = [];
    var stack = [{ level: 1, children: tree }];
    Array.prototype.forEach.call(headings, function (h) {
      var level = parseInt(h.tagName.charAt(1), 10);
      var item = {
        level: level,
        text: h.textContent.trim(),
        anchor: getAnchor(h),
        children: [],
      };
      while (stack.length > 1 && stack[stack.length - 1].level >= level) {
        stack.pop();
      }
      stack[stack.length - 1].children.push(item);
      stack.push(item);
    });
    return tree;
  }

  /** Renders the nested <ul>/<li> tree with toggle wiring and leaf detection. */
  function renderList(items, sourceUrl, isRoot) {
    var ul = document.createElement("ul");
    ul.className = isRoot ? "tree home-feature-tree-toc" : "tree-children";
    items.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "tree-node";
      li.setAttribute("data-level", item.level);

      var hasChildren = item.children.length > 0;

      var row = document.createElement("div");
      row.className = "tree-row";

      var toggle = document.createElement("span");
      toggle.className = "tree-toggle";
      if (hasChildren) {
        toggle.innerHTML = "&#9656;";
        toggle.addEventListener("click", function (e) {
          e.stopPropagation();
          e.preventDefault();
          li.classList.toggle("expanded");
        });
      } else {
        toggle.classList.add("tree-toggle-leaf");
      }
      row.appendChild(toggle);

      var link = document.createElement("a");
      link.className = "tree-label";
      link.href = item.anchor ? sourceUrl + "#" + item.anchor : "#";
      link.textContent = item.text;
      row.appendChild(link);

      li.appendChild(row);

      if (hasChildren) {
        li.appendChild(renderList(item.children, sourceUrl, false));
      }
      ul.appendChild(li);
    });
    return ul;
  }

  Array.prototype.forEach.call(containers, function (container) {
    var url = container.dataset.source;
    if (!url) return;

    var placeholder = container.querySelector(".home-feature-tree-toc");
    if (!placeholder) return;

    fetch(url)
      .then(function (resp) {
        if (!resp.ok) throw new Error(resp.status + ' ' + resp.statusText);
        return resp.text();
      })
      .then(function (html) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, "text/html");
        var main = doc.querySelector(".main");
        if (!main) return;
        var headings = main.querySelectorAll("h2, h3, h4, h5, h6");
        if (headings.length === 0) return;
        var data = buildTreeData(headings);
        var tree = renderList(data, url, true);
        placeholder.replaceWith(tree);
      })
      .catch(function (err) {
        console.warn("Failed to load TOC from " + url, err);
      });
  });
})();

