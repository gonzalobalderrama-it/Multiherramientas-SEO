// src/sidepanel/sidepanel.js
// Controlador principal del Side Panel

document.addEventListener('DOMContentLoaded', async () => {
  console.log('[Multiherramientas SEI] Side Panel montado.');
  const container = document.getElementById('tool-container');
  
  try {
    // Importar dinámicamente e inicializar el módulo del validador de egreso
    const { initValidadorEgreso } = await import('../tools/validador-egreso/validador.js');
    if (typeof initValidadorEgreso === 'function') {
      initValidadorEgreso(container);
    }
  } catch (error) {
    console.error('[Multiherramientas SEI] Error cargando módulo inicial:', error);
  }
});
