// DOM Elements
const form = document.getElementById("blood-request-form");
const requestList = document.getElementById("request-list").querySelector("tbody");
const approvedList = document.getElementById("approved-list-section").querySelector("tbody");
const onHoldList = document.getElementById("on-hold-list-section").querySelector("tbody");
const reqIdField = document.getElementById("req-id");
const reasonModal = document.getElementById("modal");
const reasonText = document.getElementById("reason-text");
const submitReasonButton = document.getElementById("submit-reason");
const cancelReasonButton = document.getElementById("cancel-reason");

// Data Storage
let requests = JSON.parse(localStorage.getItem("bloodRequests")) || [];
let lastReqId = JSON.parse(localStorage.getItem("lastReqId")) || 0;

// Utility Functions
const saveToLocalStorage = () => {
  localStorage.setItem("bloodRequests", JSON.stringify(requests));
  localStorage.setItem("lastReqId", JSON.stringify(lastReqId));
};

const generateReqID = () => {
  lastReqId += 1;
  return `Req${String(lastReqId).padStart(3, "0")}`;
};

const renderList = (list, status, targetElement) => {
  targetElement.innerHTML = "";
  requests
    .filter((req) => req.status === status)
    .forEach((request) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${request.reqId}</td>
        <td>${request.name}</td>
        <td>${request.bloodType}</td>
        <td>${request.quantity}</td>
        <td>${request.price || "N/A"}</td>
        <td>${request.deliveryMethod || "N/A"}</td>
        <td>${request.deliveryAddress || "N/A"}</td>
        <td>${request.notes || "N/A"}</td>
        ${
          status === "Pending"
            ? `<td>
                <button class="approve-btn" data-id="${request.reqId}">Approve</button>
                <button class="onhold-btn" data-id="${request.reqId}">On Hold</button>
              </td>`
            : status === "Approved"
            ? `<td>${request.approvalReason || "N/A"}</td>
               <td>${request.approvalDate || "N/A"}</td>`
            : `<td>${request.holdReason || "N/A"}</td>
               <td>
                 <button class="approve-btn" data-id="${request.reqId}">Approve</button>
               </td>`
        }
      `;
      targetElement.appendChild(row);
    });
};

const renderAllLists = () => {
  renderList(requestList, "Pending", requestList);
  renderList(approvedList, "Approved", approvedList);
  renderList(onHoldList, "On Hold", onHoldList);
};

// Event Handlers
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("approve-btn")) {
    const reqId = e.target.dataset.id;
    openReasonModal(reqId, "approve");
  }

  if (e.target.classList.contains("onhold-btn")) {
    const reqId = e.target.dataset.id;
    openReasonModal(reqId, "onhold");
  }
});

const openReasonModal = (reqId, actionType) => {
  reasonModal.classList.remove("hidden");
  reasonText.value = "";

  submitReasonButton.onclick = () => {
    const reason = reasonText.value.trim();
    if (!reason) return;

    const request = requests.find((req) => req.reqId === reqId);
    if (actionType === "approve") {
      request.status = "Approved";
      request.approvalReason = reason;
      request.approvalDate = new Date().toLocaleString();
    } else if (actionType === "onhold") {
      request.status = "On Hold";
      request.holdReason = reason;
    }

    saveToLocalStorage();
    renderAllLists();
    reasonModal.classList.add("hidden");
  };
};

cancelReasonButton.onclick = () => {
  reasonModal.classList.add("hidden");
};

// Form Submission
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newRequest = {
    reqId: generateReqID(),
    name: document.getElementById("requester-name").value,
    email: document.getElementById("requester-email").value,
    phone: document.getElementById("requester-phone").value,
    bloodType: document.getElementById("blood-type").value,
    quantity: parseInt(document.getElementById("quantity").value, 10),
    price: document.querySelector("input[name='price']:checked").value,
    deliveryMethod: document.getElementById("delivery-method").value,
    deliveryAddress: document.getElementById("delivery-address").value || "N/A",
    notes: document.getElementById("additional-notes").value || "N/A",
    status: "Pending",
  };

  requests.push(newRequest);
  saveToLocalStorage();
  renderAllLists();
  form.reset();
  reqIdField.value = generateReqID();
});

// Initial Setup
reqIdField.value = generateReqID();
renderAllLists();
