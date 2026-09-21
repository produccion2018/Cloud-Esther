# Plan

## Objetivo
Implementar dos módulos frontend completos dentro del panel actual de Cloud Esther, respetando la navegación, el sidebar, los colores semánticos existentes y el estilo visual de la aplicación.

## IA Esther
- Reemplazar la pantalla actual de IA Esther por una experiencia conversacional odontológica completa.
- Mantener el `PageHeader` existente y agregar el estado “Esther está disponible”.
- Crear un panel de conversación con avatar de Esther, mensajes, input, adjuntar, enviar, limpiar y estado “Esther está analizando...”.
- Agregar consultas rápidas especializadas que generen respuestas demo con métricas, listas, alertas y recomendaciones.
- Agregar un panel “Contexto clínico” con paciente seleccionado, alertas, evoluciones recientes y acciones “Ver historia clínica” / “Analizar paciente”.
- Separar tipos, datos mock y lógica demo en archivos reutilizables para poder conectar IA, pacientes, historia clínica y módulos reales después.

## Odontograma 3D
- Crear una pantalla de módulo “Odontograma 3D” integrada al panel existente, sin crear sidebar ni cambiar navegación global.
- Usar React Three Fiber ya instalado para mostrar arcada superior e inferior, dientes FDI individuales, volumen, separación, labels y estados visuales.
- Permitir seleccionar piezas, hover, resaltado, rotación, zoom, paneo y controles de vista.
- Crear panel del diente con estado, superficies, diagnóstico, tratamiento, observaciones y acciones.
- Agregar tabs de Odontograma, Historial, Tratamientos, Evoluciones y Observaciones.
- Crear modal “Nueva evolución clínica” con campos solicitados; al guardar, actualizar el odontograma, agregar historial mock y mostrar confirmación.
- Agregar leyenda compacta con estados odontológicos usando color, icono/etiqueta/patrón para no depender solo del color.

## Integración IA + Odontograma
- Agregar “Analizar con Esther” desde el odontograma.
- Al usarlo, abrir la pantalla IA Esther con una consulta prellenada y contexto mock del paciente/odontograma mediante parámetros locales de navegación.
- La respuesta demo de Esther usará ese contexto conceptual sin llamar APIs reales.

## Detalles técnicos
- No se implementará backend, base de datos, endpoints reales ni claves.
- Se crearán tipos TypeScript y servicios mock separados para conversación, análisis clínico y odontograma.
- Se mantendrán las variables semánticas existentes (`bg-primary`, `bg-card`, `text-foreground`, etc.) y se evitarán colores hardcodeados en UI.
- Se agregará metadata propia en rutas nuevas o modificadas según corresponda.
