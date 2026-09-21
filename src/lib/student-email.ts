const UNIVERSITY_DOMAIN = "maastrichtuniversity.nl";

export function normalizeStudentEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isMaastrichtUniversityEmail(email: string) {
  const normalized = normalizeStudentEmail(email);
  const atIndex = normalized.lastIndexOf("@");

  if (atIndex <= 0 || atIndex === normalized.length - 1) {
    return false;
  }

  const domain = normalized.slice(atIndex + 1);
  return (
    domain === UNIVERSITY_DOMAIN || domain.endsWith(`.${UNIVERSITY_DOMAIN}`)
  );
}

export function studentEmailError(email: string) {
  const normalized = normalizeStudentEmail(email);

  if (!normalized || !normalized.includes("@")) {
    return "Please enter a valid student email address.";
  }

  if (!isMaastrichtUniversityEmail(normalized)) {
    return "Only Maastricht University email addresses are allowed (for example name@maastrichtuniversity.nl or name@student.maastrichtuniversity.nl).";
  }

  return null;
}
