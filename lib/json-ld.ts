/**
 * Serializa dados para script JSON-LD de forma segura.
 *
 * Por que: `JSON.stringify` sozinho pode gerar `</script>` dentro do HTML
 * e o navegador fechar a tag cedo. Escapar `<` como `\u003c` evita isso
 * sem mudar o significado do JSON.
 */
export function toJsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
