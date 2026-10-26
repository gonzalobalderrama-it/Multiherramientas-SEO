// src/background/service-worker.js
// Service Worker principal para Multiherramientas SEI (Manifest V3)

chrome.runtime.onInstalled.addListener(() => {
  console.log('[Multiherramientas SEI] Extensión inicializada correctamente.');
});

// Configurar comportamiento para que el clic en el ícono abra el Side Panel automáticamente
if (chrome.sidePanel && typeof chrome.sidePanel.setPanelBehavior === 'function') {
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => {
      console.warn('[Multiherramientas SEI] No se pudo configurar openPanelOnActionClick:', error);
    });
}
