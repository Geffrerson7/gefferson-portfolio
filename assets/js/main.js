/* ========================================
   GLOBAL HELPERS
======================================== */

(() => {
    // Keep the footer year up to date
    const year = document.getElementById('current-year');
    if (year) year.textContent = String(new Date().getFullYear());
})();
