(() => {
  let currentPath = location.pathname;

  function init() {
    document.getElementById('gh-checkout-widget')?.remove();
    document.getElementById('gh-clone-style')?.remove();

    const match = location.pathname.match(/^\/([^/]+\/[^/]+)\/?$/);
    if (!match) return;

    const repo = match[1];
    const urls = {
      https: `https://github.com/${repo}.git`,
      ssh: `git@github.com:${repo}.git`,
    };

    let mode = localStorage.getItem('gh-clone-mode') || 'https';

    const style = document.createElement('style');
    style.id = 'gh-clone-style';
    style.textContent = `
      #gh-checkout-widget {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        background: #161b22;
        border: 1px solid #30363d;
        border-radius: 8px;
        padding: 10px 12px;
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        gap: 8px;
        font-family: ui-monospace, monospace;
        font-size: 12px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.4);
        color: #e6edf3;
        min-width: 0;

        & .toggle {
          display: flex;
          border: 1px solid #30363d;
          border-radius: 5px;
          overflow: hidden;

          & button {
            background: none;
            border: none;
            cursor: pointer;
            color: #7d8590;
            font-family: ui-monospace, monospace;
            font-size: 11px;
            padding: 3px 8px;
            transition: background 0.15s, color 0.15s;

            &.active {
              background: #30363d;
              color: #e6edf3;
            }
          }
        }
      }

      #gh-clone-row {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 12px 14px;
        position: relative;
        border: 1px solid #30363d;
        border-radius: 5px;

        &:hover {
          background: rgba(3, 151, 178, 0.2);

          & .copy-icon { color: #e6edf3; }
        }

        & .label {
          border: none;
          white-space: nowrap;
          user-select: none;
        }

        & code {
          color: #79c0ff;
          background: none;
          white-space: nowrap;
        }

        & .copy-icon {
          color: #7d8590;
          display: flex;
          align-items: center;
          margin-left: 10px !important;
          transition: color 0.15s;
          flex-shrink: 0;
        }

        & .gh-halo {
          position: absolute;
          top: 50%;
          right: 0;
          transform: translate(0%, -80px);
          background: #0397B2;
          color: #ffffff;
          font-size: 12px;
          font-weight: 600;
          padding: 6px 12px;
          border-radius: 20px;
          pointer-events: none;
          white-space: nowrap;
          font-family: sans-serif;
          animation: gh-halo-anim 0.8s ease forwards;
        }
      }

      @keyframes gh-halo-anim {
        0%   { opacity: 0; transform: translate(0%, -80px); }
        20%  { opacity: 1; transform: translate(0%, -100px); }
        90%  { opacity: 1; transform: translate(0%, -100px); }
        100% { opacity: 0; transform: translate(0%, -120px); }
      }
    `;

    const copyIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;

    const widget = document.createElement('div');
    widget.id = 'gh-checkout-widget';
    widget.innerHTML = `
      <div class="toggle">
        <button id="gh-https-btn">HTTPS</button>
        <button id="gh-ssh-btn">SSH</button>
      </div>
      <div id="gh-clone-row">
        <span class="label">git clone</span>
        <code id="gh-clone-url"></code>
        <span class="copy-icon">${copyIcon}</span>
      </div>
    `;

    document.head.appendChild(style);
    document.body.appendChild(widget);

    const urlEl = document.getElementById('gh-clone-url');
    const httpsBtn = document.getElementById('gh-https-btn');
    const sshBtn = document.getElementById('gh-ssh-btn');
    const cloneRow = document.getElementById('gh-clone-row');

    function setMode(m, save = true) {
      mode = m;
      urlEl.textContent = urls[mode];
      httpsBtn.classList.toggle('active', mode === 'https');
      sshBtn.classList.toggle('active', mode === 'ssh');
      if (save) localStorage.setItem('gh-clone-mode', mode);
    }

    function triggerCopy() {
      navigator.clipboard.writeText(`git clone ${urls[mode]}`);
      const halo = document.createElement('div');
      halo.className = 'gh-halo';
      halo.textContent = 'Copied!';
      cloneRow.appendChild(halo);
      setTimeout(() => halo.remove(), 1400);
    }

    httpsBtn.addEventListener('click', () => setMode('https'));
    sshBtn.addEventListener('click', () => setMode('ssh'));
    cloneRow.addEventListener('click', triggerCopy);

    setMode(mode, false);
  }

  window.addEventListener('popstate', init);

  new MutationObserver(() => {
    if (location.pathname !== currentPath) {
      currentPath = location.pathname;
      init();
    }
  }).observe(document.body, { childList: true, subtree: true });

  init();
})();