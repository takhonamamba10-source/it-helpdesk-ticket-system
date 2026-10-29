const STORAGE_KEY = "itHelpdeskTickets_v1";

const starterTickets = [
  {
    id: "HD-1001",
    title: "Laptop cannot connect to Wi-Fi",
    requester: "Alex Mokoena",
    category: "Network",
    priority: "High",
    status: "Open",
    description: "User cannot connect to the office wireless network. Restarted the laptop, but the issue continues.",
    createdAt: "2026-10-26"
  },
  {
    id: "HD-1002",
    title: "Printer is not responding",
    requester: "Lerato Dlamini",
    category: "Printer",
    priority: "Medium",
    status: "In Progress",
    description: "Printer appears online but jobs remain in the queue. Checking the print queue and connection.",
    createdAt: "2026-10-27"
  },
  {
    id: "HD-1003",
    title: "Install approved office software",
    requester: "Sipho Nkosi",
    category: "Software",
    priority: "Low",
    status: "Resolved",
    description: "Requested installation of approved office software. Installation completed and tested.",
    createdAt: "2026-10-28"
  }
];

const elements = {
  total: document.getElementById("totalCount"),
  open: document.getElementById("openCount"),
  progress: document.getElementById("progressCount"),
  resolved: document.getElementById("resolvedCount"),
  body: document.getElementById("ticketTableBody"),
  empty: document.getElementById("emptyState"),
  countLabel: document.getElementById("ticketCountLabel"),
  search: document.getElementById("searchInput"),
  statusFilter: document.getElementById("statusFilter"),
  priorityFilter: document.getElementById("priorityFilter"),
  dialog: document.getElementById("ticketDialog"),
  form: document.getElementById("ticketForm"),
  dialogTitle: document.getElementById("dialogTitle"),
  editingId: document.getElementById("editingTicketId"),
  title: document.getElementById("ticketTitle"),
  requester: document.getElementById("requester"),
  category: document.getElementById("category"),
  priority: document.getElementById("priority"),
  status: document.getElementById("status"),
  description: document.getElementById("description"),
  saveButton: document.getElementById("saveTicketButton"),
  toast: document.getElementById("toast")
};

let tickets = loadTickets();
let toastTimer;

function loadTickets() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.warn("Could not load saved tickets:", error);
  }
  return structuredCloneSafe(starterTickets);
}

function structuredCloneSafe(value) {
  return JSON.parse(JSON.stringify(value));
}

function saveTickets() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
  } catch (error) {
    showToast("Could not save data in this browser.");
    console.error("Could not save tickets:", error);
  }
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[character]);
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

function statusClass(status) {
  return status.toLowerCase().replace(/\s+/g, "-");
}

