/**
 * Monta o selo "CRM / RQE..." do card do autor.
 * Aceita um ou vários RQEs e evita duplicar o prefixo "CRM"/"RQE".
 */
export function formatDoctorCrmBadge(
  crm?: string | null,
  rqe?: string[] | null
): string {
  const rawCrm = (crm || "").trim();
  const crmLabel = !rawCrm
    ? "CRM"
    : rawCrm.toUpperCase().startsWith("CRM")
      ? rawCrm
      : `CRM ${rawCrm}`;

  const rqeLabels = (rqe || [])
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) =>
      item.toUpperCase().startsWith("RQE") ? item : `RQE ${item}`
    );

  if (!rqeLabels.length) return crmLabel;
  return `${crmLabel} / ${rqeLabels.join(" · ")}`;
}
