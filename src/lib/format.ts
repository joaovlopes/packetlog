export function formatDate(iso: string) {
  const date = new Date(`${iso}T12:00:00`)
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })
}