function renderTickets() {
  elements.total.textContent = tickets.length;
  elements.open.textContent = tickets.filter(ticket => ticket.status === "Open").length;
  elements.progress.textContent = tickets.filter(ticket => ticket.status === "In Progress").length;
  elements.resolved.textContent = tickets.filter(ticket => ticket.status === "Resolved").length;

  const query = elements.search.value.trim().toLowerCase();
  const selectedStatus = elements.statusFilter.value;
  const selectedPriority = elements.priorityFilter.value;

  const filtered = tickets.filter(ticket => {
    const searchable = [
      ticket.id, ticket.title, ticket.requester, ticket.category,
      ticket.priority, ticket.status, ticket.description
    ].join(" ").toLowerCase();
    return searchable.includes(query)
      && (selectedStatus === "all" || ticket.status === selectedStatus)
      && (selectedPriority === "all" || ticket.priority === selectedPriority);
  });

  elements.body.innerHTML = filtered.map(ticket => `
    <tr>
      <td>
        <span class="ticket-id">${escapeHTML(ticket.id)}</span>
        <span class="ticket-title">${escapeHTML(ticket.title)}</span>
        <span class="ticket-desc">${escapeHTML(ticket.description)}</span>
      </td>
      <td><span class="requester">${escapeHTML(ticket.requester)}</span></td>
      <td>${escapeHTML(ticket.category)}</td>
      <td><span class="pill priority-${ticket.priority.toLowerCase()}">${escapeHTML(ticket.priority)}</span></td>
      <td><span class="pill status-${statusClass(ticket.status)}">${escapeHTML(ticket.status)}</span></td>
      <td>${formatDate(ticket.createdAt)}</td>
      <td>
        <div class="row-actions">
          <button class="action-button" type="button" data-action="edit" data-id="${escapeHTML(ticket.id)}">Edit</button>
          <button class="action-button delete-button" type="button" data-action="delete" data-id="${escapeHTML(ticket.id)}">Delete</button>
        </div>
      </td>
    </tr>
  `).join("");

  elements.empty.hidden = filtered.length > 0;
  elements.countLabel.textContent = `Showing ${filtered.length} of ${tickets.length} ticket${tickets.length === 1 ? "" : "s"}`;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function openNewTicketForm() {
  elements.form.reset();
  elements.editingId.value = "";
  elements.dialogTitle.textContent = "Create new ticket";
  elements.saveButton.textContent = "Save ticket";
  elements.priority.value = "Medium";
  elements.status.value = "Open";
  elements.dialog.showModal();
  elements.title.focus();
}

function openEditForm(ticketId) {
  const ticket = tickets.find(item => item.id === ticketId);
  if (!ticket) return;
  elements.form.reset();
  elements.editingId.value = ticket.id;
  elements.title.value = ticket.title;
  elements.requester.value = ticket.requester;
  elements.category.value = ticket.category;
  elements.priority.value = ticket.priority;
  elements.status.value = ticket.status;
  elements.description.value = ticket.description;
  elements.dialogTitle.textContent = `Edit ${ticket.id}`;
  elements.saveButton.textContent = "Update ticket";
  elements.dialog.showModal();
  elements.title.focus();
}

function createTicketId() {
  const highestNumber = tickets.reduce((highest, ticket) => {
    const match = ticket.id.match(/^HD-(\d+)$/);
    return match ? Math.max(highest, Number(match[1])) : highest;
  }, 1000);
  return `HD-${highestNumber + 1}`;
}

elements.form.addEventListener("submit", event => {
  event.preventDefault();

  const title = elements.title.value.trim();
  const requester = elements.requester.value.trim();
  const description = elements.description.value.trim();

  if (!title || !requester || !description) {
    showToast("Please complete all required fields.");
    return;
  }

  const editingId = elements.editingId.value;
  const formData = {
    title,
    requester,
    category: elements.category.value,
    priority: elements.priority.value,
    status: elements.status.value,
    description
  };

  if (editingId) {
    tickets = tickets.map(ticket => ticket.id === editingId ? { ...ticket, ...formData } : ticket);
    showToast("Ticket updated successfully.");
  } else {
    tickets.unshift({
      id: createTicketId(),
      ...formData,
      createdAt: new Date().toISOString().slice(0, 10)
    });
    showToast("New ticket created.");
  }

  saveTickets();
  renderTickets();
  elements.dialog.close();
});

elements.body.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const ticketId = button.dataset.id;
  if (button.dataset.action === "edit") {
    openEditForm(ticketId);
  } else if (button.dataset.action === "delete") {
    const ticket = tickets.find(item => item.id === ticketId);
    if (!ticket) return;
    if (confirm(`Delete ${ticket.id}: "${ticket.title}"? This cannot be undone.`)) {
      tickets = tickets.filter(item => item.id !== ticketId);
      saveTickets();
      renderTickets();
      showToast("Ticket deleted.");
    }
  }
});

document.getElementById("newTicketButton").addEventListener("click", openNewTicketForm);
document.getElementById("emptyNewTicketButton").addEventListener("click", openNewTicketForm);
document.getElementById("closeDialogButton").addEventListener("click", () => elements.dialog.close());
document.getElementById("cancelDialogButton").addEventListener("click", () => elements.dialog.close());

elements.search.addEventListener("input", renderTickets);
elements.statusFilter.addEventListener("change", renderTickets);
elements.priorityFilter.addEventListener("change", renderTickets);

document.getElementById("resetDemoButton").addEventListener("click", () => {
  if (confirm("Reset all tickets to the original demo examples? Your current browser tickets will be replaced.")) {
    tickets = structuredCloneSafe(starterTickets);
    saveTickets();
    elements.search.value = "";
    elements.statusFilter.value = "all";
    elements.priorityFilter.value = "all";
    renderTickets();
    showToast("Demo data restored.");
  }
});

elements.dialog.addEventListener("click", event => {
  if (event.target === elements.dialog) elements.dialog.close();
});

renderTickets();
