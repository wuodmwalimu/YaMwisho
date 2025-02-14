export default function denyRequest(id, db) {
  const denialModal = document.getElementById('denialModal');
  const confirmDenyBtn = document.getElementById('confirmDeny');

  denialModal.showModal();

  confirmDenyBtn.onclick = () => {
    const selectedReasons = Array.from(
      document.querySelectorAll('input[name="denialReasons"]:checked')
    ).map((checkbox) => checkbox.value);

    if (selectedReasons.length > 0) {
      const transaction = db.transaction(['requests', 'deniedRequests'], 'readwrite');
      const source = transaction.objectStore('requests');
      const target = transaction.objectStore('deniedRequests');

      const getRequest = source.get(id);

      getRequest.onsuccess = (event) => {
        const data = { ...event.target.result, denialReasons: selectedReasons };

        target.add(data).onsuccess = () => {
          source.delete(id).onsuccess = () => {
            console.log("Request denied!");
            denialModal.close();
            document.dispatchEvent(new Event('reloadRequests')); // Notify to reload list
          };
        };
      };

      getRequest.onerror = (event) => {
        console.error("Error denying request:", event.target.errorCode);
      };
    } else {
      alert("Please select at least one reason for denial.");
    }
  };

  denialModal.querySelector('button[type="reset"]').onclick = () => {
    denialModal.close();
  };
}