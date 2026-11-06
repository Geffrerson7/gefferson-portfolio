/* ========================================
   CONTACT FORM
   - Sends to Formspree via fetch (no page reload) and reports status.
   - The Formspree endpoint (with its ID) lives ONLY in the form's
     `action` attribute in the HTML.
   - Safety net: if the action still contains the original placeholder,
     the form opens the visitor's email client instead of hitting a 404.
   - All user-facing messages come from data-msg-* attributes on the form,
     so each language version supplies its own texts.
======================================== */

(() => {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('contact-form-status');

    if (!form || !status) return;

    const submit = form.querySelector('[type="submit"]');
    const fields = [...form.querySelectorAll('input, textarea')];
    const msg = form.dataset;

    // Marker used before a real Formspree ID was configured. Not the ID itself.
    const PLACEHOLDER_MARKER = 'TU_ID_DE_FORMSPREE';

    function setStatus(message, type = '') {
        status.textContent = message;
        status.classList.toggle('is-success', type === 'success');
        status.classList.toggle('is-error', type === 'error');
    }

    /* ---------- Localised validation messages ---------- */

    function validationMessage(field) {
        if (field.validity.valueMissing) return msg.msgRequired || '';
        if (field.validity.typeMismatch) return msg.msgEmail || '';
        return '';
    }

    fields.forEach(field => {
        field.addEventListener('invalid', () => {
            field.setCustomValidity(validationMessage(field));
            field.setAttribute('aria-invalid', 'true');
        });

        field.addEventListener('input', () => {
            field.setCustomValidity('');
            if (field.validity.valid) field.removeAttribute('aria-invalid');
        });
    });

    /* ---------- Fallback: email client ---------- */

    function openMailClient(data) {
        const to = msg.fallbackEmail;
        const subject = encodeURIComponent(data.get('subject') || msg.msgMailSubject || '');
        const body = encodeURIComponent(
            `${data.get('message')}\n\n— ${data.get('name')} (${data.get('email')})`
        );
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        setStatus(msg.msgMailto, 'success');
    }

    /* ---------- Submit ---------- */

    let isSending = false;

    // Loading state: spinner in the button, button disabled, form busy
    function setLoading(loading) {
        isSending = loading;
        submit.disabled = loading;
        submit.classList.toggle('is-loading', loading);
        form.setAttribute('aria-busy', String(loading));
    }

    form.addEventListener('submit', async event => {
        event.preventDefault();

        // Guard against double submits (Enter key repeat, double click)
        if (isSending) return;

        const data = new FormData(form);

        if (form.action.includes(PLACEHOLDER_MARKER)) {
            openMailClient(data);
            return;
        }

        setLoading(true);
        setStatus(msg.msgSending);

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { Accept: 'application/json' },
            });

            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            form.reset();
            fields.forEach(field => field.removeAttribute('aria-invalid'));
            setStatus(msg.msgSuccess, 'success');
        } catch {
            setStatus(msg.msgError, 'error');
        } finally {
            setLoading(false);
        }
    });
})();
