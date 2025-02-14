export default function approveRequest(id, db) {
  const transaction = db.transaction(['requests', 'approvedRequests'], 'readwrite');
  const source = transaction.objectStore('requests');
  const target = transaction.objectStore('approvedRequests');

  const getRequest = source.get(id);

  getRequest.onsuccess = (event) => {
    const data = event.target.result;

    target.add(data).onsuccess = () => {
      source.delete(id).onsuccess = () => {
        console.log("Request approved!");
        document.dispatchEvent(new Event('reloadRequests')); // Notify to reload list
      };
    };
  };

  getRequest.onerror = (event) => {
    console.error("Error approving request:", event.target.errorCode);
  };
}