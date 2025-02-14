// Modular Reason Modal Handler
function handleReasonModal(reqId, actionType) {
  const request = requests.find(req => req.reqId === reqId);

  if (!request) return;

  reasonModal.classList.remove("hidden");

  submitReasonButton.onclick = function () {
    const reason = reasonText.value.trim();

    if (reason) {
      if (actionType === "approve") {
        request.status = "Approved";
        request.approvalReason = reason;
        request.approvalDate = new Date().toLocaleString();
        renderApprovedList();
      } else if (actionType === "onhold") {
        request.status = "On Hold";
        request.holdReason = reason;
        request.holdDate = new Date().toLocaleString();
        renderOnHoldList();
      }

      saveToLocalStorage();
      renderRequestList();
      reasonModal.classList.add("hidden");
    }
  };
}

// Event Delegation for Approve/On Hold Buttons
document.addEventListener("click", (e) => {
  if (e.target && e.target.classList.contains("approve-btn")) {
    handleReasonModal(e.target.getAttribute("data-id"), "approve");
  }

  if (e.target && e.target.classList.contains("onhold-btn")) {
    handleReasonModal(e.target.getAttribute("data-id"), "onhold");
  }
});

// Initial Render
reqIdField.value = generateReqID();
renderRequestList();
