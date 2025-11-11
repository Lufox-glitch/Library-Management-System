document.addEventListener("DOMContentLoaded", () => {
  // Check if student is logged in
  const currentStudent = JSON.parse(localStorage.getItem("currentStudent"));
  if (!currentStudent) {
    window.location.href = "../Login-system/student-login.html";
    return;
  }

  // Populate user info
  document.getElementById("studentName").textContent = currentStudent.name;
  document.getElementById("studentEmail").textContent = currentStudent.email;
  document.getElementById("studentId").textContent = currentStudent.id;
  document.getElementById("welcomeName").textContent = currentStudent.name.split(" ")[0];

  // Logout handler
  document.getElementById("logoutBtn").addEventListener("click", () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("currentStudent");
      window.location.href = "../Login-system/student-login.html";
    }
  });

  // Load books from shared data
  if (typeof loadBooksToTable === 'function') {
    loadBooksToTable("booksTableBody");
  } else {
    console.error("loadBooksToTable function not found!");
  }

  // Search functionality
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  const clearBtn = document.getElementById("clearBtn");
  const tbody = document.getElementById("booksTableBody");
  const noResults = document.getElementById("noResults");
  const requestList = document.getElementById("requestList");

  function filterBooks(query) {
    const q = (query || "").trim().toLowerCase();
    const rows = Array.from(tbody.querySelectorAll("tr"));

    if (!q) {
      rows.forEach(r => r.style.display = "");
      noResults.style.display = "none";
      return;
    }

    let anyMatch = false;
    rows.forEach(r => {
      const text = (r.textContent || "").toLowerCase();
      const match = text.includes(q);
      r.style.display = match ? "" : "none";
      if (match) anyMatch = true;
    });

    noResults.style.display = anyMatch ? "none" : "block";
  }

  // Debounce helper
  function debounce(fn, wait = 150) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), wait);
    };
  }
  const debouncedFilter = debounce(e => filterBooks(e.target.value), 150);

  if (searchInput) {
    searchInput.addEventListener("input", debouncedFilter);
    searchInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        filterBooks(searchInput.value);
      } else if (e.key === "Escape") {
        searchInput.value = "";
        filterBooks("");
      }
    });
  }

  if (searchBtn) searchBtn.addEventListener("click", () => filterBooks(searchInput.value));
  if (clearBtn) clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    filterBooks("");
  });

  // Book request handling
  if (tbody) {
    tbody.addEventListener("click", (e) => {
      if (!e.target.matches(".request-btn")) return;
      const row = e.target.closest("tr");
      const title = row.querySelector(".title")?.textContent.trim() || "Unknown Book";
      const author = row.querySelector(".author")?.textContent.trim() || "Unknown Author";

      // Clear "no requests" message
      if (requestList.querySelector(".no-requests")) {
        requestList.innerHTML = "";
      }

      // Create request item
      const requestItem = document.createElement("div");
      requestItem.className = "request-item";
      requestItem.innerHTML = `
        <div style="flex: 1;">
          <div class="request-item-text">
            <strong>${title}</strong> by ${author}
          </div>
          <div class="request-item-date">
            Requested on ${new Date().toLocaleString()}
          </div>
        </div>
        <button class="remove-request-btn">
          <i class="fas fa-trash"></i> Remove
        </button>
      `;
      
      const removeBtn = requestItem.querySelector(".remove-request-btn");
      removeBtn.addEventListener("click", () => {
        requestItem.remove();
        if (requestList.querySelectorAll(".request-item").length === 0) {
          requestList.innerHTML = `
            <div class="no-requests">
              <i class="fas fa-smile-wink" style="font-size: 32px; margin-bottom: 10px; display: block; color: #ccc;"></i>
              No requests yet. Start requesting books!
            </div>
          `;
        }
      });

      requestList.appendChild(requestItem);

      // Disable button
      e.target.textContent = "✓ Requested";
      e.target.disabled = true;
    });
  }
});