# Plan

## Objetivo
Integrar dos módulos frontend completos en Cloud Esther sin cambiar el diseño general, el menú lateral ni la navegación existente.

## IA Esther
- Reemplazar la pantalla actual por una experiencia conversacional odontológica profesional.
- Mantener el encabezado del módulo con título, descripción e indicador “Esther está disponible”.
- Usar componentes base de chat para conversación, mensajes, carga y campo de escritura.
- Agregar avatar/identidad de Esther, mensajes demo, preguntas sugeridas, adjuntar información, limpiar conversación y estado “Esther está analizando...”.
- Crear respuestas demo clínicas/administrativas con métricas, alertas y recomendaciones, sin diagnósticos médicos automáticos.
- Incluir panel “Contexto clínico” con paciente demo, alertas, evolución reciente y acciones “Ver historia clínica” y “Analizar paciente”.
- Separar tipos, datos mock y servicios simulados para poder reemplazarlos luego por backend, IA real, agenda, pacientes, documentos e historia clínica.

## Odontograma 3D
- Expandir el odontograma existente con dentición 3D interactiva, selección de piezas, hover, resaltado y numeración FDI.
- Agregar controles de vista: zoom, rotación, centrar, vista frontal, vista superior y restablecer.
- Soportar estados odontológicos: sano, caries, restauración, corona, implante, ausente, extracción indicada, conducto, fractura, prótesis, sellante, puente y observación.
- Mostrar cada estado con color más indicadores/etiquetas/patrones para no depender solo del color.
- Crear panel lateral de pieza dental con estado, superficie, diagnóstico, tratamiento, fecha, odontólogo, observaciones y acciones.
- Agregar tabs: Odontograma, Historial, Tratamientos, Evoluciones y Observaciones.
- Crear modal “Nueva evolución clínica” con campos solicitados; al guardar, actualizar el mock, el historial y el odontograma visible.
- Añadir leyenda compacta y línea temporal mock.

## Integración IA + Odontograma
- Agregar “Analizar con Esther” desde el odontograma.
- Abrir IA Esther con contexto demo del paciente/odontograma y precargar la consulta “Analiza el estado odontológico de este paciente.”.

## Alcance técnico
- Solo frontend y datos mock/locales; no claves, endpoints reales, base de datos ni backend.
- Mantener los tokens visuales existentes, light/dark mode y responsive desktop/tablet/mobile.
- No tocar sidebar, header global, login, dashboard ni configuración global.
- Verificar con typecheck y una revisión visual del flujo principal.
