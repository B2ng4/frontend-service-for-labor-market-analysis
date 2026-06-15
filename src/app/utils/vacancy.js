export const SOURCE_LABELS = {
  hh: "HH.ru",
  avito: "Авито",
  superjob: "SuperJob",
};

export const SOURCE_TYPES = {
  hh: "primary",
  avito: "success",
  superjob: "warning",
};

export const buildSalaryLabel = (salaryFrom, salaryTo) => {
  const from = typeof salaryFrom === "number" ? salaryFrom : null;
  const to = typeof salaryTo === "number" ? salaryTo : null;
  if (from && to) return `${from.toLocaleString("ru-RU")} - ${to.toLocaleString("ru-RU")} ₽`;
  if (from) return `от ${from.toLocaleString("ru-RU")} ₽`;
  if (to) return `до ${to.toLocaleString("ru-RU")} ₽`;
  return "Не указана";
};

export const normalizeSource = (value) => {
  const source = String(value || "").toLowerCase();
  if (source.includes("hh")) return "hh";
  if (source.includes("super")) return "superjob";
  if (source.includes("avito")) return "avito";
  return source || "hh";
};

export const mapRecommendationVacancy = (item, index = 0) => {
  const source = normalizeSource(item?.source);
  const tags = [...(item?.matched_skills || []), ...(item?.missing_skills || [])];
  return {
    id: item?.processed_uuid || item?.raw_uuid || String(index),
    title: item?.title || "Без названия",
    company: item?.employer || "Не указано",
    salaryMin: item?.salary_from ?? null,
    salaryMax: item?.salary_to ?? null,
    salary: buildSalaryLabel(item?.salary_from, item?.salary_to),
    match: Number(item?.match_percent || 0),
    tags,
    region: item?.city || "Не указано",
    source,
    url: item?.vacancy_url || null,
    description: item?.description || "",
  };
};

export const mapSearchVacancy = (item, index = 0) => {
  const source = normalizeSource(item?.source);
  return {
    id: item?.processed_uuid || item?.raw_uuid || String(index),
    title: item?.title || "Без названия",
    company: item?.employer || "Не указано",
    salaryMin: item?.salary_from ?? null,
    salaryMax: item?.salary_to ?? null,
    salary: buildSalaryLabel(item?.salary_from, item?.salary_to),
    match: 0,
    tags: [],
    region: item?.city || item?.region || "Не указано",
    source,
    url: item?.url || null,
    description: item?.description || "",
  };
};
